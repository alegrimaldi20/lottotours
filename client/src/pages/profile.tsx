import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  User, 
  UserFavorite, 
  TokenPurchase 
} from "@shared/schema";
import { 
  Heart, 
  Star, 
  Trophy, 
  Coins, 
  MapPin, 
  Calendar, 
  Gift, 
  Trash2,
  Edit,
  Save,
  X,
  UserIcon,
  Settings,
  CreditCard,
  Activity
} from "lucide-react";

const SAMPLE_USER_ID = "sample-user";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    avatar: ""
  });

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  // Fetch user favorites
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<UserFavorite[]>({
    queryKey: [`/api/users/${SAMPLE_USER_ID}/favorites`],
  });

  // Fetch user token purchases
  const { data: tokenPurchases = [] } = useQuery<TokenPurchase[]>({
    queryKey: [`/api/users/${SAMPLE_USER_ID}/token-purchases`],
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username?: string; email?: string; avatar?: string }) => {
      const response = await apiRequest(`/api/users/${SAMPLE_USER_ID}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", SAMPLE_USER_ID] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      await apiRequest(`/api/users/${SAMPLE_USER_ID}/favorites/${favoriteId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${SAMPLE_USER_ID}/favorites`] });
      toast({
        title: "Favorite Removed",
        description: "Item removed from your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove favorite. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Initialize edit form when user data loads
  React.useEffect(() => {
    if (user && !isEditing) {
      setEditForm({
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || ""
      });
    }
  }, [user, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      // Reset form to original values
      if (user) {
        setEditForm({
          username: user.username || "",
          email: user.email || "",
          avatar: user.avatar || ""
        });
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveProfile = () => {
    if (!editForm.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Username is required.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({
      username: editForm.username.trim(),
      email: editForm.email.trim() || undefined,
      avatar: editForm.avatar.trim() || undefined
    });
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    removeFavoriteMutation.mutate(favoriteId);
  };

  // Group favorites by type
  const favoritesByType = favorites.reduce((acc, favorite) => {
    if (!acc[favorite.itemType]) {
      acc[favorite.itemType] = [];
    }
    acc[favorite.itemType].push(favorite);
    return acc;
  }, {} as Record<string, UserFavorite[]>);

  const renderFavoriteCard = (favorite: UserFavorite) => (
    <Card key={favorite.id} className="relative group" data-testid={`favorite-card-${favorite.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{favorite.itemTitle}</CardTitle>
            <CardDescription className="line-clamp-2">
              {favorite.itemDescription}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveFavorite(favorite.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
            data-testid={`remove-favorite-${favorite.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {favorite.itemType.replace('_', ' ').toUpperCase()}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(favorite.createdAt).toLocaleDateString()}
          </div>
        </div>
        {favorite.itemMetadata && (
          <div className="mt-2 text-sm text-muted-foreground">
            {/* Parse and display specific metadata based on item type */}
            {favorite.itemType === 'lottery' && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Draw: {new Date(JSON.parse(favorite.itemMetadata).drawDate).toLocaleDateString()}
              </div>
            )}
            {favorite.itemType === 'mission' && (
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Reward: {JSON.parse(favorite.itemMetadata).reward} tokens
              </div>
            )}
            {favorite.itemType === 'marketplace_item' && (
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Cost: {JSON.parse(favorite.itemMetadata).tokensRequired} tokens
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (userLoading || favoritesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">User not found</p>
            <Link href="/dashboard">
              <Button className="mt-4">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and view your TravelLotto activity
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" data-testid="back-to-dashboard">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2" data-testid="tab-profile">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2" data-testid="tab-favorites">
            <Heart className="h-4 w-4" />
            Favorites ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2" data-testid="tab-activity">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2" data-testid="tab-settings">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                    data-testid="edit-profile-button"
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-400 to-purple-600 flex items-center justify-center text-2xl">
                        {user.avatar || "🧭"}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{user.username}</h3>
                        <p className="text-muted-foreground">{user.email || "No email provided"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{user.tokens}</div>
                        <div className="text-sm text-muted-foreground">Tokens</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{user.level}</div>
                        <div className="text-sm text-muted-foreground">Level</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Enter your username"
                        data-testid="input-username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Enter your email"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="avatar">Avatar Emoji</Label>
                      <Input
                        id="avatar"
                        value={editForm.avatar}
                        onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                        placeholder="🧭 Choose an emoji"
                        maxLength={2}
                        data-testid="input-avatar"
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="w-full"
                      data-testid="save-profile-button"
                    >
                      {updateProfileMutation.isPending ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{user.totalMissionsCompleted}</div>
                    <div className="text-sm text-muted-foreground">Missions Completed</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
                    <div className="text-sm text-muted-foreground">Favorites</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">{tokenPurchases.length}</div>
                    <div className="text-sm text-muted-foreground">Token Purchases</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Member Since</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-6">
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding items to your favorites to see them here!
                </p>
                <div className="flex justify-center gap-2">
                  <Link href="/lotteries">
                    <Button variant="outline">Browse Lotteries</Button>
                  </Link>
                  <Link href="/missions">
                    <Button variant="outline">Explore Missions</Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline">Visit Marketplace</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Lottery Favorites */}
              {favoritesByType.lottery && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-600" />
                    Favorite Lotteries ({favoritesByType.lottery.length})
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favoritesByType.lottery.map(renderFavoriteCard)}
                  </div>
                </div>
              )}

              {/* Mission Favorites */}
              {favoritesByType.mission && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Favorite Missions ({favoritesByType.mission.length})
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favoritesByType.mission.map(renderFavoriteCard)}
                  </div>
                </div>
              )}

              {/* Marketplace Favorites */}
              {favoritesByType.marketplace_item && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-teal-600" />
                    Favorite Marketplace Items ({favoritesByType.marketplace_item.length})
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favoritesByType.marketplace_item.map(renderFavoriteCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokenPurchases.length > 0 ? (
                  tokenPurchases.slice(0, 5).map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Token Purchase</p>
                          <p className="text-sm text-muted-foreground">
                            Purchased {purchase.tokenAmount} tokens
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(purchase.amountUsd / 100).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.purchasedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage your email and push notifications
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Privacy Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Control your data and privacy preferences
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h5 className="font-medium">Delete Account</h5>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}