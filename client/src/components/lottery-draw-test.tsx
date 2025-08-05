import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, CheckCircle, AlertCircle, Hash, Trophy } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function LotteryDrawTest() {
  const [selectedLottery, setSelectedLottery] = useState<string>("")
  const queryClient = useQueryClient()

  // Fetch active lotteries
  const { data: lotteries, isLoading: lotteriesLoading } = useQuery({
    queryKey: ['/api/lotteries']
  })

  // Execute draw mutation
  const drawMutation = useMutation({
    mutationFn: async (lotteryId: string) => {
      const response = await fetch(`/api/lotteries/${lotteryId}/draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawExecutorId: 'test-admin' })
      })
      if (!response.ok) {
        throw new Error('Failed to execute draw')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate lottery queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/lotteries'] })
      queryClient.invalidateQueries({ queryKey: ['/api/lottery-draws'] })
    }
  })

  const handleExecuteDraw = () => {
    if (selectedLottery) {
      drawMutation.mutate(selectedLottery)
    }
  }

  if (lotteriesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading lotteries...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card data-testid="lottery-draw-test-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Test Lottery Drawing System
          </CardTitle>
          <CardDescription>
            Execute a lottery draw to test the unique identification and QR code generation system
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Lottery to Draw</label>
            <div className="grid gap-2">
              {lotteries?.map((lottery: any) => (
                <div
                  key={lottery.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLottery === lottery.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedLottery(lottery.id)}
                  data-testid={`lottery-option-${lottery.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{lottery.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {lottery.lotteryCode}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {lottery.soldTickets} tickets sold
                        </span>
                      </div>
                    </div>
                    <Badge variant={lottery.status === 'active' ? 'secondary' : 'outline'}>
                      {lottery.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            data-testid="button-execute-draw"
            onClick={handleExecuteDraw}
            disabled={!selectedLottery || drawMutation.isPending}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {drawMutation.isPending ? 'Executing Draw...' : 'Execute Draw'}
          </Button>
        </CardContent>
      </Card>

      {drawMutation.isSuccess && drawMutation.data && (
        <Card data-testid="draw-result-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Draw Completed Successfully
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Lottery draw executed successfully with unique codes generated.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Draw Information</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    <span className="text-gray-600">Draw Code:</span>
                    <code data-testid="text-draw-code" className="bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      {drawMutation.data.draw.drawCode}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-3 w-3" />
                    <span className="text-gray-600">Winner ID:</span>
                    <code data-testid="text-winner-id" className="bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      {drawMutation.data.draw.winnerId}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Winning Numbers:</span>
                    <div className="flex gap-1">
                      {drawMutation.data.draw.winningNumbers.map((num: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Test this result:</strong> Copy the draw code "{drawMutation.data.draw.drawCode}" 
                  and use it in the <a href="/lottery-verification" className="underline">Lottery Verification System</a> 
                  to see the complete draw details and QR code verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {drawMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription data-testid="text-error-message">
            {drawMutation.error instanceof Error ? drawMutation.error.message : 'Failed to execute draw'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}