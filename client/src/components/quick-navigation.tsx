import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, MapPin, Coins, Gift, Users, Star, Plane, Target, 
  Calendar, TrendingUp, ArrowRight 
} from "lucide-react";

export default function QuickNavigation() {
  const navItems = [
    {
      title: "🌍 Loterías de Viajes",
      description: "Gana viajes reales con boletos",
      href: "/lotteries",
      icon: Trophy,
      color: "from-orange-500 to-pink-500",
      hoverColor: "from-orange-600 to-pink-600"
    },
    {
      title: "🗺️ Explorar Destinos",
      description: "Descubre continentes y países",
      href: "/explore",
      icon: MapPin,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "from-blue-600 to-cyan-600"
    },
    {
      title: "🪙 Gestión de Tokens",
      description: "Compra y gestiona tus tokens",
      href: "/token-management",
      icon: Coins,
      color: "from-yellow-500 to-orange-500",
      hoverColor: "from-yellow-600 to-orange-600"
    },
    {
      title: "🏪 Marketplace",
      description: "Canjea tokens por premios",
      href: "/marketplace",
      icon: Gift,
      color: "from-green-500 to-teal-500",
      hoverColor: "from-green-600 to-teal-600"
    },
    {
      title: "🤝 Socios",
      description: "Agencias y afiliados",
      href: "/partners",
      icon: Users,
      color: "from-purple-500 to-indigo-500",
      hoverColor: "from-purple-600 to-indigo-600"
    },
    {
      title: "📚 Guía Principiante",
      description: "Aprende cómo usar la plataforma",
      href: "/beginner-guide",
      icon: Star,
      color: "from-pink-500 to-purple-500",
      hoverColor: "from-pink-600 to-purple-600"
    }
  ];

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">🚀 Navegación Rápida</h3>
          <p className="text-slate-600">Accede a todas las funciones de TravelLotto</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} href={item.href}>
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 bg-gradient-to-r ${item.color} hover:${item.hoverColor} text-white border-0 hover:scale-105 transition-all duration-200`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-xs opacity-90">{item.description}</div>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver Dashboard Completo
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}