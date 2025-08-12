import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Calendar, Clock, Coins, Users, Target, Sparkles, Gift, Star } from "lucide-react";

interface Lottery {
  id: string;
  title: string;
  description: string;
  ticketPrice: number;
  prizes: string;
  drawDate: string;
  lotteryCode: string;
  soldTickets: number;
  maxTickets: number;
}

export default function LotteriesCasinoStyle() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleEnterLottery = (lotteryId: string) => {
    window.location.href = `/lottery/${lotteryId}`;
  };

  const getPrizeValue = (prizesString: string) => {
    try {
      const prizes = JSON.parse(prizesString);
      const grandPrize = prizes.grand || "";
      const match = grandPrize.match(/\$([0-9,]+)/);
      return match ? match[1] : "4,500";
    } catch {
      return "4,500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white">Loading Premium Lotteries...</h2>
          <p className="text-purple-200 mt-2">Preparing your golden opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Casino Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-40 w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-60 right-1/3 w-4 h-4 bg-cyan-400 rounded-full animate-pulse delay-1200"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header with Casino Aesthetic */}
        <div className="text-center mb-12">
          <Button 
            variant="outline" 
            className="mb-8 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900 transition-all duration-300"
            onClick={() => window.location.href = '/dashboard'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 mb-4 animate-pulse">
              TravelLotto Casino
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Experience the thrill of premium travel lotteries with casino-style excitement
            </p>
          </div>

          {/* Live Stats Banner */}
          <div className="bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 rounded-xl border border-yellow-400/30 p-6 mb-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {lotteries.length}
                </div>
                <div className="text-purple-200 font-medium">Active Draws</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-1">
                  ${lotteries.reduce((sum, l) => {
                    try {
                      const prizes = JSON.parse(l.prizes);
                      const grandPrize = prizes.grand || "";
                      const match = grandPrize.match(/\$([0-9,]+)/);
                      return sum + (match ? parseInt(match[1].replace(',', '')) : 4500);
                    } catch {
                      return sum + 4500;
                    }
                  }, 0).toLocaleString()}
                </div>
                <div className="text-purple-200 font-medium">Total Prize Pool</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">
                  {lotteries.reduce((sum, l) => sum + (l.soldTickets || 0), 0)}
                </div>
                <div className="text-purple-200 font-medium">Active Players</div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Lottery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lotteries.map((lottery, index) => (
            <Card 
              key={lottery.id} 
              className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-indigo-900/90 border-2 border-yellow-400/30 hover:border-yellow-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 backdrop-blur-sm group"
            >
              {/* Premium Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* VIP Badge */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs px-3 py-1 animate-pulse">
                    🏆 VIP FEATURED
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs font-mono border-cyan-400/50 text-cyan-300 bg-cyan-400/10">
                    {lottery.lotteryCode}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
                    <Star className="h-3 w-3 text-pink-400 animate-pulse delay-200" />
                    <Star className="h-2 w-2 text-cyan-400 animate-pulse delay-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                  {lottery.title}
                </CardTitle>
                <p className="text-purple-200 text-sm leading-relaxed mt-2">
                  {lottery.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                {/* Jackpot Display */}
                <div className="bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 rounded-xl p-6 border border-yellow-400/30 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-cyan-400/10 animate-pulse"></div>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-300">GRAND JACKPOT</span>
                      <Trophy className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-2">
                      ${getPrizeValue(lottery.prizes)}
                    </div>
                    <div className="text-xs text-purple-300 font-medium">Premium Travel Experience</div>
                  </div>
                </div>
                
                {/* Lottery Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/60 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Coins className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-medium text-cyan-300">Entry Fee</span>
                    </div>
                    <div className="text-lg font-bold text-white">{lottery.ticketPrice} Kairos</div>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-pink-400" />
                      <span className="text-xs font-medium text-pink-300">Players</span>
                    </div>
                    <div className="text-lg font-bold text-white">{lottery.soldTickets || 0}/{lottery.maxTickets}</div>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-300">Draw Date</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {new Date(lottery.drawDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-medium text-green-300">Status</span>
                    </div>
                    <div className="text-sm font-bold text-green-400">LIVE</div>
                  </div>
                </div>
                
                {/* Premium Action Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 via-pink-500 to-cyan-500 hover:from-yellow-400 hover:via-pink-400 hover:to-cyan-400 text-black font-bold py-4 shadow-lg hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 relative overflow-hidden group"
                  onClick={() => handleEnterLottery(lottery.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Target className="mr-2 h-5 w-5" />
                  <span className="relative">ENTER LOTTERY - {lottery.title.split(' ')[0].toUpperCase()}</span>
                  <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No lotteries fallback */}
        {lotteries.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="mb-8">
              <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-6 animate-bounce" />
              <h3 className="text-3xl font-bold text-white mb-4">Casino Temporarily Closed</h3>
              <p className="text-purple-200 text-lg">New premium lotteries coming soon!</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-400 hover:to-pink-400 text-black font-bold"
              onClick={() => window.location.href = '/dashboard'}
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}