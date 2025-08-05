import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Lottery, type User } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Users, Ticket, Coins, Calendar, MapPin, Copy } from "lucide-react";
import TravelImageRenderer from "@/components/travel-image-renderer";
import FavoriteHeart from "@/components/favorite-heart";
import MobileNavigation from "@/components/mobile-navigation";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/lib/i18n";

// Using sample user for demo
const SAMPLE_USER_ID = "sample-user";

export default function Lotteries() {
  const { toast } = useToast();
  const { t } = useLanguage();

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

  const { data: lotteries, isLoading } = useQuery<Lottery[]>({
    queryKey: ["/api/lotteries"],
  });

  const buyTicketMutation = useMutation({
    mutationFn: async ({ lotteryId, ticketPrice }: { lotteryId: string; ticketPrice: number }) => {
      // First check if user has enough tokens
      if (!user || user.tokens < ticketPrice) {
        throw new Error("Insufficient tokens");
      }
      
      const response = await apiRequest("/api/lottery-tickets", {
        method: "POST",
        body: {
          lotteryId,
          userId: SAMPLE_USER_ID,
          ticketNumber: Math.floor(Math.random() * 1000000) + 1
        }
      });
      return response.json();
    },
    onSuccess: (data, { ticketPrice }) => {
      toast({
        title: "Ticket Purchased! 🎫",
        description: `Good luck! Your ticket number is #${data.ticketNumber}`,
      });
      
      // Update user tokens
      if (user) {
        queryClient.setQueryData(["/api/users", SAMPLE_USER_ID], {
          ...user,
          tokens: user.tokens - ticketPrice
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/lotteries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message === "Insufficient tokens" 
          ? "You don't have enough tokens for this ticket" 
          : "Unable to purchase ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyTicket = (lottery: Lottery) => {
    buyTicketMutation.mutate({ 
      lotteryId: lottery.id, 
      ticketPrice: lottery.ticketPrice 
    });
  };

  const formatTimeRemaining = (drawDate: Date) => {
    const now = new Date();
    const diff = new Date(drawDate).getTime() - now.getTime();
    
    if (diff <= 0) return "Draw completed";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-explore-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lotteries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header - Mobile Responsive */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="text-xl sm:text-2xl font-bold gradient-travel bg-clip-text text-transparent" data-testid="logo">
                🌟 TravelLotto
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="nav-dashboard">Dashboard</Button>
              </Link>
              <Link href="/lotteries">
                <Button variant="ghost" className="bg-blue-50 text-explore-blue" data-testid="nav-lotteries">Lotteries</Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="ghost" data-testid="nav-marketplace">Marketplace</Button>
              </Link>
            </nav>
            {/* Mobile Navigation */}
            <MobileNavigation currentPath="/lotteries" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Mobile Responsive */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="lotteries-title">
            🎲 Active Travel Lotteries
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-6 px-4" data-testid="lotteries-subtitle">
            Enter exciting lotteries for a chance to win amazing travel packages and experiences
          </p>
          
          {/* User Token Display */}
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md">
            <Coins className="h-5 w-5 text-golden-luck mr-2" />
            <span className="font-semibold text-slate-900" data-testid="user-tokens">
              {user?.tokens || 0} Tokens Available
            </span>
          </div>
        </div>

        {/* Lotteries Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {lotteries?.map((lottery) => {
            const ticketsSoldPercentage = (lottery.soldTickets / lottery.maxTickets) * 100;
            const timeRemaining = formatTimeRemaining(lottery.drawDate);
            const canAfford = user ? user.tokens >= lottery.ticketPrice : false;
            
            return (
              <Card 
                key={lottery.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-testid={`lottery-${lottery.id}`}
              >
                <div className="relative">
                  {/* Prize Image/Icon */}
                  <div className="h-48 bg-gradient-casino flex items-center justify-center overflow-hidden">
                    <TravelImageRenderer type="lottery" theme={lottery.image} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Theme Badge */}
                  <Badge className="absolute top-4 left-4 bg-white text-slate-900" data-testid={`lottery-theme-${lottery.id}`}>
                    {lottery.theme}
                  </Badge>
                  
                  {/* Time Remaining Badge */}
                  <Badge 
                    variant={timeRemaining.includes('remaining') ? 'default' : 'secondary'}
                    className="absolute top-4 right-4"
                    data-testid={`lottery-time-${lottery.id}`}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {timeRemaining}
                  </Badge>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl" data-testid={`lottery-title-${lottery.id}`}>
                      {lottery.title}
                    </CardTitle>
                    <FavoriteHeart
                      itemType="lottery"
                      itemId={lottery.id}
                      itemTitle={lottery.title}
                      itemDescription={lottery.description}
                      itemMetadata={{ 
                        drawDate: lottery.drawDate,
                        prizeTitle: lottery.prizeTitle,
                        prizeValue: lottery.prizeValue,
                        ticketPrice: lottery.ticketPrice 
                      }}
                      size="lg"
                    />
                  </div>
                  
                  {/* Lottery Code Display */}
                  {lottery.lotteryCode && (
                    <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Lottery ID:</span>
                      <code className="font-mono font-bold text-blue-800 dark:text-blue-200 flex-1" data-testid={`lottery-code-${lottery.id}`}>
                        {lottery.lotteryCode}
                      </code>
                      <Button
                        data-testid={`button-copy-code-${lottery.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          copyToClipboard(lottery.lotteryCode!, "Lottery ID");
                        }}
                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <CardDescription className="text-base" data-testid={`lottery-description-${lottery.id}`}>
                    {lottery.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Prize Details */}
                  <div className="bg-gradient-to-r from-golden-luck/10 to-travel-mint/10 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2" data-testid={`prize-title-${lottery.id}`}>
                      🏆 {lottery.prizeTitle}
                    </h4>
                    <p className="text-slate-600 text-sm mb-3" data-testid={`prize-description-${lottery.id}`}>
                      {lottery.prizeDescription}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-golden-luck" data-testid={`prize-value-${lottery.id}`}>
                        ${(lottery.prizeValue / 100).toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500">
                        Prize Value
                      </span>
                    </div>
                  </div>

                  {/* Lottery Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-1">
                        <Ticket className="h-4 w-4" />
                        Tickets Sold
                      </span>
                      <span className="font-semibold" data-testid={`tickets-sold-${lottery.id}`}>
                        {lottery.soldTickets} / {lottery.maxTickets}
                      </span>
                    </div>
                    
                    <Progress value={ticketsSoldPercentage} className="h-2" />
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Draw Date
                      </span>
                      <span className="font-semibold" data-testid={`draw-date-${lottery.id}`}>
                        {new Date(lottery.drawDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Purchase Section */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Ticket Price</span>
                      <span className="flex items-center gap-1 text-xl font-bold text-explore-blue" data-testid={`ticket-price-${lottery.id}`}>
                        <Coins className="h-5 w-5" />
                        {lottery.ticketPrice}
                      </span>
                    </div>
                    
                    <Link href={`/lottery/${lottery.id}`} className="block w-full">
                      <Button
                        disabled={lottery.soldTickets >= lottery.maxTickets}
                        className="w-full shadow-lg btn-lottery"
                        data-testid={`select-numbers-${lottery.id}`}
                      >
                        {lottery.soldTickets >= lottery.maxTickets ? (
                          "Sold Out"
                        ) : (
                          <>
                            <Ticket className="mr-2 h-4 w-4" />
                            Select Numbers & Play
                          </>
                        )}
                      </Button>
                    </Link>
                    
                    {!canAfford && (
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        Complete more missions to earn tokens
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Lotteries Message */}
        {!lotteries || lotteries.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Lotteries</h3>
            <p className="text-slate-600 mb-6">Check back soon for new exciting travel lottery opportunities!</p>
            <Link href="/dashboard">
              <Button className="bg-explore-blue hover:bg-ocean-pulse">
                Complete Missions to Earn Tokens
              </Button>
            </Link>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center" data-testid="how-lotteries-work-title">
            How Travel Lotteries Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-explore-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Purchase Tickets</h3>
              <p className="text-slate-600 text-sm">Use your earned tokens to buy lottery tickets for amazing travel prizes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-ocean-pulse rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Wait for Draw</h3>
              <p className="text-slate-600 text-sm">Each lottery has a scheduled draw date when winners are randomly selected</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-golden-luck rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Win & Travel</h3>
              <p className="text-slate-600 text-sm">Winners receive authentic travel packages and experiences from our partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}