import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Coins, Target, Zap, ShoppingBag, Star, Gift, 
  Search, Filter, Plane, MapPin, Trophy 
} from "lucide-react";
import MobileNavigation from "@/components/mobile-navigation";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/lib/i18n";

const SAMPLE_USER_ID = "sample-user";

// Mock marketplace items for demonstration
const marketplaceItems = [
  {
    id: "item-1",
    name: "Tokyo Gourmet Experience",
    description: "Exclusive access to hidden local restaurants and food tours",
    price: 150,
    currency: "Kairos",
    category: "experiences",
    image: "🍣",
    rarity: "rare",
    availability: 25
  },
  {
    id: "item-2", 
    name: "Bali Wellness Retreat Voucher",
    description: "3-day spa and meditation retreat in beautiful Bali",
    price: 200,
    currency: "Kairos", 
    category: "wellness",
    image: "🌺",
    rarity: "epic",
    availability: 10
  },
  {
    id: "item-3",
    name: "Patagonia Adventure Kit",
    description: "Professional hiking gear and camping equipment rental",
    price: 75,
    currency: "Kairos",
    category: "gear",
    image: "🎒",
    rarity: "common",
    availability: 50
  },
  {
    id: "item-4",
    name: "Morocco Cultural Guide Service", 
    description: "Personal guide for authentic Moroccan cultural experiences",
    price: 100,
    currency: "Kairos",
    category: "services",
    image: "🏺",
    rarity: "rare",
    availability: 15
  },
  {
    id: "item-5",
    name: "Premium Travel Photography Session",
    description: "Professional photographer for your travel memories",
    price: 120,
    currency: "Kairos", 
    category: "services",
    image: "📸",
    rarity: "rare",
    availability: 20
  }
];

export default function Marketplace() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", SAMPLE_USER_ID],
  });

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-600 border-yellow-200 bg-yellow-50";
      case "epic": return "text-purple-600 border-purple-200 bg-purple-50";
      case "rare": return "text-blue-600 border-blue-200 bg-blue-50";
      default: return "text-gray-600 border-gray-200 bg-gray-50";
    }
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
                <Button variant="ghost" className="text-blue-600 font-medium" data-testid="nav-marketplace">
                  Marketplace
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" data-testid="nav-profile">Profile</Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
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
            Discover amazing travel experiences, services, and gear. Use your Kairos tokens to unlock exclusive offerings from around the world.
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
                placeholder="Search experiences, services, and gear..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["all", "experiences", "wellness", "gear", "services"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`filter-${category}`}
              >
                <Filter className="h-3 w-3 mr-1" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Marketplace Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${getRarityColor(item.rarity)} border-2`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{item.image}</div>
                    <div>
                      <CardTitle className="text-lg">
                        {item.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3 text-gray-700">
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Price and Availability */}
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-bold text-purple-600 text-xl">
                      {item.price} Kairos
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">Available</div>
                    <div className="text-sm font-bold text-green-600">{item.availability} left</div>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button 
                  className="w-full" 
                  disabled={(user?.kairosTokens || 0) < item.price || item.availability === 0}
                  data-testid={`purchase-${item.id}`}
                >
                  {(user?.kairosTokens || 0) < item.price ? (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      Need More Kairos
                    </>
                  ) : item.availability === 0 ? (
                    "Sold Out"
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Purchase Now
                    </>
                  )}
                </Button>

                {/* Item Details */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium capitalize">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rarity:</span>
                    <span className="font-medium capitalize">{item.rarity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria to find amazing travel experiences.
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}