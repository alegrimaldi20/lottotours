import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, CheckCircle, AlertCircle, Shield, Hash } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

interface QRVerificationResult {
  isValid: boolean
  data?: any
  error?: string
}

export function QRVerification() {
  const [qrCodeData, setQrCodeData] = useState("")
  const [verificationResult, setVerificationResult] = useState<QRVerificationResult | null>(null)

  const verifyQRMutation = useMutation({
    mutationFn: async (qrData: string) => {
      const response = await fetch('/api/lottery-draws/verify-qr', {
        method: 'POST',
        body: JSON.stringify({ qrCodeData: qrData }),
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    },
    onSuccess: (result) => {
      setVerificationResult(result)
    },
    onError: (error) => {
      setVerificationResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      })
    }
  })

  const handleVerify = () => {
    if (!qrCodeData.trim()) return
    verifyQRMutation.mutate(qrCodeData)
  }

  const resetVerification = () => {
    setQrCodeData("")
    setVerificationResult(null)
  }

  return (
    <div className="space-y-6">
      <Card data-testid="qr-verification-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Verification
          </CardTitle>
          <CardDescription>
            Verify the authenticity of lottery winner QR codes for security validation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="qr-data" className="text-sm font-medium">
              QR Code Data
            </label>
            <Textarea
              id="qr-data"
              data-testid="textarea-qr-data"
              placeholder="Paste the QR code content here..."
              value={qrCodeData}
              onChange={(e) => setQrCodeData(e.target.value)}
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              data-testid="button-verify-qr"
              onClick={handleVerify}
              disabled={!qrCodeData.trim() || verifyQRMutation.isPending}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              {verifyQRMutation.isPending ? 'Verifying...' : 'Verify QR Code'}
            </Button>
            
            {verificationResult && (
              <Button
                data-testid="button-reset"
                variant="outline"
                onClick={resetVerification}
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {verificationResult && (
        <Card data-testid="verification-result-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {verificationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Verification Result
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Badge 
              variant={verificationResult.isValid ? "secondary" : "destructive"}
              className={verificationResult.isValid ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
            >
              {verificationResult.isValid ? 'VALID' : 'INVALID'}
            </Badge>

            {verificationResult.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription data-testid="text-error-message">
                  {verificationResult.error}
                </AlertDescription>
              </Alert>
            )}

            {verificationResult.isValid && verificationResult.data && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    QR code is authentic and verified against database records.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Draw Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Draw Code:</span>
                        <code data-testid="text-verified-draw-code" className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm">
                          {verificationResult.data.drawCode}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Ticket Code:</span>
                        <code data-testid="text-verified-ticket-code" className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm">
                          {verificationResult.data.ticketCode}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Winner ID:</span>
                        <code data-testid="text-verified-winner-id" className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm">
                          {verificationResult.data.winnerId}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Security Details
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded space-y-2">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Verification Hash:</span>
                        <code data-testid="text-verified-hash" className="block bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs mt-1 break-all">
                          {verificationResult.data.verificationHash}
                        </code>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Generated At:</span>
                        <p data-testid="text-generated-at" className="text-sm">
                          {new Date(verificationResult.data.generatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Verified At:</span>
                        <p data-testid="text-verified-at" className="text-sm">
                          {new Date(verificationResult.data.verifiedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}