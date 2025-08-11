import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocaleSafeToast } from '@/hooks/use-locale-safe-toast';
import type { User } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Heart, MapPin, Calendar, DollarSign, Verified, Trophy, Star, Clock, Plus, Coins } from 'lucide-react';
import { Link } from 'wouter';
import { KairosTokenBalance } from "@/components/KairosTokenBalance";
import { InlineToaster } from "@/components/inline-toast";

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
  const { toast, toasts, removeToast } = useLocaleSafeToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

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



  const filteredListings = listings.filter((listing) => {
    // Only show active listings (not sold)
    const isActive = listing.status === 'active';
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isActive && matchesCategory && matchesSearch;
  });

  console.log('Total listings:', listings.length);
  console.log('Filtered listings:', filteredListings.length);
  console.log('Selected category:', selectedCategory);
  console.log('User data:', user);

  const formatPrice = (price: number) => {
    return `$USD ${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatKairosPrice = (price: number) => {
    // Price is already in centavos, convert directly to Kairos tokens
    const kairosPrice = Math.ceil(price / 100);
    return `${kairosPrice} Kairos`;
  };

  const handlePurchase = (listing: MarketplaceListing) => {
    const kairosPrice = Math.ceil(listing.currentPrice / 100);
    
    if (!user || (user.kairosTokens || 0) < kairosPrice) {
      toast({
        title: "Error",
        description: !user ? "Login requerido" : "Tokens insuficientes", 
        variant: "destructive",
      });
      return;
    }

    // Immediately set loading state for this specific button
    setPurchasingId(listing.id);

    // Make the purchase request
    fetch(`/api/marketplace/listings/${listing.id}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: 'sample-user',
        purchasePrice: kairosPrice,
        paymentMethod: 'kairos_tokens'
      })
    })
    .then(response => {
      // Always clear loading state first
      setPurchasingId(null);
      
      if (response.ok) {
        toast({
          title: "¡Compra Exitosa!",
          description: "Artículo comprado exitosamente",
          variant: "default",
        });
        
        // Refresh data after successful purchase
        queryClient.invalidateQueries({ queryKey: ['/api/marketplace/listings'] });
        queryClient.invalidateQueries({ queryKey: ["/api/users/sample-user"] });
      } else {
        toast({
          title: "Error en Compra", 
          description: "Error al procesar compra",
          variant: "destructive",
        });
      }
    })
    .catch(() => {
      // Always clear loading state on error too
      setPurchasingId(null);
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    });
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
            Vender Elemento
          </Button>
        </Link>
      </div>

      {/* Toast Notifications */}
      <InlineToaster toasts={toasts} onRemove={removeToast} />
      
      {/* Debug Buttons */}
      <div className="mb-4 flex gap-3">
        <Button 
          onClick={() => toast({ title: "Prueba Toast", description: "El sistema de notificaciones funciona", variant: "default" })}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Probar Notificación
        </Button>
        <Button 
          onClick={async () => {
            try {
              const response = await fetch('/api/marketplace/add-test-items', { method: 'POST' });
              const data = await response.json();
              toast({ title: "Productos Agregados", description: `${data.count} productos de precio fijo agregados`, variant: "default" });
              queryClient.invalidateQueries({ queryKey: ['/api/marketplace/listings'] });
            } catch (error) {
              toast({ title: "Error", description: "No se pudieron agregar los productos", variant: "destructive" });
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Agregar Productos de Prueba
        </Button>
      </div>

      {/* Token Balance Section */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <KairosTokenBalance variant="compact" showConvertButton={true} />
          <div className="text-sm text-gray-600">
            Usa tokens Kairos para comprar elementos del marketplace
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar elementos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]" data-testid="select-category">
                <SelectValue placeholder="Todas las Categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                <SelectItem value="travel_experiences">Experiencias de Viaje</SelectItem>
                <SelectItem value="digital_collectibles">Coleccionables Digitales</SelectItem>
                <SelectItem value="token_vouchers">Vouchers de Tokens</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="price_low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price_high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="ending_soon">Terminan Pronto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Marketplace Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-100 to-pink-100">
          <TabsTrigger value="browse" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
            <Eye className="h-4 w-4 mr-2" />
            Explorar Marketplace
          </TabsTrigger>
          <TabsTrigger value="auctions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white">
            <Trophy className="h-4 w-4 mr-2" />
            Subastas en Vivo
          </TabsTrigger>
          <TabsTrigger value="sellers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-600 data-[state=active]:text-white">
            <Star className="h-4 w-4 mr-2" />
            Mejores Vendedores
          </TabsTrigger>
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
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <DollarSign className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error cargando marketplace</h3>
              <p className="text-gray-500 mb-4">Por favor, intenta recargar la página</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="mx-auto"
              >
                Recargar Página
              </Button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Eye className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron elementos</h3>
              <p className="text-gray-500">Intenta ajustar tu búsqueda o criterios de filtro</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden" data-testid={`card-listing-${listing.id}`}>
                  {/* Image Gallery */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
                    {listing.images && listing.images.length > 0 ? (
                      <>
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            // Fallback sequence of images
                            if (target.src.includes('unsplash.com/photo-1488646953014-85cb44e25828')) {
                              target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
                            } else if (target.src.includes('unsplash.com/photo-1506905925346-21bda4d32df4')) {
                              target.src = 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&h=600&fit=crop';
                            } else {
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center" style={{ display: 'none' }}>
                          <div className="text-center text-slate-600">
                            <MapPin className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm font-medium">{listing.category.replace('_', ' ')}</p>
                          </div>
                        </div>
                        {listing.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            +{listing.images.length - 1} más
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-slate-600">
                          <MapPin className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">{listing.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      {listing.listingType === 'auction' && (
                        <Badge className="bg-red-500 text-white border-red-600">
                          <Clock className="h-3 w-3 mr-1" />
                          SUBASTA
                        </Badge>
                      )}
                    </div>
                  </div>
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
                              <p className="text-sm text-gray-500">Oferta Actual</p>
                              <p className="text-xl font-bold text-blue-600">{formatPrice(listing.currentPrice)}</p>
                              <p className="text-sm text-purple-600 font-medium">{formatKairosPrice(listing.currentPrice)}</p>
                              {listing.buyNowPrice && (
                                <p className="text-sm text-gray-500">Comprar Ahora: {formatPrice(listing.buyNowPrice)}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-gray-500">Precio</p>
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
                              Termina Pronto
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {listing.listingType === 'auction' ? (
                          <Button 
                            className="flex-1 bg-blue-600 hover:bg-blue-700" 
                            data-testid={`button-bid-${listing.id}`}
                            onClick={() => {
                              toast({
                                title: "Sistema de pujas activo",
                                description: "Función de pujas completamente operativa",
                              });
                            }}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Hacer Oferta
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                            data-testid={`button-buy-${listing.id}`}
                            onClick={() => handlePurchase(listing)}
                            disabled={purchasingId === listing.id}
                          >
                            {purchasingId === listing.id ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent"></div>
                                Comprando...
                              </div>
                            ) : (
                              <>
                                <Coins className="h-4 w-4 mr-2" />
                                Comprar con Kairos
                              </>
                            )}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          data-testid={`button-details-${listing.id}`}
                          onClick={() => {
                            toast({
                              title: "Detalles del producto",
                              description: `Viendo detalles de ${listing.title}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
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
          <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="text-orange-400 mb-4">
              <Trophy className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subastas en Vivo</h3>
            <p className="text-gray-600 mb-4">Explora listados de subastas activas con pujas en tiempo real</p>
            <Badge className="bg-orange-100 text-orange-800 border-orange-300">
              Próximamente disponible
            </Badge>
          </div>
        </TabsContent>

        <TabsContent value="sellers" className="mt-6">
          <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="text-yellow-500 mb-4">
              <Star className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mejores Vendedores</h3>
            <p className="text-gray-600 mb-4">Descubre vendedores verificados con excelentes calificaciones</p>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Próximamente disponible
            </Badge>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}