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
  Coins, Users, Target, Gift, Sparkles, CheckCircle
} from "lucide-react";

const SAMPLE_USER_ID = "sample-user";

export default function LotteryDetailFixed() {
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
        title: "Ticket Purchased!",
        description: `Successfully entered the ${lottery?.title} lottery`,
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
      const num = Math.floor(Math.random() * 50) + 1;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-explore-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lottery details...</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Lottery Not Found</h2>
          <Link href="/lotteries">
            <Button>Back to Lotteries</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canPurchase = user && user.kairosTokens >= lottery.ticketPrice * ticketQuantity && selectedNumbers.length === 6;
  const timeRemaining = Math.floor(Math.random() * 48) + 1; // Mock time remaining
  const prizeValue = getPrizeValue(lottery.prizes);
  const prizeDescription = parsePrizes(lottery.prizes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lotteries">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lotteries
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lottery Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lottery Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-sm font-mono">
                    {lottery.lotteryCode}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-golden-luck" />
                    <Badge className="bg-gradient-to-r from-golden-luck to-orange-400 text-white">
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900">
                  {lottery.title}
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 mt-2">
                  {lottery.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Prize Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-golden-luck" />
                  Prize Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-golden-luck/10 to-orange-400/10 rounded-lg p-6 border border-golden-luck/20 text-center">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">GRAND PRIZE</h3>
                  <div className="text-4xl font-bold text-golden-luck mb-2">
                    ${prizeValue}
                  </div>
                  <p className="text-slate-600">{prizeDescription}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-explore-blue mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Draw Date</p>
                    <p className="text-sm text-slate-600">{new Date(lottery.drawDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-travel-mint mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Time Left</p>
                    <p className="text-sm text-slate-600">{timeRemaining}h remaining</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 text-ocean-pulse mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Participants</p>
                    <p className="text-sm text-slate-600">{lottery.soldTickets || 0}</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-8 w-8 text-golden-luck mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Max Tickets</p>
                    <p className="text-sm text-slate-600">{lottery.maxTickets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Number Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-explore-blue" />
                  Select Your Numbers
                </CardTitle>
                <CardDescription>
                  Choose 6 numbers between 1 and 50 for your lottery ticket
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <Button 
                    onClick={generateRandomNumbers}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Quick Pick
                  </Button>
                  {selectedNumbers.length > 0 && (
                    <Button 
                      onClick={() => setSelectedNumbers([])}
                      variant="ghost"
                      size="sm"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-10 gap-2 mb-6">
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <Button
                      key={num}
                      onClick={() => toggleNumber(num)}
                      variant={selectedNumbers.includes(num) ? "default" : "outline"}
                      className={`w-full h-10 p-0 ${
                        selectedNumbers.includes(num)
                          ? "bg-explore-blue text-white"
                          : "hover:bg-explore-blue/10"
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>

                {selectedNumbers.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Your Selected Numbers:</p>
                    <div className="flex items-center gap-2">
                      {selectedNumbers.map((num) => (
                        <Badge key={num} variant="secondary" className="bg-explore-blue text-white">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Panel */}
          <div className="space-y-6">
            {/* User Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-ocean-pulse" />
                  Your Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-ocean-pulse">
                    {user?.kairosTokens || 0}
                  </div>
                  <p className="text-sm text-slate-600">Kairos Tokens</p>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-explore-blue" />
                  Purchase Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Entry Cost:</span>
                  <Badge variant="secondary" className="bg-ocean-pulse/10 text-ocean-pulse">
                    {lottery.ticketPrice} Kairos
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Numbers Selected:</span>
                  <span className="text-sm text-slate-600">{selectedNumbers.length}/6</span>
                </div>

                <Progress value={(selectedNumbers.length / 6) * 100} className="h-2" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Cost:</span>
                    <span className="font-bold text-ocean-pulse">
                      {lottery.ticketPrice * ticketQuantity} Kairos
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => purchaseTicketMutation.mutate()}
                  disabled={!canPurchase || purchaseTicketMutation.isPending}
                  className="w-full bg-gradient-to-r from-explore-blue to-ocean-pulse hover:from-explore-blue/90 hover:to-ocean-pulse/90 text-white font-semibold py-3"
                >
                  {purchaseTicketMutation.isPending ? (
                    "Processing..."
                  ) : !user ? (
                    "Login Required"
                  ) : selectedNumbers.length !== 6 ? (
                    "Select 6 Numbers"
                  ) : user.kairosTokens < lottery.ticketPrice ? (
                    "Insufficient Kairos"
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Enter Lottery
                    </>
                  )}
                </Button>

                {selectedNumbers.length === 6 && user && user.kairosTokens >= lottery.ticketPrice && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Ready to enter!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need More Tokens?</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/token-shop">
                  <Button variant="outline" className="w-full">
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