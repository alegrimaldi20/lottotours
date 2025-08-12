import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { type User, type Lottery } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Trophy, Sparkles, Star, Target, Crown,
  Coins, Timer, Users, Gift, CheckCircle, Zap
} from "lucide-react";

const SAMPLE_USER_ID = "sample-user";

export default function LotteryHouseStyle() {
  const [match, params] = useRoute("/lottery/:id");
  const lotteryId = params?.id;
  const { toast } = useToast();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

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
      if (!lotteryId || selectedNumbers.length !== 6) {
        throw new Error("Please select exactly 6 numbers");
      }
      
      const response = await fetch(`/api/lotteries/${lotteryId}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: SAMPLE_USER_ID,
          selectedNumbers: selectedNumbers,
          ticketQuantity: 1
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to purchase ticket");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setShowSparkles(true);
      toast({
        title: "🎉 ¡Ticket Purchased!",
        description: `You're now entered in the ${lottery?.title} lottery!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", SAMPLE_USER_ID] });
      setSelectedNumbers([]);
      setTimeout(() => setShowSparkles(false), 3000);
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to purchase ticket",
        variant: "destructive",
      });
    },
  });

  const generateQuickPick = () => {
    setIsAnimating(true);
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    // Animate number selection
    setTimeout(() => {
      setSelectedNumbers(numbers.sort((a, b) => a - b));
      setIsAnimating(false);
    }, 800);
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
      return prizes.grand || "Premium Travel Experience";
    } catch {
      return "Premium Travel Experience";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden-luck border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Lottery House</h2>
          <p className="text-gray-300">Preparing your premium lottery experience...</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Lottery Not Found</h2>
          <Link href="/lotteries">
            <Button className="bg-golden-luck hover:bg-golden-luck/90 text-black font-bold">
              Return to Lottery House
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canPurchase = user && user.kairosTokens >= lottery.ticketPrice && selectedNumbers.length === 6;
  const prizeValue = getPrizeValue(lottery.prizes);
  const prizeDescription = parsePrizes(lottery.prizes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-golden-luck rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Sparkles Effect */}
      {showSparkles && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute w-6 h-6 text-golden-luck animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lotteries">
            <Button variant="outline" className="mb-6 border-golden-luck text-golden-luck hover:bg-golden-luck hover:text-black">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lottery House
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Lottery Board */}
          <div className="xl:col-span-2">
            {/* Lottery Header */}
            <Card className="bg-gradient-to-r from-gray-800/90 to-purple-800/90 border-golden-luck/30 backdrop-blur-sm mb-8">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Badge className="bg-golden-luck text-black font-bold text-lg px-4 py-2">
                    {lottery.lotteryCode}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-golden-luck" />
                    <span className="text-golden-luck font-bold">PREMIUM DRAW</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-golden-luck to-yellow-300 bg-clip-text text-transparent">
                  {lottery.title}
                </h1>
                
                <p className="text-xl text-gray-300 mb-6">{lottery.description}</p>
                
                {/* Prize Display */}
                <div className="bg-gradient-to-r from-golden-luck/20 to-yellow-400/20 rounded-xl p-6 border border-golden-luck/40">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-8 w-8 text-golden-luck" />
                      <span className="text-golden-luck font-bold text-lg">GRAND PRIZE</span>
                    </div>
                    <div className="text-5xl md:text-6xl font-black text-golden-luck mb-2">
                      ${prizeValue}
                    </div>
                    <p className="text-white text-lg">{prizeDescription}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Number Selection Board - 49 Numbers */}
            <Card className="bg-gradient-to-br from-gray-800/95 to-purple-800/95 border-golden-luck/40 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Select Your Lucky Numbers</h2>
                      <p className="text-gray-300">Choose 6 numbers from 1 to 49</p>
                    </div>
                    
                    <Button 
                      onClick={generateQuickPick}
                      disabled={isAnimating}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl"
                    >
                      {isAnimating ? (
                        <>
                          <Zap className="mr-2 h-5 w-5 animate-spin" />
                          Picking...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Quick Pick
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Numbers Selected</span>
                      <span className="text-sm font-bold text-golden-luck">{selectedNumbers.length}/6</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-golden-luck to-yellow-400 h-3 rounded-full transition-all duration-500 shadow-lg" 
                        style={{ width: `${(selectedNumbers.length / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Number Grid - 49 Numbers (7x7 layout) */}
                <div className="grid grid-cols-7 gap-3 mb-8">
                  {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => {
                    const isSelected = selectedNumbers.includes(num);
                    const isAnimatingNumber = isAnimating && Math.random() > 0.7;
                    
                    return (
                      <Button
                        key={num}
                        onClick={() => !isAnimating && toggleNumber(num)}
                        disabled={isAnimating || (!isSelected && selectedNumbers.length >= 6)}
                        className={`
                          relative w-full aspect-square text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg
                          ${isSelected 
                            ? 'bg-gradient-to-br from-golden-luck to-yellow-400 text-black shadow-golden-luck/50 shadow-2xl' 
                            : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500 border border-gray-500'
                          }
                          ${isAnimatingNumber ? 'animate-pulse bg-gradient-to-br from-purple-500 to-pink-500' : ''}
                          ${!isSelected && selectedNumbers.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {isSelected && (
                          <Star className="absolute top-1 right-1 w-4 h-4 text-black" />
                        )}
                        {num}
                      </Button>
                    );
                  })}
                </div>

                {/* Selected Numbers Display */}
                {selectedNumbers.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-900/50 to-gray-800/50 rounded-xl p-6 border border-purple-500/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-golden-luck" />
                      Your Selected Numbers
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedNumbers.map((num, index) => (
                        <div
                          key={num}
                          className="w-12 h-12 bg-gradient-to-br from-golden-luck to-yellow-400 text-black font-bold text-lg rounded-lg flex items-center justify-center shadow-lg animate-bounce"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Purchase Panel */}
          <div className="space-y-6">
            {/* User Balance */}
            <Card className="bg-gradient-to-br from-gray-800/90 to-purple-800/90 border-golden-luck/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Coins className="h-6 w-6 text-golden-luck" />
                    <span className="text-white font-bold text-lg">Your Balance</span>
                  </div>
                  <div className="text-4xl font-black text-golden-luck mb-2">
                    {user?.kairosTokens || 0}
                  </div>
                  <p className="text-gray-300">Kairos Tokens</p>
                </div>
              </CardContent>
            </Card>

            {/* Lottery Stats */}
            <Card className="bg-gradient-to-br from-gray-800/90 to-purple-800/90 border-golden-luck/30 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-golden-luck" />
                  Draw Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Draw Date:
                    </span>
                    <span className="text-white font-semibold">
                      {new Date(lottery.drawDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Participants:
                    </span>
                    <span className="text-golden-luck font-bold">
                      {lottery.soldTickets || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Entry Cost:
                    </span>
                    <Badge className="bg-purple-600 text-white">
                      {lottery.ticketPrice} Kairos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Button */}
            <Card className="bg-gradient-to-br from-gray-800/90 to-purple-800/90 border-golden-luck/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <Button
                  onClick={() => purchaseTicketMutation.mutate()}
                  disabled={!canPurchase || purchaseTicketMutation.isPending}
                  className={`
                    w-full py-6 text-xl font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105
                    ${canPurchase 
                      ? 'bg-gradient-to-r from-golden-luck to-yellow-400 hover:from-yellow-400 hover:to-golden-luck text-black shadow-golden-luck/50'
                      : 'bg-gradient-to-r from-gray-600 to-gray-500 text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {purchaseTicketMutation.isPending ? (
                    <>
                      <Zap className="mr-2 h-6 w-6 animate-spin" />
                      Processing...
                    </>
                  ) : !user ? (
                    "Login Required"
                  ) : selectedNumbers.length !== 6 ? (
                    `Select ${6 - selectedNumbers.length} More Numbers`
                  ) : user.kairosTokens < lottery.ticketPrice ? (
                    "Insufficient Kairos"
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-6 w-6" />
                      ENTER LOTTERY
                    </>
                  )}
                </Button>

                {selectedNumbers.length === 6 && user && user.kairosTokens >= lottery.ticketPrice && (
                  <div className="mt-4 bg-gradient-to-r from-green-900/50 to-emerald-800/50 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-bold">Ready to Enter!</span>
                    </div>
                    <p className="text-green-300 text-sm mt-1">All numbers selected. Good luck!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Link */}
            <Link href="/token-shop">
              <Button variant="outline" className="w-full border-golden-luck text-golden-luck hover:bg-golden-luck hover:text-black">
                <Coins className="mr-2 h-4 w-4" />
                Buy More Tokens
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}