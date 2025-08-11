import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Heart, MapPin, Calendar, DollarSign, Verified, Trophy, Star, Clock, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { KairosTokenBalance } from "@/components/KairosTokenBalance";

interface MarketplaceListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  sourceType: string;
  sourceId: string;
  verificationHash: string;
  startPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  listingType: 'fixed_price' | 'auction';
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  totalWatchers: number;
  images?: string[];
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface SellerProfile {
  id: string;
  userId: string;
  sellerName: string;
  sellerDescription: string;
  totalSales: number;
  totalRevenue: number;
  sellerRating: number;
  totalReviews: number;
  verifiedSeller: boolean;
  sellerBadge: string;
  contactInfo?: string;
  paymentInfo?: string;
  createdAt: string;
  lastActiveAt: string;
}

export default function MarketplacePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch user data for token balance
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/sample-user"],
  });

  const { data: listings = [], isLoading, error } = useQuery<MarketplaceListing[]>({
    queryKey: ['/api/marketplace/listings', selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      const url = `/api/marketplace/listings${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace listings');
      }
      return response.json();
    },
    retry: false,
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async ({ listingId, price }: { listingId: string; price: number }) => {
      const response = await apiRequest(`/api/marketplace/listings/${listingId}/purchase`, {
        method: 'POST',
        body: { 
          userId: 'sample-user',
          purchasePrice: price,
          paymentMethod: 'kairos_tokens'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Purchase failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Purchase Successful!",
        description: "Item purchased successfully with Kairos tokens",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/listings'] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/sample-user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Unable to complete purchase",
        variant: "destructive",
      });
    },
  });

  const filteredListings = listings.filter((listing) => {
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return `$USD ${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatKairosPrice = (price: number) => {
    // Convert USD price to Kairos tokens (1 USD = 10 Kairos tokens approximately)
    const kairosPrice = Math.ceil((price / 100) * 10);
    return `${kairosPrice} Kairos`;
  };

  const handlePurchase = (listing: MarketplaceListing) => {
    const kairosPrice = Math.ceil((listing.currentPrice / 100) * 10);
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to make purchases",
        variant: "destructive",
      });
      return;
    }

    if ((user.kairosTokens || 0) < kairosPrice) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${kairosPrice} Kairos tokens but only have ${user.kairosTokens || 0}`,
        variant: "destructive",
      });
      return;
    }

    purchaseMutation.mutate({ listingId: listing.id, price: kairosPrice });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel_experiences': return <MapPin className="h-4 w-4" />;
      case 'digital_collectibles': return <Trophy className="h-4 w-4" />;
      case 'token_vouchers': return <DollarSign className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'travel_experiences': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'digital_collectibles': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'token_vouchers': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Marketplace Temporarily Unavailable</h2>
          <p className="text-red-600">We're experiencing technical difficulties. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VoyageLotto Marketplace</h1>
          <p className="text-gray-600">Discover authentic travel experiences and platform-verified collectibles</p>
        </div>
        <Link href="/sell">
          <Button className="bg-green-600 hover:bg-green-700 text-white" data-testid="button-sell-now">
            <Plus className="h-4 w-4 mr-2" />
            Sell Item
          </Button>
        </Link>
      </div>

      {/* Token Balance Section */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <KairosTokenBalance variant="compact" showConvertButton={true} />
          <div className="text-sm text-gray-600">
            Use Kairos tokens to purchase marketplace items
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="travel_experiences">Travel Experiences</SelectItem>
                <SelectItem value="digital_collectibles">Digital Collectibles</SelectItem>
                <SelectItem value="token_vouchers">Token Vouchers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Marketplace Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Listings</TabsTrigger>
          <TabsTrigger value="auctions">Live Auctions</TabsTrigger>
          <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Eye className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden" data-testid={`card-listing-${listing.id}`}>
                  {/* Image Gallery */}
                  {listing.images && listing.images.length > 0 && (
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop';
                        }}
                      />
                      {listing.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          +{listing.images.length - 1} more
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        {listing.listingType === 'auction' && (
                          <Badge className="bg-red-500 text-white border-red-600">
                            <Clock className="h-3 w-3 mr-1" />
                            AUCTION
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">{listing.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getCategoryBadgeColor(listing.category)} flex items-center gap-1`}>
                            {getCategoryIcon(listing.category)}
                            {listing.category.replace('_', ' ')}
                          </Badge>
                          {listing.verificationHash && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              <Verified className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {listing.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          {listing.listingType === 'auction' ? (
                            <div>
                              <p className="text-sm text-gray-500">Current Bid</p>
                              <p className="text-xl font-bold text-blue-600">{formatPrice(listing.currentPrice)}</p>
                              {listing.buyNowPrice && (
                                <p className="text-sm text-gray-500">Buy Now: {formatPrice(listing.buyNowPrice)}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="text-xl font-bold text-green-600">{formatPrice(listing.currentPrice)}</p>
                              <p className="text-sm text-purple-600 font-medium">{formatKairosPrice(listing.currentPrice)}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="h-4 w-4 mr-1" />
                            {listing.totalWatchers}
                          </div>
                          {listing.endsAt && (
                            <div className="flex items-center text-sm text-orange-600 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Ends Soon
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {listing.listingType === 'auction' ? (
                          <Button className="flex-1" data-testid={`button-bid-${listing.id}`}>
                            Place Bid
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1" 
                            data-testid={`button-buy-${listing.id}`}
                            onClick={() => handlePurchase(listing)}
                            disabled={purchaseMutation.isPending}
                          >
                            {purchaseMutation.isPending ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent"></div>
                                Comprando...
                              </div>
                            ) : (
                              <>
                                <Coins className="h-4 w-4 mr-2" />
                                Buy with Kairos
                              </>
                            )}
                          </Button>
                        )}
                        <Button variant="outline" size="sm" data-testid={`button-details-${listing.id}`}>
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="auctions" className="mt-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Trophy className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Live Auctions</h3>
            <p className="text-gray-500">Browse active auction listings with live bidding</p>
          </div>
        </TabsContent>

        <TabsContent value="sellers" className="mt-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Top Sellers</h3>
            <p className="text-gray-500">Discover verified sellers with excellent ratings</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}