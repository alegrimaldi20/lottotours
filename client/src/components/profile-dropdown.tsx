import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Crown,
  Coins
} from "lucide-react";
import LanguageSelector from "./language-selector";
import type { User as UserType } from "@shared/schema";

interface ProfileDropdownProps {
  user?: UserType;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { t } = useLanguage();

  const handleLogout = () => {
    // Implementation for logout
    window.location.href = '/api/logout';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full"
          data-testid="profile-dropdown-trigger"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || undefined} alt={user?.username || 'User'} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {user?.level && user.level > 1 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {user.level}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar || undefined} alt={user?.username || 'User'} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium text-sm">{user?.username || 'Explorer'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Coins className="h-3 w-3" />
                <span>{user?.tokens || 0} tokens</span>
              </div>
              {user?.level && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Crown className="h-3 w-3" />
                  <span>{t('level')} {user.level}</span>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer" data-testid="profile-menu-profile">
            <User className="mr-2 h-4 w-4" />
            <span>{t('viewProfile')}</span>
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuItem className="cursor-pointer" data-testid="profile-menu-settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Language Selector in Dropdown */}
        <div className="px-2 py-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('language')}</span>
            <LanguageSelector variant="ghost" size="sm" />
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" data-testid="profile-menu-help">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>{t('help')}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600" 
          onClick={handleLogout}
          data-testid="profile-menu-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}