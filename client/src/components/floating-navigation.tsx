import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, X, Home, Trophy, MapPin, Coins, Gift, Users, 
  Star, Plane, Target, Calendar, TrendingUp, Compass,
  BookOpen, Settings, User
} from "lucide-react";

export default function FloatingNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationSections = [
    {
      title: "Principal",
      items: [
        { label: "Inicio", href: "/", icon: Home, color: "text-blue-600" },
        { label: "Dashboard", href: "/dashboard", icon: TrendingUp, color: "text-green-600" },
        { label: "Perfil", href: "/profile", icon: User, color: "text-purple-600" }
      ]
    },
    {
      title: "Loterías & Juegos",
      items: [
        { label: "🌍 Loterías de Viajes", href: "/lotteries", icon: Trophy, color: "text-orange-600", featured: true },
        { label: "Historial Boletos", href: "/ticket-history", icon: Calendar, color: "text-pink-600" }
      ]
    },
    {
      title: "Exploración",
      items: [
        { label: "Explorar Destinos", href: "/explore", icon: MapPin, color: "text-cyan-600" },
        { label: "Guía Principiante", href: "/beginner-guide", icon: BookOpen, color: "text-indigo-600" },
        { label: "Misiones", href: "/missions", icon: Target, color: "text-emerald-600" }
      ]
    },
    {
      title: "Tokens & Marketplace",
      items: [
        { label: "Gestión de Tokens", href: "/token-management", icon: Coins, color: "text-yellow-600" },
        { label: "Marketplace", href: "/marketplace", icon: Gift, color: "text-red-600" }
      ]
    },
    {
      title: "Comunidad",
      items: [
        { label: "Socios", href: "/partners", icon: Users, color: "text-slate-600" },
        { label: "Dashboard Afiliados", href: "/affiliate-dashboard", icon: Star, color: "text-amber-600" }
      ]
    }
  ];

  const toggleNavigation = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={toggleNavigation}
          size="lg"
          className={`
            rounded-full shadow-2xl transition-all duration-300 hover:scale-110
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }
          `}
          data-testid="floating-nav-toggle"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Compass className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Navigation Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={toggleNavigation}>
          <div className="fixed bottom-24 left-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <Card className="shadow-2xl border-2 border-blue-200 bg-white/95 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                    <Compass className="h-5 w-5 text-blue-600" />
                    Navegación TravelLotto
                  </h3>
                  <p className="text-sm text-slate-600">Accede a cualquier sección</p>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {navigationSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2 px-2">
                        {section.title}
                      </h4>
                      <div className="space-y-1">
                        {section.items.map((item, itemIndex) => {
                          const Icon = item.icon;
                          return (
                            <Link key={itemIndex} href={item.href}>
                              <Button
                                variant="ghost"
                                className={`
                                  w-full justify-start gap-3 h-auto p-3 hover:bg-slate-100
                                  ${item.featured ? 'bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200' : ''}
                                `}
                                onClick={toggleNavigation}
                                data-testid={`nav-${item.href.replace('/', '')}`}
                              >
                                <Icon className={`h-4 w-4 ${item.color}`} />
                                <div className="flex-1 text-left">
                                  <div className={`text-sm ${item.featured ? 'font-semibold text-orange-700' : 'font-medium'}`}>
                                    {item.label}
                                  </div>
                                </div>
                                {item.featured && (
                                  <Badge className="bg-orange-500 text-white text-xs">
                                    HOT
                                  </Badge>
                                )}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-2">¿Necesitas ayuda?</p>
                    <Link href="/beginner-guide">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={toggleNavigation}
                      >
                        <BookOpen className="mr-2 h-3 w-3" />
                        Ver Guía
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}