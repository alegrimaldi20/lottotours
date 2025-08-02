import React from 'react';
import { 
  ParisImage, 
  TropicalImage, 
  TokyoImage, 
  EuropeImage, 
  AdventureGearImage,
  CulturalMissionImage,
  SportsMissionImage
} from './travel-images';

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
  // Handle lottery images
  if (type === "lottery" || theme) {
    switch (theme || type) {
      case "paris":
        return <ParisImage className={className} />;
      case "tropical":
        return <TropicalImage className={className} />;
      default:
        return <ParisImage className={className} />;
    }
  }
  
  // Handle mission icons
  if (type === "mission") {
    switch (theme) {
      case "paris":
        return <ParisImage className={className} />;
      case "tokyo":
        return <TokyoImage className={className} />;
      case "tropical":
        return <TropicalImage className={className} />;
      case "cultural":
        return <CulturalMissionImage className={className} />;
      case "sports":
        return <SportsMissionImage className={className} />;
      default:
        return <CulturalMissionImage className={className} />;
    }
  }
  
  // Handle prize images
  if (type === "prize") {
    switch (theme) {
      case "europe":
        return <EuropeImage className={className} />;
      case "adventure-gear":
        return <AdventureGearImage className={className} />;
      case "tropical":
        return <TropicalImage className={className} />;
      case "paris": 
        return <ParisImage className={className} />;
      default:
        return <EuropeImage className={className} />;
    }
  }
  
  // Handle direct image types
  switch (type) {
    case "paris":
      return <ParisImage className={className} />;
    case "tropical":
      return <TropicalImage className={className} />;
    case "tokyo":
      return <TokyoImage className={className} />;
    case "europe":
      return <EuropeImage className={className} />;
    case "adventure-gear":
      return <AdventureGearImage className={className} />;
    case "cultural":
      return <CulturalMissionImage className={className} />;
    case "sports":
      return <SportsMissionImage className={className} />;
    default:
      // Fallback to a simple emoji display for backwards compatibility
      return (
        <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-blue-400 to-purple-500`}>
          {fallbackEmoji}
        </div>
      );
  }
};

export default TravelImageRenderer;