import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Coins, ArrowRightLeft, Trophy, Star, Zap, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/i18n";
import MobileNavigation from "@/components/mobile-navigation";
import NavigationDropdown from "@/components/navigation-dropdown";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelector from "@/components/language-selector";

interface ViatorTokenPack {
  id: string;
  name: string;
  description: string;
  kairosAmount: number;
  viatorPrice: string;
  usdPrice: string;
  packType: string;
  popularBadge: boolean;
}

interface User {
  id: string;
  username: string;
  viatorTokens: string;
  kairosTokens: number;
  raivanTokens: number;
}

interface RaivanConversion {
  id: string;
  raivanAmount: number;
  kairosAmount: number;
  conversionRate: string;
  createdAt: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  raivanReward: number;
  icon: string;
  rarity: string;
}

export default function ViatorTokenManagement() {
  const [conversionAmount, setConversionAmount] = useState<number>(18);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users/sample-user"],
  });

  // Fetch Viator token packs  
  const { data: tokenPacks = [], isLoading: packsLoading } = useQuery<ViatorTokenPack[]>({
    queryKey: ["/api/viator-token-packs"],
  });

  // Fetch user's conversion history
  const { data: conversions = [], isLoading: conversionsLoading } = useQuery<RaivanConversion[]>({
    queryKey: ["/api/users/sample-user/raivan-conversions"],
  });

  // Fetch available achievements
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  // Conversion rate: 18 Raivan = 1 Kairos
  const conversionRate = 18;
  const maxConvertibleRaivan = Math.floor((user?.raivanTokens || 0) / conversionRate) * conversionRate;
  const maxKairosFromConversion = Math.floor(maxConvertibleRaivan / conversionRate);

  // Convert Raivan to Kairos mutation
  const convertRaivanMutation = useMutation({
    mutationFn: async (raivanAmount: number) => {
      return await apiRequest("/api/raivan-conversions", {
        method: "POST",
        body: JSON.stringify({
          userId: "sample-user",
          raivanAmount,
          kairosAmount: Math.floor(raivanAmount / conversionRate),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/sample-user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/sample-user/raivan-conversions"] });
      toast({
        title: "Conversion Successful!",
        description: `Converted ${conversionAmount} Raivan to ${Math.floor(conversionAmount / conversionRate)} Kairos tokens`,
      });
      setConversionAmount(18);
    },
    onError: () => {
      toast({
        title: "Conversion Failed",
        description: "Unable to convert tokens. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Purchase token pack mutation
  const purchasePackMutation = useMutation({
    mutationFn: async ({ packId, paymentMethod }: { packId: string; paymentMethod: 'viator' | 'usd' }) => {
      return await apiRequest("/api/viator-token-packs/purchase", {
        method: "POST",
        body: JSON.stringify({
          userId: "sample-user",
          packId,
          paymentMethod,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/sample-user"] });
      toast({
        title: "Purchase Successful!",
        description: "Kairos tokens have been added to your account",
      });
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description: "Unable to purchase token pack. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConversion = () => {
    if (conversionAmount < conversionRate) {
      toast({
        title: "Invalid Amount",
        description: `Minimum conversion is ${conversionRate} Raivan tokens`,
        variant: "destructive",
      });
      return;
    }
    
    if (conversionAmount > (user?.raivanTokens || 0)) {
      toast({
        title: "Insufficient Raivan",
        description: "You don't have enough Raivan tokens for this conversion",
        variant: "destructive",
      });
      return;
    }

    convertRaivanMutation.mutate(conversionAmount);
  };

  const handlePurchase = (packId: string, paymentMethod: 'viator' | 'usd') => {
    purchasePackMutation.mutate({ packId, paymentMethod });
  };

  if (userLoading || packsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

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
                <Button variant="ghost" data-testid="nav-lotteries">Lotteries</Button>
              </Link>
              <Link href="/token-management">
                <Button variant="ghost" className="text-blue-600 font-medium" data-testid="nav-tokens">
                  Token Management
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="ghost" data-testid="nav-marketplace">Marketplace</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" data-testid="nav-profile">Profile</Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <NavigationDropdown currentPath="/token-management" />
              <LanguageSelector />
              <ProfileDropdown />
              <MobileNavigation currentPath="/token-management" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" data-testid="viator-token-management">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            💰 Token Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your three-token economy: Viator ($1 USD), Kairos (raffle tickets), and Raivan (reward tokens)
          </p>
        </div>

        {/* Token Balances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Coins className="h-5 w-5" />
                Viator Tokens
              </CardTitle>
              <CardDescription>Strong Currency ($1 USD each)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600" data-testid="viator-balance">
                {user?.viatorTokens || "0.00"}
              </div>
              <p className="text-sm text-yellow-600 mt-1">
                ≈ ${user?.viatorTokens || "0.00"} USD
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Target className="h-5 w-5" />
                Kairos Tokens
              </CardTitle>
              <CardDescription>Lottery Tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600" data-testid="kairos-balance">
                {user?.kairosTokens || 0}
              </div>
              <p className="text-sm text-purple-600 mt-1">
                Ready for lotteries
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Zap className="h-5 w-5" />
                Raivan Tokens
              </CardTitle>
              <CardDescription>Reward Points (18 = 1 Kairos)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600" data-testid="raivan-balance">
                {user?.raivanTokens || 0}
              </div>
              <p className="text-sm text-teal-600 mt-1">
                Convert: {Math.floor((user?.raivanTokens || 0) / 18)} Kairos
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conversion" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversion">Convert Raivan</TabsTrigger>
          <TabsTrigger value="packs">Token Packs</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Raivan to Kairos Conversion */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Convert Raivan to Kairos
              </CardTitle>
              <CardDescription>
                Exchange rate: 18 Raivan = 1 Kairos token
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Raivan Amount</label>
                  <Input
                    type="number"
                    value={conversionAmount}
                    onChange={(e) => setConversionAmount(parseInt(e.target.value) || 0)}
                    min={conversionRate}
                    max={user?.raivanTokens || 0}
                    step={conversionRate}
                    data-testid="input-raivan-amount"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {user?.raivanTokens || 0} Raivan
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Kairos Received</label>
                  <Input
                    type="number"
                    value={Math.floor(conversionAmount / conversionRate)}
                    readOnly
                    data-testid="text-kairos-received"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Max convertible: {maxKairosFromConversion} Kairos
                  </p>
                </div>
              </div>
              <Button
                onClick={handleConversion}
                disabled={conversionAmount < conversionRate || conversionAmount > (user?.raivanTokens || 0) || convertRaivanMutation.isPending}
                className="w-full"
                data-testid="button-convert-raivan"
              >
                {convertRaivanMutation.isPending ? "Converting..." : "Convert Raivan to Kairos"}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Conversions */}
          {conversions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conversions.slice(0, 5).map((conversion) => (
                    <div key={conversion.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                      <span className="text-sm">
                        {conversion.raivanAmount} Raivan → {conversion.kairosAmount} Kairos
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conversion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Viator Token Packs */}
        <TabsContent value="packs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tokenPacks.map((pack) => (
              <Card key={pack.id} className={`relative ${pack.popularBadge ? 'border-yellow-400 dark:border-yellow-600' : ''}`}>
                {pack.popularBadge && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-50">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {pack.name}
                  </CardTitle>
                  <CardDescription>{pack.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {pack.kairosAmount}
                    </div>
                    <p className="text-sm text-muted-foreground">Kairos Tokens</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePurchase(pack.id, 'viator')}
                      disabled={purchasePackMutation.isPending || parseFloat(user?.viatorTokens || "0") < parseFloat(pack.viatorPrice)}
                      data-testid={`button-buy-viator-${pack.packType}`}
                    >
                      {pack.viatorPrice} Viator
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(pack.id, 'usd')}
                      disabled={purchasePackMutation.isPending}
                      data-testid={`button-buy-usd-${pack.packType}`}
                    >
                      ${pack.usdPrice} USD
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5" />
                    {achievement.name}
                  </CardTitle>
                  <Badge variant={achievement.rarity === 'legendary' ? 'default' : 'secondary'}>
                    {achievement.rarity}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reward:</span>
                    <span className="text-sm font-bold text-teal-600">
                      {achievement.raivanReward} Raivan
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}