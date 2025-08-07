import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, AlertCircle, CheckCircle, DollarSign, Clock, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['travel_experiences', 'digital_collectibles', 'token_vouchers']),
  sourceType: z.enum(['lottery_prize', 'platform_nft', 'token_pack', 'achievement_set']),
  sourceId: z.string().min(1, 'Source ID is required'),
  startPrice: z.number().min(100, 'Starting price must be at least $1.00'),
  buyNowPrice: z.number().optional(),
  reservePrice: z.number().optional(),
  listingType: z.enum(['fixed_price', 'auction']),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  terms: z.string().optional(),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

interface UserAsset {
  id: string;
  type: 'lottery_prize' | 'platform_nft' | 'token_pack' | 'achievement_set';
  name: string;
  description: string;
  verificationHash: string;
  category: string;
  isAvailable: boolean;
  estimatedValue: number;
}

export default function SellPage() {
  const [selectedAsset, setSelectedAsset] = useState<UserAsset | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      listingType: 'fixed_price',
      images: [],
      tags: [],
    },
  });

  // Fetch user's available assets
  const { data: userAssets = [], isLoading: assetsLoading } = useQuery<UserAsset[]>({
    queryKey: ['/api/users/sample-user/assets'],
    retry: false,
  });

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      return apiRequest('/api/marketplace/listings', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          images: imageUrls,
          sellerId: 'sample-user',
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Listing Created",
        description: "Your item has been listed in the marketplace!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/listings'] });
      form.reset();
      setImageUrls([]);
      setSelectedAsset(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateListingForm) => {
    createListingMutation.mutate(data);
  };

  const addImageUrl = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const selectAsset = (asset: UserAsset) => {
    setSelectedAsset(asset);
    form.setValue('sourceId', asset.id);
    form.setValue('sourceType', asset.type);
    form.setValue('category', asset.category as any);
    form.setValue('title', asset.name);
    form.setValue('description', asset.description);
    form.setValue('startPrice', Math.floor(asset.estimatedValue * 0.8));
  };

  const formatPrice = (price: number) => {
    return `$USD ${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell on VoyageLotto Marketplace</h1>
        <p className="text-gray-600">List your platform-verified items for sale or auction</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Listing</TabsTrigger>
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Assets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Your Available Items
                </CardTitle>
                <CardDescription>
                  Select an item from your collection to list in the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assetsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : userAssets.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No items available to sell. Participate in lotteries or earn achievements to get items!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {userAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedAsset?.id === asset.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => selectAsset(asset)}
                        data-testid={`asset-${asset.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{asset.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{asset.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {asset.type.replace('_', ' ')}
                              </Badge>
                              {asset.isAvailable && (
                                <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Available
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-xs">
                            <p className="text-gray-500">Est. Value</p>
                            <p className="font-medium">{formatPrice(asset.estimatedValue)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Listing Details
                </CardTitle>
                <CardDescription>
                  Complete the details for your marketplace listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter listing title..." {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your item in detail..."
                              className="min-h-[100px]"
                              {...field} 
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="travel_experiences">Travel Experiences</SelectItem>
                                <SelectItem value="digital_collectibles">Digital Collectibles</SelectItem>
                                <SelectItem value="token_vouchers">Token Vouchers</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="listingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Listing Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-listing-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed_price">Fixed Price</SelectItem>
                                <SelectItem value="auction">Auction</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch('listingType') === 'auction' ? 'Starting Bid' : 'Price'} (cents)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                placeholder="15000"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                data-testid="input-start-price"
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value ? formatPrice(field.value) : 'Enter price in cents'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch('listingType') === 'auction' && (
                        <FormField
                          control={form.control}
                          name="buyNowPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Buy Now Price (cents)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  placeholder="25000"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                  data-testid="input-buy-now-price"
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value ? formatPrice(field.value) : 'Optional instant purchase price'}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Image URLs */}
                    <div className="space-y-3">
                      <FormLabel>Images</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter image URL..."
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          data-testid="input-image-url"
                        />
                        <Button type="button" onClick={addImageUrl} size="sm" data-testid="button-add-image">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImage(index)}
                                data-testid={`button-remove-image-${index}`}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createListingMutation.isPending || !selectedAsset}
                        data-testid="button-create-listing"
                      >
                        {createListingMutation.isPending ? 'Creating Listing...' : 'Create Listing'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="my-listings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Active Listings</CardTitle>
              <CardDescription>Manage your marketplace listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">No active listings yet. Create your first listing!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Earnings Overview
              </CardTitle>
              <CardDescription>Track your marketplace performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Sales</p>
                  <p className="text-2xl font-bold text-green-800">$USD 0</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Active Listings</p>
                  <p className="text-2xl font-bold text-blue-800">0</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Pending Payouts</p>
                  <p className="text-2xl font-bold text-purple-800">$USD 0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}