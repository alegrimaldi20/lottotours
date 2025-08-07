import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowRightLeft, 
  Coins, 
  Trophy, 
  Star, 
  Gift,
  TrendingUp,
  Users,
  Target
} from "lucide-react";

interface User {
  id: string;
  explrTokens: string;
  tktTokens: number;
  xpTokens: number;
  tokens: number;
  level: number;
}

interface TokenConversionRate {
  xpToTkt: number;
  xpToExplr: number;
}

interface NewTokenPack {
  id: string;
  name: string;
  description: string;
  tktAmount: number;
  explrCost: string;
  usdCost: string;
  bonusPercentage: number;
  isActive: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  criteria: string;
  xpReward: number;
  tktReward: number;
  explrReward: string;
  isActive: boolean;
}

interface UserAchievement {
  id: string;
  achievementId: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rewardsClaimed: boolean;
  unlockedAt?: Date;
  claimedAt?: Date;
}

export default function TokenManagement() {
  const [selectedUser] = useState("sample-user"); // Use the sample user
  const [conversionAmount, setConversionAmount] = useState("");
  const [conversionType, setConversionType] = useState<"xp_to_tkt" | "xp_to_explr">("xp_to_tkt");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", selectedUser],
    enabled: !!selectedUser
  });

  // Fetch conversion rates
  const { data: conversionRates } = useQuery<TokenConversionRate>({
    queryKey: ["/api/token/conversion-rates"]
  });

  // Fetch token packs
  const { data: tokenPacks = [] } = useQuery<NewTokenPack[]>({
    queryKey: ["/api/token-packs/new"]
  });

  // Fetch achievements
  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"]
  });

  // Fetch user achievements
  const { data: userAchievements = [] } = useQuery<UserAchievement[]>({
    queryKey: ["/api/users", selectedUser, "achievements"],
    enabled: !!selectedUser
  });

  // Token conversion mutation
  const conversionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/users/${selectedUser}/token-conversions`, {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Tokens converted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUser] });
      setConversionAmount("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to convert tokens",
        variant: "destructive"
      });
    }
  });

  // Token pack purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async ({ packId, paymentMethod }: { packId: string; paymentMethod: string }) => {
      return apiRequest(`/api/users/${selectedUser}/token-packs/${packId}/purchase`, {
        method: "POST",
        body: JSON.stringify({ paymentMethod })
      });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Token pack purchased successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUser] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to purchase token pack",
        variant: "destructive"
      });
    }
  });

  // Achievement claim mutation
  const claimMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      return apiRequest(`/api/users/${selectedUser}/achievements/${achievementId}/claim`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Achievement reward claimed!" });
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUser, "achievements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUser] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to claim achievement",
        variant: "destructive"
      });
    }
  });

  const handleConversion = () => {
    if (!conversionAmount || !conversionRates) return;

    const amount = parseInt(conversionAmount);
    if (amount <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    const rate = conversionType === "xp_to_tkt" ? conversionRates.xpToTkt : conversionRates.xpToExplr;
    const convertedAmount = conversionType === "xp_to_tkt" ? amount / rate : (amount / rate).toString();

    conversionMutation.mutate({
      conversionType,
      fromToken: "xp",
      toToken: conversionType === "xp_to_tkt" ? "tkt" : "explr",
      fromAmount: amount,
      toAmount: convertedAmount,
      conversionRate: rate
    });
  };

  const getConvertedAmount = () => {
    if (!conversionAmount || !conversionRates) return "0";
    const amount = parseInt(conversionAmount);
    const rate = conversionType === "xp_to_tkt" ? conversionRates.xpToTkt : conversionRates.xpToExplr;
    return conversionType === "xp_to_tkt" 
      ? (amount / rate).toFixed(0)
      : (amount / rate).toFixed(2);
  };

  const unlockedAchievements = userAchievements.filter(ua => ua.isUnlocked && !ua.rewardsClaimed);
  const completedAchievements = userAchievements.filter(ua => ua.rewardsClaimed);

  return (
    <div className="container mx-auto p-6 space-y-8" data-testid="token-management-page">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Strong Token EXPLR Management
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your three-token economy: XP, TKT, and EXPLR tokens
        </p>
      </div>

      {/* Token Balances */}
      {user && (
        <Card data-testid="token-balances-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              Your Token Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user.xpTokens || 0}</div>
                <div className="text-sm text-muted-foreground">XP Tokens</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user.tktTokens || 0}</div>
                <div className="text-sm text-muted-foreground">TKT Tokens</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{parseFloat(user.explrTokens || "0").toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">EXPLR Tokens</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{user.tokens}</div>
                <div className="text-sm text-muted-foreground">Legacy Tokens</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="conversion" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversion" data-testid="tab-conversion">Token Conversion</TabsTrigger>
          <TabsTrigger value="packs" data-testid="tab-packs">Token Packs</TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Token Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card data-testid="conversion-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Convert XP to Other Tokens
              </CardTitle>
              <CardDescription>
                Exchange your XP tokens for TKT or EXPLR tokens with current conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversionRates && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">XP → TKT Rate</div>
                    <div className="text-lg font-bold">{conversionRates.xpToTkt} XP = 1 TKT</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">XP → EXPLR Rate</div>
                    <div className="text-lg font-bold">{conversionRates.xpToExplr} XP = 0.5 EXPLR</div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conversionType">Conversion Type</Label>
                  <select
                    id="conversionType"
                    value={conversionType}
                    onChange={(e) => setConversionType(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                    data-testid="select-conversion-type"
                  >
                    <option value="xp_to_tkt">XP to TKT</option>
                    <option value="xp_to_explr">XP to EXPLR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversionAmount">XP Amount to Convert</Label>
                  <Input
                    id="conversionAmount"
                    type="number"
                    placeholder="Enter XP amount"
                    value={conversionAmount}
                    onChange={(e) => setConversionAmount(e.target.value)}
                    data-testid="input-conversion-amount"
                  />
                </div>

                {conversionAmount && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">You will receive:</div>
                    <div className="text-lg font-bold">
                      {getConvertedAmount()} {conversionType === "xp_to_tkt" ? "TKT" : "EXPLR"}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleConversion}
                  disabled={!conversionAmount || conversionMutation.isPending}
                  className="w-full"
                  data-testid="button-convert"
                >
                  {conversionMutation.isPending ? "Converting..." : "Convert Tokens"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Token Packs Tab */}
        <TabsContent value="packs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokenPacks.map((pack) => (
              <Card key={pack.id} className="relative overflow-hidden" data-testid={`token-pack-${pack.id}`}>
                {pack.bonusPercentage > 0 && (
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    +{pack.bonusPercentage}% Bonus
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  <CardDescription>{pack.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{pack.tktAmount} TKT</div>
                    <div className="text-sm text-muted-foreground">Tokens Included</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => purchaseMutation.mutate({ packId: pack.id, paymentMethod: "explr" })}
                      disabled={purchaseMutation.isPending}
                      data-testid={`button-buy-explr-${pack.id}`}
                    >
                      Buy with {parseFloat(pack.explrCost).toFixed(2)} EXPLR
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => purchaseMutation.mutate({ packId: pack.id, paymentMethod: "usd" })}
                      disabled={purchaseMutation.isPending}
                      data-testid={`button-buy-usd-${pack.id}`}
                    >
                      Buy for ${parseFloat(pack.usdCost).toFixed(2)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Claimable Achievements */}
          {unlockedAchievements.length > 0 && (
            <Card data-testid="claimable-achievements-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-600" />
                  Claimable Rewards
                </CardTitle>
                <CardDescription>
                  You have unlocked achievements ready to claim!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unlockedAchievements.map((userAchievement) => {
                    const achievement = achievements.find(a => a.id === userAchievement.achievementId);
                    if (!achievement) return null;
                    
                    return (
                      <div key={userAchievement.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-8 w-8 text-yellow-500" />
                          <div>
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-sm text-muted-foreground">{achievement.description}</div>
                            <div className="text-sm text-green-600">
                              Rewards: {achievement.xpReward} XP, {achievement.tktReward} TKT, {parseFloat(achievement.explrReward).toFixed(2)} EXPLR
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => claimMutation.mutate(achievement.id)}
                          disabled={claimMutation.isPending}
                          data-testid={`button-claim-${achievement.id}`}
                        >
                          Claim Reward
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Achievements */}
          <Card data-testid="all-achievements-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                All Achievements
              </CardTitle>
              <CardDescription>
                Track your progress and unlock rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
                  const isCompleted = userAchievement?.rewardsClaimed || false;
                  const isUnlocked = userAchievement?.isUnlocked || false;
                  const progress = userAchievement?.progress || 0;
                  const maxProgress = userAchievement?.maxProgress || 1;
                  
                  return (
                    <div key={achievement.id} className={`p-4 border rounded-lg ${isCompleted ? 'bg-muted' : ''}`} data-testid={`achievement-${achievement.id}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-600' : isUnlocked ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                          <Trophy className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{achievement.title}</div>
                            {isCompleted && <Badge variant="secondary">Completed</Badge>}
                            {isUnlocked && !isCompleted && <Badge variant="default">Ready to Claim</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{achievement.description}</div>
                          
                          {userAchievement && (
                            <div className="space-y-2">
                              <Progress value={(progress / maxProgress) * 100} className="h-2" />
                              <div className="text-xs text-muted-foreground">
                                Progress: {progress}/{maxProgress}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground mt-2">
                            Rewards: {achievement.xpReward} XP, {achievement.tktReward} TKT, {parseFloat(achievement.explrReward).toFixed(2)} EXPLR
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}