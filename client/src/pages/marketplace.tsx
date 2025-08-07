import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type User, type Prize } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Coins, Target, ShoppingBag, 
  Search, Filter, Plane, Gift 
} from "lucide-react";
import MobileNavigation from "@/components/mobile-navigation";
import NavigationDropdown from "@/components/navigation-dropdown";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelector from "@/components/language-selector";
import TravelImageRenderer from "@/components/travel-image-renderer";
import { useLanguage } from "@/lib/i18n";

const SAMPLE_USER_ID = "sample-user";

export default function Marketplace() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  const { data: prizes = [], isLoading } = useQuery<Prize[]>({
    queryKey: ["/api/prizes"],
  });

  const filteredItems = prizes.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = async (prize: Prize) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (!user || (user.kairosTokens || 0) < prize.tokensRequired) {
        toast({
          title: "Insuficientes tokens",
          description: "No tienes suficientes tokens Kairos para esta compra",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      if (prize.availability <= 0) {
        toast({
          title: "Producto agotado",
          description: "Este producto no está disponible actualmente",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      const response = await fetch("/api/prize-redemptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: SAMPLE_USER_ID,
          prizeId: prize.id,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const redemption = await response.json();
        
        // Update user tokens immediately
        if (user) {
          const updatedUser = {
            ...user,
            kairosTokens: Math.max(0, (user.kairosTokens || 0) - prize.tokensRequired)
          };
          queryClient.setQueryData(["/api/users", SAMPLE_USER_ID], updatedUser);
        }
        
        toast({
          title: "¡Compra exitosa!",
          description: `Código de canje: ${redemption.redemptionCode}`,
        });
        
        // Refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/prizes"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users", SAMPLE_USER_ID] });
        
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la compra");
      }
    } catch (error: any) {
      toast({
        title: "Error en la compra",
        description: error?.message || "No se pudo completar la compra. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
                <Button variant="ghost" data-testid="nav-tokens">Token Management</Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="ghost" className="text-blue-600 font-medium" data-testid="nav-marketplace">
                  Marketplace
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" data-testid="nav-profile">Profile</Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <NavigationDropdown currentPath="/marketplace" />
              <LanguageSelector />
              <ProfileDropdown />
              <MobileNavigation currentPath="/marketplace" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛍️ Travel Marketplace
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre experiencias de viaje increíbles, servicios y productos. Usa tus tokens Kairos para desbloquear ofertas exclusivas de todo el mundo.
          </p>
        </div>

        {/* Token Balance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Kairos</p>
                  <p className="text-xl font-bold text-purple-600">{user?.kairosTokens || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Coins className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Viator Tokens</p>
                  <p className="text-xl font-bold text-yellow-600">{user?.viatorTokens || "0.00"}</p>
                </div>
              </div>
            </div>
            
            <Link href="/token-management">
              <Button className="ml-6" data-testid="buy-more-tokens">
                <Coins className="h-4 w-4 mr-2" />
                Buy More Tokens
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar experiencias, servicios y productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["all", "experience", "travel_package", "product", "discount"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`filter-${category}`}
              >
                <Filter className="h-3 w-3 mr-1" />
                {category === "all" ? "Todos" :
                 category === "experience" ? "Experiencias" :
                 category === "travel_package" ? "Paquetes" :
                 category === "product" ? "Productos" : "Descuentos"}
              </Button>
            ))}
          </div>
        </div>

        {/* Real Marketplace Items from API */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((prize) => (
              <Card key={prize.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <TravelImageRenderer 
                    type="marketplace" 
                    theme={prize.category === 'experience' ? 'experiences' : 
                           prize.category === 'travel_package' ? 'packages' :
                           prize.category === 'discount' ? 'wellness' : 'gear'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-golden-luck text-white">
                    {prize.availability} left
                  </Badge>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{prize.title}</h3>
                    <p className="text-sm">{prize.destination || prize.provider}</p>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{prize.title}</span>
                    <span className="text-ocean-pulse text-sm font-bold whitespace-nowrap ml-2">
                      {prize.tokensRequired} Kairos
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {prize.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      Valor: ${(prize.value / 100).toFixed(2)} USD
                    </span>
                    <Badge variant={prize.availability > 5 ? "default" : "destructive"}>
                      {prize.availability > 5 ? "Available" : "Limited"}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full" 
                    data-testid={`buy-prize-${prize.id}`}
                    onClick={() => handlePurchase(prize)}
                    disabled={isProcessing || prize.availability <= 0 || (user?.kairosTokens || 0) < prize.tokensRequired}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {prize.availability <= 0 ? "Agotado" : 
                     (user?.kairosTokens || 0) < prize.tokensRequired ? "Insuficientes tokens" :
                     isProcessing ? "Procesando..." : "Comprar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "all" ? 
                "Intenta ajustar tu búsqueda o filtros para encontrar experiencias increíbles." :
                "No hay productos disponibles en el marketplace actualmente."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
                Limpiar Filtros
              </Button>
            )}
          </div>
        )}

        {/* Featured Travel Packages */}
        {filteredItems.filter(prize => prize.category === 'travel_package').length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paquetes de Viaje Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems
                .filter(prize => prize.category === 'travel_package')
                .slice(0, 2)
                .map((prize) => (
                <Card key={`featured-${prize.id}`} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-64">
                    <TravelImageRenderer 
                      type="marketplace"
                      theme="packages"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <Badge className="absolute top-4 right-4 bg-golden-luck text-white">
                      Premium
                    </Badge>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{prize.title}</h3>
                      <p className="text-sm">{prize.destination}</p>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{prize.title}</span>
                      <span className="text-golden-luck">{prize.tokensRequired} Kairos</span>
                    </CardTitle>
                    <CardDescription>
                      {prize.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      className="w-full" 
                      data-testid={`buy-featured-${prize.id}`}
                      onClick={() => handlePurchase(prize)}
                      disabled={isProcessing || prize.availability <= 0 || (user?.kairosTokens || 0) < prize.tokensRequired}
                    >
                      <Plane className="h-4 w-4 mr-2" />
                      {prize.availability <= 0 ? "Agotado" : 
                       (user?.kairosTokens || 0) < prize.tokensRequired ? "Insuficientes tokens" :
                       isProcessing ? "Procesando..." : "Reservar Experiencia"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}