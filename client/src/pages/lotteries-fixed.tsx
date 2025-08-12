import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Coins, Clock, ArrowRight, ArrowLeft } from "lucide-react";

interface Lottery {
  id: string;
  title: string;
  description: string;
  ticketPrice: number;
  prizeValue: number;
  drawDate: string;
  lotteryCode: string;
}

export default function LotteriesFixed() {
  const { data: lotteries = [], isLoading } = useQuery<Lottery[]>({
    queryKey: ["/api/lotteries"],
  });

  console.log("Lotteries page loaded", { lotteries, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Loading Lotteries...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.replace('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎲 Active Travel Lotteries
          </h1>
          <p className="text-lg text-gray-600">
            Choose your adventure and enter to win amazing travel experiences
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2 mt-4">
            {lotteries.length} Active Lotteries
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {lotteries.map((lottery) => (
            <Card key={lottery.id} className="hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-sm">
                    {lottery.lotteryCode}
                  </Badge>
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <CardTitle className="text-xl">{lottery.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {lottery.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Prize Value:</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      ${lottery.prizeValue}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Ticket Price:</span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{lottery.ticketPrice} Kairos</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Draw Date:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{lottery.drawDate}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  onClick={() => window.location.replace(`/lottery/${lottery.id}`)}
                >
                  Enter Lottery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {lotteries.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">No Active Lotteries</h3>
            <p className="text-gray-600">Check back soon for new lottery opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
}