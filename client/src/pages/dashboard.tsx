import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { type User, type Lottery } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Coins, Trophy, Map, Star, ArrowRight, Gift, Users, User as UserIcon, 
  Target, Crown, Plane, MapPin, Calendar, TrendingUp, Zap
} from "lucide-react";
import MobileNavigation from "@/components/mobile-navigation";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/lib/i18n";

const SAMPLE_USER_ID = "sample-user";

export default function Dashboard() {
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  // Fetch active lotteries
  const { data: lotteries = [] } = useQuery<Lottery[]>({
    queryKey: ["/api/lotteries"],
  });

  // Fetch token packs
  const { data: tokenPacks = [] } = useQuery({
    queryKey: ["/api/viator-token-packs"],
  });

  // Quick stats calculations
  const activeLotteries = lotteries.filter(l => new Date(l.drawDate) > new Date()).length;
  const totalPrizeValue = lotteries.reduce((sum, l) => sum + l.prizeValue, 0);
  const userLevel = Math.floor((user?.viatorTokens ? parseFloat(user.viatorTokens) : 0) / 5) + 1;
  const levelProgress = user?.viatorTokens ? (parseFloat(user.viatorTokens) % 5) * 20 : 0;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your travel dashboard...</p>
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
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-blue-600 font-medium" data-testid="nav-dashboard">
                  Dashboard
                </Button>
              </Link>
              <Link href="/lotteries">
                <Button variant="ghost" data-testid="nav-lotteries">Lotteries</Button>
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
              <LanguageSelector />
              <ProfileDropdown />
              <MobileNavigation currentPath="/dashboard" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-explore-blue mb-2">
            Welcome back, {user?.username || 'Traveler'}! ✨
          </h1>
          <p className="text-muted-foreground">
            Ready for your next adventure? Explore lotteries, manage tokens, and win amazing travel experiences.
          </p>
        </div>

        {/* Token Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Viator Tokens */}
          <Card className="border-golden-luck bg-gradient-to-br from-golden-luck/10 to-golden-luck/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-golden-luck">
                <Coins className="h-5 w-5" />
                Viator Tokens
              </CardTitle>
              <CardDescription>Strong Currency ($1 USD each)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-golden-luck" data-testid="viator-balance">
                {user?.viatorTokens || "0.00"}
              </div>
              <p className="text-sm text-golden-luck/70 mt-1">
                ≈ ${user?.viatorTokens || "0.00"} USD
              </p>
            </CardContent>
          </Card>

          {/* Kairos Tokens */}
          <Card className="border-ocean-pulse bg-gradient-to-br from-ocean-pulse/10 to-ocean-pulse/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-ocean-pulse">
                <Target className="h-5 w-5" />
                Kairos Tokens
              </CardTitle>
              <CardDescription>Lottery Tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-ocean-pulse" data-testid="kairos-balance">
                {user?.kairosTokens || 0}
              </div>
              <p className="text-sm text-ocean-pulse/70 mt-1">
                Ready for lotteries
              </p>
            </CardContent>
          </Card>

          {/* Raivan Tokens */}
          <Card className="border-travel-mint bg-gradient-to-br from-travel-mint/10 to-travel-mint/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-travel-mint">
                <Zap className="h-5 w-5" />
                Raivan Tokens
              </CardTitle>
              <CardDescription>Reward Points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-travel-mint" data-testid="raivan-balance">
                {user?.raivanTokens || 0}
              </div>
              <p className="text-sm text-travel-mint/70 mt-1">
                Convert: {Math.floor((user?.raivanTokens || 0) / 18)} Kairos
              </p>
            </CardContent>
          </Card>

          {/* User Level */}
          <Card className="border-explore-blue bg-gradient-to-br from-explore-blue/10 to-explore-blue/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-explore-blue">
                <Crown className="h-5 w-5" />
                Traveler Level
              </CardTitle>
              <CardDescription>Adventure Progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-explore-blue" data-testid="user-level">
                {userLevel}
              </div>
              <Progress value={levelProgress} className="mt-2" />
              <p className="text-sm text-explore-blue/70 mt-1">
                {100 - levelProgress}% to next level
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lotteries">Active Lotteries</TabsTrigger>
            <TabsTrigger value="tokens">Token Packs</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Jump into your next adventure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/lotteries">
                    <Button className="w-full justify-between" data-testid="quick-action-lotteries">
                      Explore Lotteries
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/token-management">
                    <Button variant="outline" className="w-full justify-between" data-testid="quick-action-tokens">
                      Manage Tokens
                      <Coins className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full justify-between" data-testid="quick-action-marketplace">
                      Browse Marketplace
                      <Gift className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Platform Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Stats
                  </CardTitle>
                  <CardDescription>Current platform activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Lotteries</span>
                    <Badge variant="secondary">{activeLotteries}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Prize Value</span>
                    <Badge variant="secondary">${totalPrizeValue.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Your Entries</span>
                    <Badge variant="secondary">{user?.kairosTokens || 0} Available</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Lotteries Tab */}
          <TabsContent value="lotteries" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteries.slice(0, 6).map((lottery) => (
                <Card key={lottery.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5" />
                      {lottery.title}
                    </CardTitle>
                    <Badge variant={new Date(lottery.drawDate) > new Date() ? 'default' : 'secondary'}>
                      {new Date(lottery.drawDate) > new Date() ? 'Active' : 'Completed'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {lottery.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Prize Value:</span>
                        <span className="font-semibold">${lottery.prizeValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Entry Cost:</span>
                        <span className="font-semibold">{lottery.ticketPrice} Kairos</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Draw Date:</span>
                        <span>{new Date(lottery.drawDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/lottery/${lottery.id}`}>
                      <Button className="w-full mt-4" size="sm" data-testid={`lottery-${lottery.id}`}>
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {lotteries.length > 6 && (
              <div className="text-center">
                <Link href="/lotteries">
                  <Button variant="outline" data-testid="view-all-lotteries">
                    View All Lotteries
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Token Packs Tab */}
          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(tokenPacks as any[])?.map((pack: any) => (
                <Card key={pack.id} className={`relative ${pack.popularBadge ? 'border-yellow-400 ring-2 ring-yellow-200' : ''}`}>
                  {pack.popularBadge && (
                    <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-center">{pack.name}</CardTitle>
                    <CardDescription className="text-center">{pack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {pack.kairosAmount}
                      </div>
                      <p className="text-sm text-gray-600">Kairos Tokens</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-semibold text-yellow-600">{pack.viatorPrice}</div>
                        <div className="text-xs text-yellow-600">Viator</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-600">${pack.usdPrice}</div>
                        <div className="text-xs text-green-600">USD</div>
                      </div>
                    </div>
                    
                    <Link href="/token-management">
                      <Button className="w-full" data-testid={`token-pack-${pack.packType}`}>
                        Purchase Pack
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Total Tokens Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {(user?.raivanTokens || 0) + (user?.kairosTokens || 0)}
                  </div>
                  <p className="text-sm text-gray-600">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Lottery Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {user?.kairosTokens || 0}
                  </div>
                  <p className="text-sm text-gray-600">Available tickets</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Account Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${user?.viatorTokens || "0.00"}
                  </div>
                  <p className="text-sm text-gray-600">USD equivalent</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Traveler Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">
                    {userLevel}
                  </div>
                  <p className="text-sm text-gray-600">Explorer rank</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}