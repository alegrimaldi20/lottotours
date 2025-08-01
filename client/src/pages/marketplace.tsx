import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Prize, type User } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Gift, MapPin, Package, Percent, Clock, Check } from "lucide-react";

// Using sample user for demo
const SAMPLE_USER_ID = "sample-user";

export default function Marketplace() {
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  const { data: prizes, isLoading } = useQuery<Prize[]>({
    queryKey: ["/api/prizes"],
  });

  const redeemPrizeMutation = useMutation({
    mutationFn: async ({ prizeId, tokensRequired }: { prizeId: string; tokensRequired: number }) => {
      // First check if user has enough tokens
      if (!user || user.tokens < tokensRequired) {
        throw new Error("Insufficient tokens");
      }
      
      const response = await apiRequest("POST", "/api/prize-redemptions", {
        userId: SAMPLE_USER_ID,
        prizeId,
        status: "pending"
      });
      return response.json();
    },
    onSuccess: (data, { tokensRequired }) => {
      toast({
        title: "Prize Redeemed! 🎉",
        description: `Your redemption code is ${data.redemptionCode}. Check your email for details.`,
        duration: 5000,
      });
      
      // Update user tokens
      if (user) {
        queryClient.setQueryData(["/api/users", SAMPLE_USER_ID], {
          ...user,
          tokens: user.tokens - tokensRequired
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/prizes"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Redemption Failed",
        description: error.message === "Insufficient tokens" 
          ? "You don't have enough tokens for this prize" 
          : "Unable to redeem prize. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRedeemPrize = (prize: Prize) => {
    redeemPrizeMutation.mutate({ 
      prizeId: prize.id, 
      tokensRequired: prize.tokensRequired 
    });
  };

  const categoryIcon = (category: string) => {
    switch (category) {
      case 'travel_package': return <MapPin className="h-5 w-5" />;
      case 'product': return <Package className="h-5 w-5" />;
      case 'discount': return <Percent className="h-5 w-5" />;
      case 'experience': return <Gift className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  const categoryName = (category: string) => {
    switch (category) {
      case 'travel_package': return 'Travel Packages';
      case 'product': return 'Products';
      case 'discount': return 'Discounts';
      case 'experience': return 'Experiences';
      default: return 'All Prizes';
    }
  };

  const filterPrizesByCategory = (category: string) => {
    if (category === 'all') return prizes || [];
    return prizes?.filter(prize => prize.category === category) || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-explore-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  const categories = ['all', 'travel_package', 'experience', 'product', 'discount'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="text-2xl font-bold gradient-travel bg-clip-text text-transparent" data-testid="logo">
                🌟 TravelLotto
              </div>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="nav-dashboard">Dashboard</Button>
              </Link>
              <Link href="/lotteries">
                <Button variant="ghost" data-testid="nav-lotteries">Lotteries</Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="ghost" className="bg-blue-50 text-explore-blue" data-testid="nav-marketplace">Marketplace</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4" data-testid="marketplace-title">
            🏪 Prize Marketplace
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-6" data-testid="marketplace-subtitle">
            Redeem your hard-earned tokens for amazing travel packages, experiences, and exclusive rewards
          </p>
          
          {/* User Token Display */}
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md">
            <Coins className="h-5 w-5 text-golden-luck mr-2" />
            <span className="font-semibold text-slate-900" data-testid="user-tokens">
              {user?.tokens || 0} Tokens Available
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-2" data-testid={`tab-${category}`}>
                {category !== 'all' && categoryIcon(category)}
                {categoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterPrizesByCategory(category).map((prize) => {
                  const canAfford = user ? user.tokens >= prize.tokensRequired : false;
                  const isAvailable = prize.availability > 0;
                  
                  return (
                    <Card 
                      key={prize.id} 
                      className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      data-testid={`prize-${prize.id}`}
                    >
                      <div className="relative">
                        {/* Prize Image/Icon */}
                        <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <span className="text-5xl">{prize.image}</span>
                        </div>
                        
                        {/* Category Badge */}
                        <Badge className="absolute top-3 left-3" data-testid={`prize-category-${prize.id}`}>
                          {categoryIcon(prize.category)}
                          <span className="ml-1">{categoryName(prize.category)}</span>
                        </Badge>
                        
                        {/* Availability Badge */}
                        <Badge 
                          variant={isAvailable ? 'secondary' : 'destructive'}
                          className="absolute top-3 right-3"
                          data-testid={`prize-availability-${prize.id}`}
                        >
                          {isAvailable ? `${prize.availability} left` : 'Sold Out'}
                        </Badge>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg mb-2" data-testid={`prize-title-${prize.id}`}>
                          {prize.title}
                        </CardTitle>
                        <CardDescription className="text-sm" data-testid={`prize-description-${prize.id}`}>
                          {prize.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Prize Details */}
                        <div className="space-y-2">
                          {prize.destination && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="h-4 w-4" />
                              <span data-testid={`prize-destination-${prize.id}`}>{prize.destination}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Package className="h-4 w-4" />
                            <span data-testid={`prize-provider-${prize.id}`}>by {prize.provider}</span>
                          </div>
                          
                          {prize.validUntil && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="h-4 w-4" />
                              <span data-testid={`prize-valid-until-${prize.id}`}>
                                Valid until {new Date(prize.validUntil).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Value and Cost */}
                        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Actual Value</span>
                            <span className="font-semibold text-slate-900" data-testid={`prize-value-${prize.id}`}>
                              ${(prize.value / 100).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Token Cost</span>
                            <span className="flex items-center gap-1 text-lg font-bold text-explore-blue" data-testid={`prize-tokens-${prize.id}`}>
                              <Coins className="h-4 w-4" />
                              {prize.tokensRequired}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                            You save ${((prize.value - prize.tokensRequired * 2) / 100).toLocaleString()}!
                          </div>
                        </div>

                        {/* Terms */}
                        {prize.terms && (
                          <div className="text-xs text-slate-500 bg-slate-50 rounded p-2" data-testid={`prize-terms-${prize.id}`}>
                            <strong>Terms:</strong> {prize.terms}
                          </div>
                        )}

                        {/* Redeem Button */}
                        <Button
                          onClick={() => handleRedeemPrize(prize)}
                          disabled={!canAfford || !isAvailable || redeemPrizeMutation.isPending}
                          className={`w-full ${canAfford && isAvailable
                            ? 'bg-gradient-to-r from-explore-blue to-ocean-pulse hover:from-ocean-pulse hover:to-explore-blue' 
                            : 'bg-slate-300'
                          } text-white`}
                          data-testid={`redeem-prize-${prize.id}`}
                        >
                          {redeemPrizeMutation.isPending ? (
                            "Redeeming..."
                          ) : !isAvailable ? (
                            "Sold Out"
                          ) : !canAfford ? (
                            "Insufficient Tokens"
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Redeem Prize
                            </>
                          )}
                        </Button>
                        
                        {!canAfford && isAvailable && (
                          <p className="text-xs text-slate-500 text-center">
                            Need {prize.tokensRequired - (user?.tokens || 0)} more tokens
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Empty State */}
              {filterPrizesByCategory(category).length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🎁</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No {categoryName(category)} Available
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Check back soon for new {categoryName(category).toLowerCase()} in our marketplace!
                  </p>
                  <Link href="/dashboard">
                    <Button className="bg-explore-blue hover:bg-ocean-pulse">
                      Complete Missions to Earn Tokens
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center" data-testid="how-redemption-works-title">
            How Prize Redemption Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-explore-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Earn Tokens</h3>
              <p className="text-slate-600 text-sm">Complete missions and participate in activities to earn tokens</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-ocean-pulse rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Choose Prize</h3>
              <p className="text-slate-600 text-sm">Browse our marketplace and select the perfect reward for your adventure</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-golden-luck rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Redeem & Enjoy</h3>
              <p className="text-slate-600 text-sm">Get your redemption code and instructions to claim your authentic prize</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}