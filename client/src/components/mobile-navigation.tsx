import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { 
  Menu, 
  Home, 
  Gamepad2, 
  ShoppingBag, 
  User, 
  Trophy, 
  Users,
  MapPin,
  Fingerprint,
  Globe,
  X,
  Coins
} from "lucide-react";

interface NavigationItem {
  href: string;
  labelKey: keyof import("@/lib/i18n").Translations;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: Home },
  { href: "/lotteries", labelKey: "lotteries", icon: Gamepad2 },
  { href: "/marketplace", labelKey: "marketplace", icon: ShoppingBag },
  { href: "/missions", labelKey: "missions", icon: MapPin },
  { href: "/token-management", labelKey: "tokenManagement", icon: Coins, badge: "Viator" },
  { href: "/profile", labelKey: "profile", icon: User },
  { href: "/winner-dashboard", labelKey: "myPrizes", icon: Trophy },
  { href: "/affiliate-dashboard", labelKey: "affiliateProgram", icon: Users, badge: "New" },
  { href: "/country-operations", labelKey: "countryOperations", icon: Globe, badge: "Expansion" },
  { href: "/unique-ids", labelKey: "uniqueIds", icon: Fingerprint },
];

interface MobileNavigationProps {
  currentPath?: string;
}

export default function MobileNavigation({ currentPath }: MobileNavigationProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const current = currentPath || location;

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" data-testid="mobile-menu-trigger">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80 max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl font-bold text-explore-blue">
                🌟 VoyageLotto
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMenu}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <nav className="mt-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = current === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 ${
                      isActive ? "bg-blue-50 text-explore-blue" : ""
                    }`}
                    onClick={closeMenu}
                    data-testid={`mobile-nav-${item.href.replace("/", "")}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{t(item.labelKey)}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile User Stats */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Tokens</span>
                <span className="font-medium">1,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Level</span>
                <span className="font-medium">Adventure Explorer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Missions</span>
                <span className="font-medium">12 completed</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}