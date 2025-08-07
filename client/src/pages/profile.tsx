import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, Target, Zap, User as UserIcon, Crown, Star, 
  Trophy, Calendar, MapPin, Settings, Edit3, Save
} from "lucide-react";
import MobileNavigation from "@/components/mobile-navigation";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/lib/i18n";

const SAMPLE_USER_ID = "sample-user";

export default function Profile() {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  const userLevel = Math.floor((user?.viatorTokens ? parseFloat(user.viatorTokens) : 0) / 5) + 1;
  const levelProgress = user?.viatorTokens ? (parseFloat(user.viatorTokens) % 5) * 20 : 0;

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUsername(user?.username || "");
    } else {
      setEditedUsername(user?.username || "");
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="text-xl sm:text-2xl font-bold gradient-travel bg-clip-text text-transparent" data-testid="logo">
                ✈️ TravelLotto
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
                <Button variant="ghost" data-testid="nav-tokens">Token Management</Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="ghost" data-testid="nav-marketplace">Marketplace</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="text-blue-600 font-medium" data-testid="nav-profile">
                  Profile
                </Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <ProfileDropdown />
              <MobileNavigation currentPath="/profile" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || "T"}
              </div>
              <Badge className="absolute -bottom-2 -right-2 bg-yellow-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Lv {userLevel}
              </Badge>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="text-2xl font-bold border-none p-0 h-auto"
                      data-testid="username-input"
                    />
                    <Button size="sm" onClick={handleEditToggle} data-testid="save-username">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user?.username || "Traveler"}
                    </h1>
                    <Button variant="ghost" size="sm" onClick={handleEditToggle} data-testid="edit-username">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>Member since {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>{user?.totalMissionsCompleted || 0} missions completed</span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Level Progress</span>
                  <span className="text-sm text-gray-500">{levelProgress.toFixed(0)}%</span>
                </div>
                <Progress value={levelProgress} className="w-full" />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{user?.viatorTokens || "0"}</div>
                <div className="text-sm text-gray-600">Viator</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{user?.kairosTokens || 0}</div>
                <div className="text-sm text-gray-600">Kairos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-600">{user?.raivanTokens || 0}</div>
                <div className="text-sm text-gray-600">Raivan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokens">Token Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Account Overview
                  </CardTitle>
                  <CardDescription>Your TravelLotto journey at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{userLevel}</div>
                      <div className="text-sm text-blue-600">Current Level</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${user?.viatorTokens || "0"}</div>
                      <div className="text-sm text-green-600">Account Value</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Missions</span>
                      <span className="text-sm font-semibold">{user?.totalMissionsCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Lottery Entries</span>
                      <span className="text-sm font-semibold">{user?.kairosTokens || 0} Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reward Points</span>
                      <span className="text-sm font-semibold">{user?.raivanTokens || 0} Raivan</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest TravelLotto interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Account Created</div>
                        <div className="text-xs text-gray-500">Welcome to TravelLotto!</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Ready to Explore</div>
                        <div className="text-xs text-gray-500">Start your travel lottery journey</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Token Details Tab */}
          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Viator Tokens */}
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <Coins className="h-5 w-5" />
                    Viator Tokens
                  </CardTitle>
                  <CardDescription>Strong Currency ($1 USD each)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {user?.viatorTokens || "0.00"}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>USD Value:</span>
                      <span className="font-semibold">${user?.viatorTokens || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Can Purchase:</span>
                      <span className="font-semibold">{Math.floor(parseFloat(user?.viatorTokens || "0") * 18)} Kairos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kairos Tokens */}
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Target className="h-5 w-5" />
                    Kairos Tokens
                  </CardTitle>
                  <CardDescription>Lottery Tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {user?.kairosTokens || 0}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lottery Entries:</span>
                      <span className="font-semibold">{user?.kairosTokens || 0} Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Raivan Value:</span>
                      <span className="font-semibold">{(user?.kairosTokens || 0) * 18} Raivan</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Raivan Tokens */}
              <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-teal-700">
                    <Zap className="h-5 w-5" />
                    Raivan Tokens
                  </CardTitle>
                  <CardDescription>Reward Points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 mb-2">
                    {user?.raivanTokens || 0}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Conversion Ready:</span>
                      <span className="font-semibold">{Math.floor((user?.raivanTokens || 0) / 18)} Kairos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-semibold">{(user?.raivanTokens || 0) % 18} Raivan</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Token Management</CardTitle>
                <CardDescription>Convert and manage your tokens efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-4">
                  <Link href="/token-management">
                    <Button className="w-full" data-testid="manage-tokens">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Tokens
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>Track your TravelLotto journey and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No activity history yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start participating in lotteries and completing missions to see your activity here!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account preferences and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={user?.username || ""} 
                    placeholder="Enter your username"
                    data-testid="settings-username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ""} 
                    placeholder="Enter your email"
                    data-testid="settings-email"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Language</span>
                      <LanguageSelector />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" data-testid="save-settings">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}