import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_USER_ID = "sample-user";

interface FavoriteHeartProps {
  itemType: "lottery" | "mission" | "marketplace_item" | "agency" | "tour";
  itemId: string;
  itemTitle: string;
  itemDescription?: string;
  itemMetadata?: Record<string, any>;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function FavoriteHeart({
  itemType,
  itemId,
  itemTitle,
  itemDescription = "",
  itemMetadata = {},
  size = "md",
  className
}: FavoriteHeartProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  // Check if item is favorited
  const { data: favorites = [] } = useQuery({
    queryKey: [`/api/users/${SAMPLE_USER_ID}/favorites`],
  });

  const isFavorited = favorites.some(
    (fav: any) => fav.itemType === itemType && fav.itemId === itemId
  );

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/users/${SAMPLE_USER_ID}/favorites`, {
        method: "POST",
        body: JSON.stringify({
          itemType,
          itemId,
          itemTitle,
          itemDescription,
          itemMetadata: JSON.stringify(itemMetadata)
        }),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${SAMPLE_USER_ID}/favorites`] });
      toast({
        title: "Added to Favorites",
        description: `${itemTitle} has been added to your favorites.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      const favorite = favorites.find(
        (fav: any) => fav.itemType === itemType && fav.itemId === itemId
      );
      if (!favorite) throw new Error("Favorite not found");

      await apiRequest(`/api/users/${SAMPLE_USER_ID}/favorites/${favorite.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${SAMPLE_USER_ID}/favorites`] });
      toast({
        title: "Removed from Favorites",
        description: `${itemTitle} has been removed from your favorites.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorited) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const sizeClasses = {
    sm: "h-3 w-3 sm:h-4 sm:w-4",
    md: "h-4 w-4 sm:h-5 sm:w-5", 
    lg: "h-5 w-5 sm:h-6 sm:w-6"
  };

  const isPending = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isPending}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "p-1 h-auto w-auto rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200",
        className
      )}
      data-testid={`favorite-heart-${itemType}-${itemId}`}
    >
      <Heart
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          isFavorited || isHovered
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 hover:text-red-400",
          isPending && "opacity-50"
        )}
      />
    </Button>
  );
}