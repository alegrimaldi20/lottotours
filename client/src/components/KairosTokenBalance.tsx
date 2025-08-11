import { useQuery } from "@tanstack/react-query";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

interface KairosTokenBalanceProps {
  showConvertButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'detailed';
}

export function KairosTokenBalance({ 
  showConvertButton = false, 
  size = 'md',
  variant = 'compact' 
}: KairosTokenBalanceProps) {
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/users/sample-user"],
  });

  const handleConvertTokens = () => {
    setLocation('/token-management');
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-gray-200 rounded-full h-6 w-16"></div>
      </div>
    );
  }

  const kairosBalance = user?.kairosTokens || 0;
  const raivanBalance = user?.raivanTokens || 0;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          className={`bg-gradient-to-r from-lottery-purple to-lottery-pink text-white font-semibold ${sizeClasses[size]} flex items-center gap-1`}
        >
          <Coins className={iconSizes[size]} />
          {kairosBalance} Kairos
        </Badge>
        {showConvertButton && raivanBalance >= 18 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleConvertTokens}
            className="text-xs"
          >
            Convertir
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-lottery-purple" />
          <span className="font-semibold text-gray-900">Tokens Disponibles</span>
        </div>
        {showConvertButton && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleConvertTokens}
            className="text-xs"
          >
            Gestionar
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Badge 
          className="bg-gradient-to-r from-lottery-purple to-lottery-pink text-white font-semibold px-3 py-2 flex items-center justify-center gap-1"
        >
          <Coins className="h-4 w-4" />
          {kairosBalance} Kairos
        </Badge>
        
        <Badge 
          variant="outline"
          className="border-lottery-gold text-lottery-gold font-semibold px-3 py-2 flex items-center justify-center gap-1"
        >
          <Coins className="h-4 w-4" />
          {raivanBalance} Raivan
        </Badge>
      </div>
      
      {raivanBalance >= 18 && (
        <div className="text-xs text-gray-600 text-center">
          Puedes convertir {Math.floor(raivanBalance / 18)} Kairos más
        </div>
      )}
    </div>
  );
}