import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { type User, type Lottery } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Trophy, Calendar, Clock, MapPin, Star, 
  Coins, Users, Target, Gift, Sparkles, CheckCircle, Zap
} from "lucide-react";

const SAMPLE_USER_ID = "sample-user";

export default function LotteryDetailCasino() {
  const [match, params] = useRoute("/lottery/:id");
  const lotteryId = params?.id;
  const { toast } = useToast();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Fetch lottery data
  const { data: lottery, isLoading: lotteryLoading } = useQuery<Lottery>({
    queryKey: ["/api/lotteries", lotteryId],
  });

  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  // Purchase ticket mutation
  const purchaseTicketMutation = useMutation({
    mutationFn: async () => {
      if (!lotteryId || !selectedNumbers.length) {
        throw new Error("Missing lottery ID or numbers");
      }
      
      return await apiRequest(`/api/lotteries/${lotteryId}/tickets`, {
        method: "POST",
        body: JSON.stringify({
          userId: SAMPLE_USER_ID,
          selectedNumbers,
          ticketQuantity
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "🎉 Ticket Purchased!",
        description: `You've entered the ${lottery?.title} lottery! Good luck!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", SAMPLE_USER_ID] });
      setSelectedNumbers([]);
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to purchase ticket",
        variant: "destructive",
      });
    },
  });

  const generateRandomNumbers = () => {
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1; // 49 numbers as requested
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const parsePrizes = (prizesString: string) => {
    try {
      const prizes = JSON.parse(prizesString);
      return prizes.grand || "Travel Experience";
    } catch {
      return "Travel Experience Package";
    }
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

  if (!match || lotteryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Premium Lottery</h2>
          <p className="text-purple-200">Preparing your golden opportunity...</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Lottery Not Found</h2>
          <Link href="/lotteries">
            <Button className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-400 hover:to-pink-400 text-black font-bold">
              Back to Casino
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canPurchase = user && user.kairosTokens >= lottery.ticketPrice * ticketQuantity && selectedNumbers.length === 6;
  const timeRemaining = Math.floor(Math.random() * 48) + 1;
  const prizeValue = getPrizeValue(lottery.prizes);
  const prizeDescription = parsePrizes(lottery.prizes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Casino Background Effects */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-pulse ${
              ['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400'][i % 3]
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lotteries">
            <Button 
              variant="outline" 
              className="mb-6 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Casino
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lottery Info & Number Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lottery Header */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-indigo-900/90 border-2 border-yellow-400/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-sm font-mono border-cyan-400/50 text-cyan-300 bg-cyan-400/10">
                    {lottery.lotteryCode}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                      🏆 VIP PREMIUM
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400">
                  {lottery.title}
                </CardTitle>
                <CardDescription className="text-lg text-purple-200 mt-4 leading-relaxed">
                  {lottery.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Casino-Style Number Selection Grid */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-indigo-900/90 border-2 border-yellow-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="h-7 w-7 text-yellow-400" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                    Select Your Lucky Numbers
                  </span>
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  Choose 6 numbers from 1 to 49 for your premium lottery ticket
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button 
                    onClick={generateRandomNumbers}
                    className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-bold py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Quick Pick Magic
                  </Button>
                  {selectedNumbers.length > 0 && (
                    <Button 
                      onClick={() => setSelectedNumbers([])}
                      variant="ghost"
                      className="text-purple-300 hover:text-white hover:bg-purple-700/50"
                    >
                      Clear Selection
                    </Button>
                  )}
                </div>

                {/* 49 Numbers Grid - Casino Style */}
                <div className="grid grid-cols-7 gap-3 p-6 bg-gradient-to-br from-slate-900/80 to-purple-900/80 rounded-xl border border-purple-500/30">
                  {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
                    <Button
                      key={num}
                      onClick={() => toggleNumber(num)}
                      disabled={selectedNumbers.length >= 6 && !selectedNumbers.includes(num)}
                      className={`w-12 h-12 rounded-full font-bold text-lg relative overflow-hidden transition-all duration-300 ${
                        selectedNumbers.includes(num)
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-400/50 scale-110"
                          : "bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-purple-400/30 hover:border-yellow-400/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-400/30"
                      } ${selectedNumbers.length >= 6 && !selectedNumbers.includes(num) ? "opacity-50" : ""}`}
                    >
                      {selectedNumbers.includes(num) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ping"></div>
                      )}
                      <span className="relative z-10">{num}</span>
                    </Button>
                  ))}
                </div>

                {/* Selected Numbers Display */}
                {selectedNumbers.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 rounded-xl p-6 border border-yellow-400/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-lg font-bold text-yellow-300">Your Lucky Numbers</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {selectedNumbers.map((num, index) => (
                        <div key={num} className="relative">
                          <Badge 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg px-4 py-2 rounded-full shadow-lg"
                          >
                            {num}
                          </Badge>
                          {index < selectedNumbers.length - 1 && (
                            <span className="ml-2 text-purple-300">•</span>
                          )}
                        </div>
                      ))}
                      {selectedNumbers.length < 6 && (
                        <span className="text-purple-300 font-medium">
                          ({6 - selectedNumbers.length} more needed)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Prize & Purchase Panel */}
          <div className="space-y-6">
            {/* Jackpot Display */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-indigo-900/90 border-2 border-yellow-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Gift className="h-6 w-6 text-yellow-400" />
                  <span className="text-yellow-300">Premium Jackpot</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 rounded-xl p-6 border border-yellow-400/30 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-cyan-400/10 animate-pulse"></div>
                  <div className="relative">
                    <h3 className="text-sm font-bold text-yellow-300 mb-3 flex items-center justify-center gap-2">
                      <Trophy className="h-4 w-4" />
                      GRAND PRIZE
                      <Trophy className="h-4 w-4" />
                    </h3>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-3">
                      ${prizeValue}
                    </div>
                    <p className="text-purple-200 text-sm font-medium">{prizeDescription}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Balance */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-indigo-900/90 border-2 border-cyan-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Coins className="h-6 w-6 text-cyan-400" />
                  <span className="text-cyan-300">Your Casino Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                    {user?.kairosTokens || 0}
                  </div>
                  <p className="text-purple-200 font-medium">Kairos Tokens</p>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Panel */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-indigo-900/90 border-2 border-pink-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-6 w-6 text-pink-400" />
                  <span className="text-pink-300">Enter Premium Draw</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-purple-500/30">
                    <span className="text-purple-200 font-medium">Entry Cost:</span>
                    <Badge className="bg-gradient-to-r from-cyan-400 to-blue-400 text-black font-bold">
                      {lottery.ticketPrice} Kairos
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-purple-500/30">
                    <span className="text-purple-200 font-medium">Numbers Selected:</span>
                    <span className="font-bold text-white">{selectedNumbers.length}/6</span>
                  </div>

                  <Progress 
                    value={(selectedNumbers.length / 6) * 100} 
                    className="h-3 bg-slate-700"
                  />
                </div>

                <Button
                  onClick={() => purchaseTicketMutation.mutate()}
                  disabled={!canPurchase || purchaseTicketMutation.isPending}
                  className="w-full bg-gradient-to-r from-yellow-500 via-pink-500 to-cyan-500 hover:from-yellow-400 hover:via-pink-400 hover:to-cyan-400 text-black font-bold py-4 text-lg shadow-lg hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  {purchaseTicketMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : !user ? (
                    "Login Required"
                  ) : selectedNumbers.length !== 6 ? (
                    "Select 6 Lucky Numbers"
                  ) : user.kairosTokens < lottery.ticketPrice ? (
                    "Insufficient Kairos"
                  ) : (
                    <div className="flex items-center gap-2 relative">
                      <CheckCircle className="h-5 w-5" />
                      <span>ENTER PREMIUM DRAW</span>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>
                  )}
                </Button>

                {selectedNumbers.length === 6 && user && user.kairosTokens >= lottery.ticketPrice && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-300 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-bold">Ready for Premium Draw!</span>
                    </div>
                    <p className="text-green-200 text-sm">Good luck with your lucky numbers!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-indigo-900/90 border-2 border-purple-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-purple-300">Need More Tokens?</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/token-shop">
                  <Button variant="outline" className="w-full border-purple-400 text-purple-300 hover:bg-purple-500/20">
                    <Coins className="mr-2 h-4 w-4" />
                    Buy Kairos Tokens
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}