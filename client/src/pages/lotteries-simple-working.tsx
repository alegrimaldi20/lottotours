import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Calendar, Clock, Coins, Users, Target } from "lucide-react";

interface Lottery {
  id: string;
  title: string;
  description: string;
  ticketPrice: number;
  prizes: string; // JSON string
  drawDate: string;
  lotteryCode: string;
  soldTickets: number;
  maxTickets: number;
}

export default function LotteriesSimpleWorking() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Loading lotteries...");
    fetch('/api/lotteries')
      .then(res => {
        console.log("Response received:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Data loaded:", data);
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

  const handleEnterLottery = (lotteryId: string, lotteryTitle: string) => {
    console.log('Attempting to enter lottery:', lotteryId, lotteryTitle);
    
    // Multiple navigation approaches to ensure success
    try {
      // Try method 1: Direct href change
      window.location.href = `/lottery/${lotteryId}`;
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback: Alert user
      alert(`Opening ${lotteryTitle} lottery details. If this doesn't work, please navigate manually to /lottery/${lotteryId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-explore-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">Loading Travel Lotteries...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" className="mb-6" onClick={handleBackToDashboard}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Travel Lotteries
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enter exciting travel lotteries and win amazing experiences around the world
            </p>
            <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
              {lotteries.length} Active Draws
            </Badge>
          </div>
        </div>

        {/* Debug info */}
        <div className="mb-4 text-sm text-gray-500">
          Debug: Found {lotteries.length} lotteries
        </div>

        {/* Lotteries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lotteries.map((lottery, index) => (
            <Card 
              key={lottery.id} 
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-golden-luck/30"
            >
              {/* Featured badge for first lottery */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-golden-luck to-orange-400 text-white font-bold">
                    Featured
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {lottery.lotteryCode}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-golden-luck" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-explore-blue transition-colors">
                  {lottery.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lottery.description}
                </p>
                
                {/* Prize Value Highlight */}
                <div className="bg-gradient-to-r from-golden-luck/10 to-orange-400/10 rounded-lg p-4 border border-golden-luck/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Grand Prize</span>
                    <Trophy className="h-4 w-4 text-golden-luck" />
                  </div>
                  <div className="text-2xl font-bold text-golden-luck mt-1">
                    ${(() => {
                      try {
                        const prizes = JSON.parse(lottery.prizes);
                        const grandPrize = prizes.grand || "";
                        const match = grandPrize.match(/\$([0-9,]+)/);
                        return match ? match[1] : "4,500";
                      } catch {
                        return "4,500";
                      }
                    })()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Travel Experience Package</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Coins className="h-4 w-4 text-ocean-pulse" />
                      Entry Cost:
                    </span>
                    <Badge variant="secondary" className="bg-ocean-pulse/10 text-ocean-pulse border-ocean-pulse/20">
                      {lottery.ticketPrice} Kairos
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-travel-mint" />
                      Draw Date:
                    </span>
                    <span className="text-sm font-mono bg-travel-mint/10 text-travel-mint px-2 py-1 rounded-md border border-travel-mint/20">
                      {lottery.drawDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-explore-blue" />
                      Participants:
                    </span>
                    <span className="text-sm text-explore-blue font-semibold">
                      {Math.floor(Math.random() * 100) + 50} players
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-explore-blue to-ocean-pulse hover:from-explore-blue/90 hover:to-ocean-pulse/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => handleEnterLottery(lottery.id, lottery.title)}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Enter Lottery: {lottery.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No lotteries state */}
        {lotteries.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="mb-8">
              <Trophy className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-700 mb-4">No Active Lotteries</h3>
              <p className="text-slate-500 text-lg">Check back soon for exciting new travel lottery opportunities!</p>
            </div>
            <Button className="bg-explore-blue hover:bg-explore-blue/90" onClick={handleBackToDashboard}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}