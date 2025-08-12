import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Coins, 
  Clock, 
  ArrowLeft, 
  Star,
  MapPin,
  Calendar,
  Users,
  Target,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

interface Lottery {
  id: string;
  title: string;
  description: string;
  ticketPrice: number;
  prizeValue: number;
  drawDate: string;
  lotteryCode: string;
}

export default function LotteriesPlatform() {
  const { data: lotteries = [], isLoading } = useQuery<Lottery[]>({
    queryKey: ["/api/lotteries"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-explore-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h2 className="text-xl font-semibold text-slate-700">Loading Travel Lotteries...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Travel Lotteries
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enter exciting travel lotteries and win amazing experiences around the world
            </p>
            <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
              {lotteries.length} Active Draws
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Lotteries</p>
                  <p className="text-3xl font-bold text-explore-blue">{lotteries.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-golden-luck" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Prize Pool</p>
                  <p className="text-3xl font-bold text-golden-luck">
                    ${lotteries.reduce((sum, l) => sum + l.prizeValue, 0).toLocaleString()}
                  </p>
                </div>
                <Coins className="h-8 w-8 text-golden-luck" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Next Draw</p>
                  <p className="text-3xl font-bold text-ocean-pulse">Today</p>
                </div>
                <Clock className="h-8 w-8 text-ocean-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lotteries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lotteries.map((lottery, index) => (
            <Card 
              key={lottery.id} 
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-golden-luck/30"
              data-testid={`lottery-card-${lottery.id}`}
            >
              {/* Featured badge for first lottery */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-golden-luck to-orange-400 text-white font-bold">
                    Featured
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {lottery.lotteryCode}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-golden-luck" />
                    <Star className="h-3 w-3 text-golden-luck fill-current" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-explore-blue transition-colors">
                  {lottery.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lottery.description}
                </p>
                
                {/* Prize Value Highlight */}
                <div className="bg-gradient-to-r from-golden-luck/10 to-orange-400/10 rounded-lg p-4 border border-golden-luck/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Grand Prize</span>
                    <Trophy className="h-4 w-4 text-golden-luck" />
                  </div>
                  <div className="text-2xl font-bold text-golden-luck mt-1">
                    ${lottery.prizeValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Travel Experience Package</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Coins className="h-4 w-4 text-ocean-pulse" />
                      Entry Cost:
                    </span>
                    <Badge variant="secondary" className="bg-ocean-pulse/10 text-ocean-pulse border-ocean-pulse/20">
                      {lottery.ticketPrice} Kairos
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-travel-mint" />
                      Draw Date:
                    </span>
                    <span className="text-sm font-mono bg-travel-mint/10 text-travel-mint px-2 py-1 rounded-md border border-travel-mint/20">
                      {lottery.drawDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-explore-blue" />
                      Participants:
                    </span>
                    <span className="text-sm text-explore-blue font-semibold">
                      {Math.floor(Math.random() * 100) + 50} players
                    </span>
                  </div>
                </div>

                {/* Progress bar for time remaining */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Time Remaining</span>
                    <span className="text-explore-blue font-medium">2 days</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <Link href={`/lottery/${lottery.id}`}>
                  <Button 
                    className="w-full bg-gradient-to-r from-explore-blue to-ocean-pulse hover:from-explore-blue/90 hover:to-ocean-pulse/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105" 
                    data-testid={`enter-lottery-${lottery.id}`}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Enter Lottery
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No lotteries state */}
        {lotteries.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="mb-8">
              <Trophy className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-700 mb-4">No Active Lotteries</h3>
              <p className="text-slate-500 text-lg">Check back soon for exciting new travel lottery opportunities!</p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-explore-blue hover:bg-explore-blue/90">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Additional Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-explore-blue" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-explore-blue rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Choose Your Lottery</p>
                  <p className="text-sm text-slate-600">Select from available travel experiences</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-ocean-pulse rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Purchase Kairos Tokens</p>
                  <p className="text-sm text-slate-600">Use Kairos tokens to enter lotteries</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-golden-luck rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Win & Travel</p>
                  <p className="text-sm text-slate-600">Winners receive full travel packages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-golden-luck" />
                Why Choose Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span className="text-sm">Verified authentic travel experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span className="text-sm">Blockchain-verified fair draws</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span className="text-sm">24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">✓</Badge>
                <span className="text-sm">Instant prize notifications</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}