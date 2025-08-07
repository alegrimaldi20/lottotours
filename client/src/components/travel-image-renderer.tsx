import React from 'react';
import { DestinationImageRenderer, DestinationImages } from './destination-images';

interface TravelImageProps {
  type: string;
  theme?: string;
  className?: string;
  fallbackEmoji?: string;
}

export const TravelImageRenderer: React.FC<TravelImageProps> = ({ 
  type, 
  theme, 
  className = "w-full h-full",
  fallbackEmoji = "🌟"
}) => {
  // Map themes and types to actual destination image types
  const getDestinationType = (type: string, theme?: string): keyof typeof DestinationImages => {
    // Handle lottery images with authentic destination photography
    if (type === "lottery") {
      switch (theme) {
        case "bali": return "tropical";
        case "patagonia": return "adventure";
        case "morocco": return "cultural";
        case "paris": return "paris";
        case "tropical": return "tropical";
        case "tokyo": return "tokyo";
        case "europe": return "europe";
        default: return "tropical";
      }
    }
    
    // Handle mission types with real location imagery
    if (type === "mission") {
      switch (theme) {
        case "paris": return "paris";
        case "tokyo": return "tokyo";
        case "tropical": return "tropical";
        case "cultural": return "cultural";
        case "sports": return "sports";
        case "europe": return "europe";
        default: return "cultural";
      }
    }
    
    // Handle prize images with authentic destination photography
    if (type === "prize") {
      switch (theme) {
        case "europe": return "europe";
        case "adventure-gear": return "adventure";
        case "tropical": return "tropical";
        case "paris": return "paris";
        case "luxury": return "luxury";
        case "adventure": return "adventure";
        case "wellness": return "wellness";
        case "cultural": return "cultural";
        default: return "europe";
      }
    }
    
    // Handle marketplace images with authentic product photography
    if (type === "marketplace") {
      switch (theme) {
        case "gear": return "adventure";
        case "wellness": return "wellness";
        case "experiences": return "cultural";
        case "services": return "luxury";
        case "backpack": return "adventure";
        case "spa": return "wellness";
        case "tour": return "cultural";
        case "hotel": return "luxury";
        default: return "cultural";
      }
    }
    
    // Direct type mapping to authentic destinations
    switch (type) {
      case "paris": return "paris";
      case "tropical": return "tropical";
      case "tokyo": return "tokyo";
      case "europe": return "europe";
      case "adventure-gear": return "adventure";
      case "cultural": return "cultural";
      case "sports": return "sports";
      case "luxury": return "luxury";
      case "venice": return "venice";
      case "rome": return "rome";
      case "lottery": return "lottery";
      default: return "paris";
    }
  };

  try {
    const destinationType = getDestinationType(type, theme);
    return (
      <DestinationImageRenderer 
        type={destinationType}
        theme={theme}
        className={className}
      />
    );
  } catch (error) {
    // Fallback with attractive gradient background if image fails
    return (
      <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-lottery-gold via-adventure-orange to-travel-coral text-white font-bold`}>
        {fallbackEmoji}
      </div>
    );
  }
};

export default TravelImageRenderer;