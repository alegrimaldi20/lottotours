import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Globe, Users, Building2, MapPin, TrendingUp, Award,
  DollarSign, Target, Zap, Filter, Search, MoreVertical,
  ArrowUpRight, ArrowDownRight, Crown, Star, Trophy,
  Map, BarChart3, PieChart, Activity, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for country operations
const sampleCountries = [
  {
    countryCode: "US",
    countryName: "United States",
    region: "North America",
    currency: "USD",
    totalAgencies: 342,
    targetAgencies: 360,
    activeAgencies: 298,
    marketPenetration: 0.95,
    totalRevenue: 12450000, // $124,500
    monthlyGrowth: 0.12,
    averageCommissionRate: 0.18,
    flag: "🇺🇸",
    status: "active"
  },
  {
    countryCode: "CA",
    countryName: "Canada", 
    region: "North America",
    currency: "CAD",
    totalAgencies: 287,
    targetAgencies: 360,
    activeAgencies: 245,
    marketPenetration: 0.80,
    totalRevenue: 8920000, // $89,200
    monthlyGrowth: 0.15,
    averageCommissionRate: 0.16,
    flag: "🇨🇦",
    status: "active"
  },
  {
    countryCode: "MX",
    countryName: "Mexico",
    region: "North America", 
    currency: "MXN",
    totalAgencies: 198,
    targetAgencies: 360,
    activeAgencies: 156,
    marketPenetration: 0.55,
    totalRevenue: 4350000, // $43,500
    monthlyGrowth: 0.22,
    averageCommissionRate: 0.20,
    flag: "🇲🇽",
    status: "expanding"
  },
  {
    countryCode: "DE",
    countryName: "Germany",
    region: "Europe",
    currency: "EUR",
    totalAgencies: 356,
    targetAgencies: 360,
    activeAgencies: 334,
    marketPenetration: 0.99,
    totalRevenue: 15670000, // $156,700
    monthlyGrowth: 0.08,
    averageCommissionRate: 0.17,
    flag: "🇩🇪",
    status: "active"
  },
  {
    countryCode: "FR",
    countryName: "France",
    region: "Europe",
    currency: "EUR", 
    totalAgencies: 301,
    targetAgencies: 360,
    activeAgencies: 289,
    marketPenetration: 0.84,
    totalRevenue: 11230000, // $112,300
    monthlyGrowth: 0.11,
    averageCommissionRate: 0.16,
    flag: "🇫🇷",
    status: "active"
  },
  {
    countryCode: "JP",
    countryName: "Japan",
    region: "Asia",
    currency: "JPY",
    totalAgencies: 124,
    targetAgencies: 360,
    activeAgencies: 98,
    marketPenetration: 0.34,
    totalRevenue: 6780000, // $67,800
    monthlyGrowth: 0.28,
    averageCommissionRate: 0.19,
    flag: "🇯🇵",
    status: "launching"
  }
];

const sampleTerritories = [
  {
    id: "US-T001",
    territoryCode: "T001",
    territoryName: "New York Metro",
    countryCode: "US",
    region: "New York",
    majorCities: ["New York City", "Brooklyn", "Queens", "Manhattan"],
    targetAgencies: 15,
    assignedAgencies: 12,
    currentLoad: 234,
    maxCapacity: 400,
    marketTier: "tier1",
    tourismScore: 4.8,
    competitiveness: "high"
  },
  {
    id: "US-T002", 
    territoryCode: "T002",
    territoryName: "Los Angeles Metro",
    countryCode: "US",
    region: "California",
    majorCities: ["Los Angeles", "Beverly Hills", "Santa Monica", "Hollywood"],
    targetAgencies: 14,
    assignedAgencies: 11,
    currentLoad: 198,
    maxCapacity: 380,
    marketTier: "tier1",
    tourismScore: 4.6,
    competitiveness: "high"
  },
  {
    id: "US-T015",
    territoryCode: "T015",
    territoryName: "Austin Region",
    countryCode: "US", 
    region: "Texas",
    majorCities: ["Austin", "Round Rock", "Cedar Park"],
    targetAgencies: 8,
    assignedAgencies: 6,
    currentLoad: 89,
    maxCapacity: 200,
    marketTier: "tier2",
    tourismScore: 3.9,
    competitiveness: "medium"
  }
];

export default function CountryOperations() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Mock queries
  const { data: countries = sampleCountries } = useQuery({
    queryKey: ['/api/country-operations'],
    enabled: true
  });

  const { data: territories = sampleTerritories } = useQuery({
    queryKey: ['/api/territories', selectedCountry],
    enabled: !!selectedCountry
  });

  const filteredCountries = countries.filter(country => {
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
    const matchesSearch = country.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.countryCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expanding': return 'bg-blue-100 text-blue-800';
      case 'launching': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'tier1': return { label: 'Tier 1', color: 'bg-purple-100 text-purple-800', icon: <Crown className="h-3 w-3" /> };
      case 'tier2': return { label: 'Tier 2', color: 'bg-blue-100 text-blue-800', icon: <Star className="h-3 w-3" /> };
      case 'tier3': return { label: 'Tier 3', color: 'bg-green-100 text-green-800', icon: <Target className="h-3 w-3" /> };
      default: return { label: 'Standard', color: 'bg-gray-100 text-gray-800', icon: <Building2 className="h-3 w-3" /> };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors mr-4">
                ← Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900">Global Operations</h1>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <Activity className="mr-1 h-4 w-4" />
              360 Agencies Per Country Strategy
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Countries</p>
                  <p className="text-2xl font-bold">{countries.length}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Agencies</p>
                  <p className="text-2xl font-bold">{countries.reduce((sum, c) => sum + c.totalAgencies, 0).toLocaleString()}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Global Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(countries.reduce((sum, c) => sum + c.totalRevenue, 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Growth</p>
                  <p className="text-2xl font-bold">
                    {((countries.reduce((sum, c) => sum + c.monthlyGrowth, 0) / countries.length) * 100).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="South America">South America</SelectItem>
                  <SelectItem value="Africa">Africa</SelectItem>
                  <SelectItem value="Oceania">Oceania</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="countries" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="countries">Country Overview</TabsTrigger>
            <TabsTrigger value="territories">Territory Management</TabsTrigger>
            <TabsTrigger value="analytics">Global Analytics</TabsTrigger>
          </TabsList>

          {/* Countries Tab */}
          <TabsContent value="countries" className="space-y-6">
            <div className="grid gap-6">
              {filteredCountries.map((country) => (
                <Card key={country.countryCode} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{country.flag}</div>
                        <div>
                          <h3 className="text-xl font-bold">{country.countryName}</h3>
                          <p className="text-slate-500">{country.region} • {country.currency}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(country.status)}>
                          {country.status.charAt(0).toUpperCase() + country.status.slice(1)}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCountry(country.countryCode)}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          View Territories
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-6 gap-6">
                      <div className="md:col-span-2">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Agency Progress</span>
                              <span className="text-sm text-slate-500">
                                {country.totalAgencies}/{country.targetAgencies}
                              </span>
                            </div>
                            <Progress value={(country.totalAgencies / country.targetAgencies) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Market Penetration</span>
                              <span className="text-sm font-semibold text-blue-600">
                                {(country.marketPenetration * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={country.marketPenetration * 100} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{country.activeAgencies}</p>
                            <p className="text-xs text-slate-500">Active Agencies</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(country.totalRevenue)}
                            </p>
                            <p className="text-xs text-slate-500">Monthly Revenue</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">
                              {(country.monthlyGrowth * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-500">Growth Rate</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">
                              {(country.averageCommissionRate * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-500">Avg Commission</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Territories Tab */}
          <TabsContent value="territories" className="space-y-6">
            {selectedCountry ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Territory Management - {countries.find(c => c.countryCode === selectedCountry)?.countryName}
                  </h2>
                  <Button onClick={() => setSelectedCountry(null)} variant="outline">
                    Back to Countries
                  </Button>
                </div>
                <div className="grid gap-4">
                  {territories.map((territory) => {
                    const tierInfo = getTierBadge(territory.marketTier);
                    return (
                      <Card key={territory.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{territory.territoryName}</h3>
                              <p className="text-slate-500">
                                {territory.territoryCode} • {territory.majorCities.join(", ")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={tierInfo.color}>
                                {tierInfo.icon}
                                <span className="ml-1">{tierInfo.label}</span>
                              </Badge>
                              <Badge variant="outline">
                                {territory.competitiveness} competition
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-4 gap-6">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Agency Coverage</span>
                                <span className="text-sm text-slate-500">
                                  {territory.assignedAgencies}/{territory.targetAgencies}
                                </span>
                              </div>
                              <Progress value={(territory.assignedAgencies / territory.targetAgencies) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Capacity Usage</span>
                                <span className="text-sm text-slate-500">
                                  {territory.currentLoad}/{territory.maxCapacity}
                                </span>
                              </div>
                              <Progress value={(territory.currentLoad / territory.maxCapacity) * 100} className="h-2" />
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{territory.tourismScore}</p>
                              <p className="text-xs text-slate-500">Tourism Score</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold">{territory.region}</p>
                              <p className="text-xs text-slate-500">Region</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Map className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Country</h3>
                  <p className="text-slate-500 mb-6">
                    Choose a country from the Country Overview tab to view its territory management details
                  </p>
                  <Button onClick={() => setSelectedCountry("US")} className="mr-2">
                    View US Territories
                  </Button>
                  <Button onClick={() => setSelectedCountry("DE")} variant="outline">
                    View Germany Territories
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Revenue by Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["North America", "Europe", "Asia"].map((region, index) => {
                      const regionRevenue = countries
                        .filter(c => c.region === region)
                        .reduce((sum, c) => sum + c.totalRevenue, 0);
                      const totalRevenue = countries.reduce((sum, c) => sum + c.totalRevenue, 0);
                      const percentage = (regionRevenue / totalRevenue) * 100;
                      
                      return (
                        <div key={region} className="flex items-center justify-between">
                          <span className="font-medium">{region}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32">
                              <Progress value={percentage} className="h-2" />
                            </div>
                            <span className="text-sm font-semibold min-w-[60px]">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Growth Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {countries.slice(0, 5).map((country) => (
                      <div key={country.countryCode} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{country.flag}</span>
                          <span className="font-medium">{country.countryName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress value={country.monthlyGrowth * 100} className="h-2" />
                          </div>
                          <span className="text-sm font-semibold min-w-[50px]">
                            {(country.monthlyGrowth * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}