import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { type User, type Mission } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Map, Star, ArrowRight, Gift, Users, Target } from "lucide-react";
import TravelImageRenderer from "@/components/travel-image-renderer";


// Using sample user for demo
const SAMPLE_USER_ID = "sample-user";

export default function Dashboard() {
  const { toast } = useToast();


  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  const { data: missions, isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ["/api/missions"],
  });

  const completeMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const response = await apiRequest(`/api/users/${SAMPLE_USER_ID}/missions/${missionId}/complete`, {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: (data, missionId) => {
      const mission = missions?.find(m => m.id === missionId);
      toast({
        title: "Mission Completed!",
        description: `You earned ${mission?.reward || 0} tokens!`,
      });
      // Update user tokens
      if (user && mission) {
        queryClient.setQueryData(["/api/users", SAMPLE_USER_ID], {
          ...user,
          tokens: user.tokens + mission.reward,
          totalMissionsCompleted: user.totalMissionsCompleted + 1
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: () => {
      toast({
        title: "Mission Failed",
        description: "Unable to complete mission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCompleteMission = (missionId: string) => {
    completeMissionMutation.mutate(missionId);
  };

  if (userLoading || missionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-explore-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const levelProgress = user ? ((user.tokens % 100) / 100) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
                <Button variant="ghost" data-testid="nav-marketplace">Marketplace</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="welcome-title">
            Welcome back, {user?.username || 'Explorer'}! 🌍
          </h1>
          <p className="text-slate-600" data-testid="welcome-subtitle">
            Ready for your next adventure? Complete missions and enter lotteries to win amazing prizes!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-lottery-card border-lottery-gold/20 shadow-lg" data-testid="stat-tokens">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <Coins className="h-4 w-4 text-golden-luck" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-explore-blue">{user?.tokens || 0}</div>
              <p className="text-xs text-slate-600">+25 from last mission</p>
            </CardContent>
          </Card>

          <Card className="bg-adventure-card border-adventure-teal/20 shadow-lg" data-testid="stat-level">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Explorer Level</CardTitle>
              <Star className="h-4 w-4 text-travel-mint" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-travel-mint">{user?.level || 1}</div>
              <Progress value={levelProgress} className="mt-2 h-2" />
              <p className="text-xs text-slate-600 mt-1">{100 - (user?.tokens || 0) % 100} tokens to next level</p>
            </CardContent>
          </Card>

          <Card className="bg-travel-card border-travel-coral/20 shadow-lg" data-testid="stat-missions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missions Completed</CardTitle>
              <Target className="h-4 w-4 text-golden-luck" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-golden-luck">{user?.totalMissionsCompleted || 0}</div>
              <p className="text-xs text-slate-600">Great progress!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-lottery border-lottery-purple/20 shadow-lg" data-testid="stat-rank">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
              <Trophy className="h-4 w-4 text-explore-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-explore-blue">#2,847</div>
              <p className="text-xs text-slate-600">Top 15% of explorers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Missions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="missions-title">
                  <Map className="h-5 w-5 text-explore-blue" />
                  Active Missions
                </CardTitle>
                <CardDescription>
                  Complete these missions to earn tokens and level up your explorer status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {missions?.slice(0, 3).map((mission) => (
                  <div 
                    key={mission.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    data-testid={`mission-${mission.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8">
                            <TravelImageRenderer type="mission" theme={mission.icon} className="w-full h-full rounded" />
                          </div>
                          <h3 className="font-semibold text-slate-900">{mission.title}</h3>
                          <Badge 
                            variant={mission.difficulty === 'easy' ? 'secondary' : 
                                   mission.difficulty === 'medium' ? 'default' : 'destructive'}
                          >
                            {mission.difficulty}
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{mission.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Map className="h-4 w-4" />
                              {mission.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Coins className="h-4 w-4" />
                              {mission.reward} tokens
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleCompleteMission(mission.id)}
                        disabled={completeMissionMutation.isPending}
                        className="ml-4 btn-lottery shadow-lg"
                        data-testid={`complete-mission-${mission.id}`}
                      >
                        {completeMissionMutation.isPending ? "Completing..." : "Complete"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="quick-actions-title">
                  <Gift className="h-5 w-5 text-golden-luck" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/lotteries">
                  <Button className="w-full justify-start btn-lottery shadow-lg" data-testid="button-view-lotteries">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Active Lotteries
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button className="w-full justify-start btn-adventure shadow-lg" data-testid="button-browse-prizes">
                    <Gift className="mr-2 h-4 w-4" />
                    Browse Prize Marketplace
                  </Button>
                </Link>
                <Link href="/token-shop">
                  <Button className="w-full justify-start btn-lottery shadow-lg" data-testid="button-token-shop">
                    <Coins className="mr-2 h-4 w-4" />
                    Buy Token Packs
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start border-lottery-purple text-lottery-purple hover:bg-lottery-purple hover:text-white shadow-lg" data-testid="button-invite-friends">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Friends
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium" data-testid="recent-activity-title">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-travel-mint rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Mission Completed</p>
                    <p className="text-slate-500">Tokyo Food Explorer - 75 tokens</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-golden-luck rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Lottery Entry</p>
                    <p className="text-slate-500">Paris Weekend Getaway</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-explore-blue rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Level Up!</p>
                    <p className="text-slate-500">Reached Explorer Level 3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}