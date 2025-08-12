import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Ticket, Star, MapPin, ArrowRight } from "lucide-react";

interface LotteryNavigationWidgetProps {
  showInDashboard?: boolean;
}

export default function LotteryNavigationWidget({ showInDashboard = false }: LotteryNavigationWidgetProps) {
  const quickStats = [
    { label: "Loterías Activas", value: "4", icon: Trophy },
    { label: "Total Premios", value: "$50K+", icon: Star },
    { label: "Próximo Sorteo", value: "2 días", icon: Ticket },
  ];

  const featuredLotteries = [
    {
      id: "bali",
      title: "Bali Cultural",
      code: "LT2025-103",
      prize: "$8,500",
      emoji: "🏝️"
    },
    {
      id: "patagonia", 
      title: "Patagonia Adventure",
      code: "LT2025-102",
      prize: "$12,000",
      emoji: "🏔️"
    },
    {
      id: "morocco",
      title: "Morocco Magic",
      code: "LT2025-101", 
      prize: "$9,800",
      emoji: "🐪"
    }
  ];

  if (showInDashboard) {
    return (
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Trophy className="h-5 w-5" />
            🌍 Loterías de Viajes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                  <div className="text-lg font-bold text-orange-700">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-2 mb-4">
            {featuredLotteries.map((lottery) => (
              <div key={lottery.id} className="flex items-center justify-between p-2 bg-white/70 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lottery.emoji}</span>
                  <div>
                    <div className="font-medium text-sm">{lottery.title}</div>
                    <div className="text-xs text-muted-foreground">{lottery.code}</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                  {lottery.prize}
                </Badge>
              </div>
            ))}
          </div>

          <Link href="/lotteries">
            <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              <Ticket className="mr-2 h-4 w-4" />
              Entrar a Loterías
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/lotteries">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-2xl animate-pulse"
        >
          <Trophy className="mr-2 h-5 w-5" />
          Loterías 🎯
        </Button>
      </Link>
    </div>
  );
}