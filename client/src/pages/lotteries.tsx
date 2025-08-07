import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Lottery, type User } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Trophy, Clock, Users, Ticket, Coins, Calendar, MapPin, Copy, 
  Plane, Star, Target, Gift, ArrowRight, Timer, DollarSign
} from "lucide-react";
import MobileNavigation from "@/components/mobile-navigation";
import NavigationDropdown from "@/components/navigation-dropdown";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/lib/i18n";

const SAMPLE_USER_ID = "sample-user";

export default function Lotteries() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive"
      })
    })
  }

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  const { data: lotteries = [], isLoading } = useQuery<Lottery[]>({
    queryKey: ["/api/lotteries"],
  });

  const buyTicketMutation = useMutation({
    mutationFn: async ({ lotteryId, ticketPrice, quantity }: { lotteryId: string; ticketPrice: number; quantity: number }) => {
      const totalCost = ticketPrice * quantity;
      if (!user || (user.kairosTokens || 0) < totalCost) {
        throw new Error("Insufficient Kairos tokens");
      }
      
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        const response = await apiRequest("/api/lottery-tickets", {
          method: "POST",
          body: {
            lotteryId,
            userId: SAMPLE_USER_ID,
            ticketNumber: Math.floor(Math.random() * 1000000) + 1
          }
        });
        tickets.push(await response.json());
      }
      return { tickets, totalCost };
    },
    onSuccess: ({ tickets, totalCost }) => {
      toast({
        title: `${tickets.length} Ticket${tickets.length > 1 ? 's' : ''} Purchased! 🎫`,
        description: `Good luck! Your tickets: ${tickets.map(t => `#${t.ticketNumber}`).join(', ')}`,
      });
      
      // Update user Kairos tokens
      if (user) {
        queryClient.setQueryData(["/api/users", SAMPLE_USER_ID], {
          ...user,
          kairosTokens: (user.kairosTokens || 0) - totalCost
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/lotteries"] });
      setSelectedLottery(null);
      setTicketQuantity(1);
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message === "Insufficient Kairos tokens" 
          ? "You don't have enough Kairos tokens for this purchase" 
          : "Unable to purchase tickets. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyTickets = (lottery: Lottery) => {
    buyTicketMutation.mutate({ 
      lotteryId: lottery.id, 
      ticketPrice: lottery.ticketPrice,
      quantity: ticketQuantity
    });
  };

  const formatTimeRemaining = (drawDate: Date) => {
    const now = new Date();
    const diff = new Date(drawDate).getTime() - now.getTime();
    
    if (diff <= 0) return "Draw completed";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getLotteryTheme = (lotteryId: string) => {
    if (lotteryId.includes('bali')) return {
      bg: 'from-orange-50 to-red-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: '🏝️'
    };
    if (lotteryId.includes('patagonia')) return {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: '🏔️'
    };
    if (lotteryId.includes('morocco')) return {
      bg: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: '🏜️'
    };
    return {
      bg: 'from-purple-50 to-pink-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: '✈️'
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading travel lotteries...</p>
        </div>
      </div>
    );
  }

  const activeLotteries = lotteries.filter(l => new Date(l.drawDate) > new Date());
  const completedLotteries = lotteries.filter(l => new Date(l.drawDate) <= new Date());

  return (
    <div className="min-h-screen bg-silk-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="text-xl sm:text-2xl font-bold text-explore-blue" data-testid="logo">
                ✈️ VoyageLotto
              </div>
            </Link>
            
            <nav className="hidden lg:flex space-x-6">
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="nav-dashboard">Dashboard</Button>
              </Link>
              <Link href="/lotteries">
                <Button variant="ghost" className="text-blue-600 font-medium" data-testid="nav-lotteries">
                  Lotteries
                </Button>
              </Link>
              <Link href="/token-management">
                <Button variant="ghost" data-testid="nav-tokens">Token Management</Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="ghost" data-testid="nav-marketplace">Marketplace</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" data-testid="nav-profile">Profile</Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <NavigationDropdown currentPath="/lotteries" />
              <LanguageSelector />
              <ProfileDropdown />
              <MobileNavigation currentPath="/lotteries" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎫 Travel Lotteries
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Win incredible travel experiences around the world! Use your Kairos tokens to enter exclusive lotteries for luxury vacations and adventures.
          </p>
        </div>

        {/* User Token Balance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Viator Tokens</p>
                <p className="text-2xl font-bold text-yellow-600">{user?.viatorTokens || "0.00"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Kairos Tokens</p>
                <p className="text-2xl font-bold text-purple-600">{user?.kairosTokens || 0}</p>
                <p className="text-sm text-gray-500">Available for lottery entries</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Link href="/token-management">
                <Button className="w-full" data-testid="buy-tokens-button">
                  <Coins className="h-4 w-4 mr-2" />
                  Buy More Tokens
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Active Lotteries Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Lotteries</h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {activeLotteries.length} Active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeLotteries.map((lottery) => {
              const theme = getLotteryTheme(lottery.id);
              const timeRemaining = formatTimeRemaining(new Date(lottery.drawDate));
              const userCanAfford = (user?.kairosTokens || 0) >= lottery.ticketPrice;
              
              return (
                <Card key={lottery.id} className={`${theme.border} bg-gradient-to-br ${theme.bg} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{theme.icon}</span>
                        <div>
                          <CardTitle className={`text-xl ${theme.text}`}>
                            {lottery.title}
                          </CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {lottery.lotteryCode || lottery.id}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(lottery.lotteryCode || lottery.id, "Lottery ID")}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <CardDescription className="text-gray-700 mt-2">
                      {lottery.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Prize Value */}
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium">Prize Value</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        ${lottery.prizeValue.toLocaleString()}
                      </span>
                    </div>

                    {/* Entry Cost */}
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Entry Cost</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">
                        {lottery.ticketPrice} Kairos
                      </span>
                    </div>

                    {/* Draw Date */}
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Timer className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Time Remaining</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {timeRemaining}
                      </span>
                    </div>

                    {/* Entry Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full mt-4" 
                          disabled={!userCanAfford || buyTicketMutation.isPending}
                          onClick={() => setSelectedLottery(lottery)}
                          data-testid={`enter-lottery-${lottery.id}`}
                        >
                          {!userCanAfford ? (
                            <>
                              <Coins className="h-4 w-4 mr-2" />
                              Need More Kairos
                            </>
                          ) : (
                            <>
                              <Ticket className="h-4 w-4 mr-2" />
                              Enter Lottery
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      
                      {selectedLottery?.id === lottery.id && (
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <span>{theme.icon}</span>
                              <span>Enter {lottery.title}</span>
                            </DialogTitle>
                            <DialogDescription>
                              Choose how many tickets you want to purchase for this lottery.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label>Cost per ticket</Label>
                                <div className="font-semibold text-purple-600">
                                  {lottery.ticketPrice} Kairos
                                </div>
                              </div>
                              <div>
                                <Label>Your balance</Label>
                                <div className="font-semibold text-blue-600">
                                  {user?.kairosTokens || 0} Kairos
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="quantity">Number of tickets</Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={ticketQuantity}
                                onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min={1}
                                max={Math.floor((user?.kairosTokens || 0) / lottery.ticketPrice)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Total cost:</span>
                                <span className="text-xl font-bold text-purple-600">
                                  {ticketQuantity * lottery.ticketPrice} Kairos
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-600">Remaining balance:</span>
                                <span className="text-sm font-medium">
                                  {(user?.kairosTokens || 0) - (ticketQuantity * lottery.ticketPrice)} Kairos
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-3">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => setSelectedLottery(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="flex-1" 
                                onClick={() => handleBuyTickets(lottery)}
                                disabled={buyTicketMutation.isPending || (ticketQuantity * lottery.ticketPrice) > (user?.kairosTokens || 0)}
                              >
                                {buyTicketMutation.isPending ? "Processing..." : `Buy ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    {/* Lottery Details Link */}
                    <Link href={`/lottery/${lottery.id}`}>
                      <Button variant="outline" className="w-full" size="sm" data-testid={`lottery-details-${lottery.id}`}>
                        View Full Details
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Completed Lotteries Section */}
        {completedLotteries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Results</h2>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {completedLotteries.length} Completed
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {completedLotteries.slice(0, 6).map((lottery) => {
                const theme = getLotteryTheme(lottery.id);
                
                return (
                  <Card key={lottery.id} className={`${theme.border} bg-gradient-to-br ${theme.bg} opacity-75`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl grayscale">{theme.icon}</span>
                          <div>
                            <CardTitle className={`text-xl ${theme.text}`}>
                              {lottery.title}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              Completed
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Prize Value:</span>
                          <span className="font-semibold">${lottery.prizeValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Draw Date:</span>
                          <span>{new Date(lottery.drawDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Link href={`/lottery/${lottery.id}`}>
                        <Button variant="outline" className="w-full mt-4" size="sm">
                          View Results
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {lotteries.length === 0 && (
          <div className="text-center py-12">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lotteries Available</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for exciting travel lottery opportunities!
            </p>
            <Link href="/dashboard">
              <Button data-testid="back-to-dashboard">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}