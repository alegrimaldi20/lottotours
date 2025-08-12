import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Coins, 
  Clock, 
  ArrowLeft, 
  Star, 
  Sparkles,
  Target,
  Gift,
  Crown
} from "lucide-react";

interface Lottery {
  id: string;
  title: string;
  description: string;
  ticketPrice: number;
  prizeValue: number;
  drawDate: string;
  lotteryCode: string;
}

export default function LotteriesNew() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch lotteries data
    fetch('/api/lotteries')
      .then(res => res.json())
      .then(data => {
        setLotteries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading lotteries:', err);
        setLoading(false);
      });
  }, []);

  const handleBackToDashboard = () => {
    console.log('Going back to dashboard...');
    window.location.href = '/dashboard';
  };

  const handleEnterLottery = (lotteryId: string) => {
    console.log('Entering lottery:', lotteryId);
    window.location.href = `/lottery/${lotteryId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden-luck border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Loading Lotteries...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Casino-style background effects */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30"></div>
      
      {/* Floating sparkles */}
      <div className="absolute top-20 left-20 text-golden-luck animate-pulse">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute top-40 right-32 text-golden-luck animate-pulse delay-700">
        <Star className="w-4 h-4" />
      </div>
      <div className="absolute bottom-32 left-16 text-golden-luck animate-pulse delay-500">
        <Crown className="w-5 h-5" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
            className="mb-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="mb-6">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-golden-luck via-yellow-400 to-orange-400 mb-4">
              🎰 TRAVEL LOTTERIES
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Enter the ultimate travel lottery experience. Win luxury trips around the world!
            </p>
          </div>
          
          <Badge 
            variant="secondary" 
            className="text-lg px-6 py-2 bg-golden-luck/20 border-golden-luck text-golden-luck"
          >
            {lotteries.length} ACTIVE DRAWS
          </Badge>
        </div>

        {/* Lotteries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {lotteries.map((lottery, index) => (
            <Card 
              key={lottery.id} 
              className="relative overflow-hidden bg-gradient-to-br from-white/95 to-white/90 backdrop-blur border-2 border-golden-luck/30 shadow-2xl hover:shadow-golden-luck/20 transition-all duration-500 hover:scale-105 group"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-golden-luck/5 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Priority badge */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold animate-pulse">
                    HOT!
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant="outline" 
                    className="text-sm font-mono bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30"
                  >
                    {lottery.lotteryCode}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-6 w-6 text-golden-luck" />
                    <Sparkles className="h-4 w-4 text-golden-luck animate-pulse" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {lottery.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <p className="text-gray-700 leading-relaxed font-medium">
                  {lottery.description}
                </p>
                
                {/* Prize showcase */}
                <div className="bg-gradient-to-r from-golden-luck/10 to-orange-400/10 rounded-xl p-4 border border-golden-luck/20">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">GRAND PRIZE</div>
                    <div className="text-3xl font-extrabold text-golden-luck mb-2">
                      ${lottery.prizeValue}
                    </div>
                    <div className="text-sm text-gray-500">Travel Experience Package</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Coins className="h-4 w-4 text-blue-600" />
                      Entry Cost:
                    </span>
                    <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/30">
                      {lottery.ticketPrice} Kairos
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Draw Date:
                    </span>
                    <span className="text-sm font-mono bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                      {lottery.drawDate}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-golden-luck to-orange-400 hover:from-golden-luck/90 hover:to-orange-400/90 text-white font-bold py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
                  onClick={() => handleEnterLottery(lottery.id)}
                >
                  <Target className="mr-2 h-5 w-5" />
                  ENTER LOTTERY
                  <Gift className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No lotteries state */}
        {lotteries.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="mb-8">
              <Trophy className="w-24 h-24 mx-auto text-golden-luck/50 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">No Active Lotteries</h3>
              <p className="text-white/70 text-lg">New exciting lotteries coming soon!</p>
            </div>
            <Button 
              onClick={handleBackToDashboard}
              className="bg-golden-luck hover:bg-golden-luck/90"
            >
              Return to Dashboard
            </Button>
          </div>
        )}

        {/* Bottom stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-golden-luck mb-2">{lotteries.length}</div>
              <div className="text-white/70">Active Lotteries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-golden-luck mb-2">
                ${lotteries.reduce((sum, l) => sum + l.prizeValue, 0)}
              </div>
              <div className="text-white/70">Total Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-golden-luck mb-2">24/7</div>
              <div className="text-white/70">Always Open</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}