import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Hash, Trophy, QrCode, CheckCircle, User, Ticket } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

interface LotteryDraw {
  id: string
  drawCode: string
  lotteryId: string
  winnerId: string
  winningNumbers: string[]
  totalTicketsSold: number
  verificationHash: string
  winnerQrCode?: string
  drawnAt: string
}

interface Lottery {
  id: string
  title: string
  description: string
  lotteryCode: string
  drawDate: string
  soldTickets: number
  maxTickets: number
  status: string
}

interface DrawDisplayProps {
  drawCode?: string
  lotteryCode?: string
  showFullDetails?: boolean
}

export function LotteryDrawDisplay({ drawCode, lotteryCode, showFullDetails = true }: DrawDisplayProps) {
  const [verifyingQR, setVerifyingQR] = useState(false)

  // Fetch draw by draw code
  const { data: draw, isLoading: drawLoading } = useQuery<LotteryDraw>({
    queryKey: ['/api/lottery-draws/code', drawCode],
    enabled: !!drawCode
  })

  // Fetch lottery by lottery code
  const { data: lottery, isLoading: lotteryLoading } = useQuery<Lottery>({
    queryKey: ['/api/lotteries/code', lotteryCode],
    enabled: !!lotteryCode
  })

  if (drawLoading || lotteryLoading) {
    return (
      <Card data-testid="loading-draw-display">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (draw) {
    return (
      <Card data-testid="draw-details-card" className="w-full max-w-2xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-5 w-5 text-orange-500" />
                Draw Results
              </CardTitle>
              <CardDescription data-testid="text-draw-code" className="font-mono text-lg">
                {draw.drawCode}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {showFullDetails && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Draw Date</p>
                    <p data-testid="text-draw-date" className="font-medium">
                      {format(new Date(draw.drawnAt), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
                    <p data-testid="text-total-tickets" className="font-medium">
                      {draw.totalTicketsSold}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Winner ID:</span>
                  <code data-testid="text-winner-id" className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {draw.winnerId}
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Winning Numbers:</span>
                  <div className="flex gap-1">
                    {draw.winningNumbers.map((number: string, index: number) => (
                      <Badge key={index} variant="outline" className="font-mono">
                        {number}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verification Hash:</span>
                  <code data-testid="text-verification-hash" className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs break-all">
                    {draw.verificationHash}
                  </code>
                </div>
              </div>

              {draw.winnerQrCode && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Winner Verification
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        QR Code generated for winner verification
                      </p>
                      <Button
                        data-testid="button-verify-qr"
                        variant="outline"
                        size="sm"
                        onClick={() => setVerifyingQR(!verifyingQR)}
                      >
                        {verifyingQR ? 'Hide QR Data' : 'Show QR Data'}
                      </Button>
                      {verifyingQR && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(JSON.parse(draw.winnerQrCode), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  if (lottery && !draw) {
    return (
      <Card data-testid="lottery-details-card" className="w-full max-w-2xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-500" />
            {lottery.title}
          </CardTitle>
          <CardDescription data-testid="text-lottery-code" className="font-mono text-lg">
            {lottery.lotteryCode}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <p data-testid="text-lottery-description" className="text-gray-600 dark:text-gray-400">
            {lottery.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Draw Date</p>
              <p data-testid="text-lottery-draw-date" className="font-medium">
                {format(new Date(lottery.drawDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tickets Sold</p>
              <p data-testid="text-lottery-tickets-sold" className="font-medium">
                {lottery.soldTickets} / {lottery.maxTickets}
              </p>
            </div>
          </div>

          <Badge 
            variant={lottery.status === 'active' ? 'secondary' : 'outline'}
            className={lottery.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          >
            {lottery.status.charAt(0).toUpperCase() + lottery.status.slice(1)}
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-testid="not-found-card" className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {drawCode ? `Draw ${drawCode} not found` : lotteryCode ? `Lottery ${lotteryCode} not found` : 'No draw or lottery specified'}
        </p>
      </CardContent>
    </Card>
  )
}