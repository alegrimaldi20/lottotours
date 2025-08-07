import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
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
  Coins,
  ChevronDown
} from "lucide-react";

interface NavigationItem {
  href: string;
  labelKey: keyof import("@/lib/i18n").Translations;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: Home, description: "Main Dashboard" },
  { href: "/lotteries", labelKey: "lotteries", icon: Gamepad2, description: "Travel Lotteries" },
  { href: "/marketplace", labelKey: "marketplace", icon: ShoppingBag, description: "Token Marketplace" },
  { href: "/missions", labelKey: "missions", icon: MapPin, description: "Travel Missions" },
  { href: "/token-management", labelKey: "tokenManagement", icon: Coins, badge: "Viator", description: "Token Management" },
  { href: "/profile", labelKey: "profile", icon: User, description: "User Profile" },
  { href: "/winner-dashboard", labelKey: "myPrizes", icon: Trophy, description: "My Prizes" },
  { href: "/affiliate-dashboard", labelKey: "affiliateProgram", icon: Users, badge: "New", description: "Affiliate Program" },
  { href: "/country-operations", labelKey: "countryOperations", icon: Globe, badge: "Expansion", description: "Country Operations" },
  { href: "/unique-ids", labelKey: "uniqueIds", icon: Fingerprint, description: "Unique IDs" },
];

interface NavigationDropdownProps {
  currentPath?: string;
}

export default function NavigationDropdown({ currentPath }: NavigationDropdownProps) {
  const [location] = useLocation();
  const { t } = useLanguage();
  const current = currentPath || location;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-explore-blue text-explore-blue hover:bg-explore-blue hover:text-white"
          data-testid="navigation-dropdown-trigger"
        >
          <Menu className="h-4 w-4" />
          <span>Navigation</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start" forceMount>
        <DropdownMenuLabel className="text-explore-blue font-semibold">
          🌟 VoyageLotto Navigation
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <DropdownMenuItem 
                className={`flex items-center gap-3 p-3 cursor-pointer ${
                  isActive ? 'bg-explore-blue/10 text-explore-blue' : ''
                }`}
                data-testid={`nav-dropdown-${item.href.replace('/', '')}`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-explore-blue' : 'text-muted-foreground'}`} />
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t(item.labelKey)}</span>
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "default" : "secondary"} 
                        className="text-xs px-1.5 py-0.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            </Link>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}