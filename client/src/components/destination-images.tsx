import React from 'react';

// High-quality stock images for real destinations and experiences
// Using royalty-free images from Pexels, Pixabay, and Unsplash

export const DestinationImages = {
  // Paris destinations - iconic Eiffel Tower and city views
  paris: {
    main: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Eiffel Tower in Paris with blue sky and gardens',
    credit: 'Pexels'
  },
  
  // Tokyo destinations - Mount Fuji and city skyline
  tokyo: {
    main: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Mount Fuji with Tokyo skyline and traditional architecture',
    credit: 'Pexels'
  },
  
  // Tropical destinations - Maldives-style overwater bungalows
  tropical: {
    main: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Tropical beach paradise with crystal clear turquoise water and white sand',
    credit: 'Pexels'
  },
  
  // European destinations - Swiss Alps and Italian landmarks
  europe: {
    main: 'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Swiss Alps mountain landscape with snow-capped peaks and lakes',
    credit: 'Pexels'
  },

  // Cultural experiences - Traditional architecture and landmarks
  cultural: {
    main: 'https://images.pexels.com/photos/2433467/pexels-photo-2433467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Traditional Japanese temple with pagoda architecture',
    credit: 'Pexels'
  },

  // Sports and adventure activities
  sports: {
    main: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Mountain hiking and adventure sports with scenic alpine views',
    credit: 'Pexels'
  },

  // Luxury travel and experiences
  luxury: {
    main: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Luxury overwater villa resort with wooden deck over crystal water',
    credit: 'Pexels'
  },

  // Adventure gear and travel products
  adventure: {
    main: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Adventure travel gear and camping equipment in mountain setting',
    credit: 'Pexels'
  },

  // Venice canals for European city experiences
  venice: {
    main: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Venice canal with gondolas and historic Italian architecture',
    credit: 'Pexels'
  },

  // Rome Colosseum for historic experiences
  rome: {
    main: 'https://images.pexels.com/photos/2041396/pexels-photo-2041396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Roman Colosseum amphitheater with ancient architecture',
    credit: 'Pexels'
  },

  // Lottery and gaming themed (casino/resort style)
  lottery: {
    main: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Luxury resort and entertainment destination with lights',
    credit: 'Pexels'
  },

  // Travel packages and tours
  package: {
    main: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Scenic travel destination with multiple landscapes and attractions',
    credit: 'Pexels'
  }
};

interface DestinationImageProps {
  type: keyof typeof DestinationImages;
  className?: string;
  theme?: string;
}

export const DestinationImageRenderer: React.FC<DestinationImageProps> = ({ 
  type, 
  className = "",
  theme
}) => {
  // Map themes to specific destination types for more accurate imagery
  const getImageByTheme = (baseType: keyof typeof DestinationImages, theme?: string) => {
    if (!theme) return DestinationImages[baseType];

    // Theme-based mapping for more specific imagery
    const themeMapping: Record<string, keyof typeof DestinationImages> = {
      'paris': 'paris',
      'tokyo': 'tokyo',
      'tropical': 'tropical',
      'europe': 'europe',
      'maldives': 'luxury',
      'bali': 'tropical',
      'switzerland': 'europe',
      'italy': 'venice',
      'cultural': 'cultural',
      'sports': 'sports',
      'adventure': 'adventure',
      'luxury': 'luxury',
      'city-break': 'paris',
      'weekend-getaway': 'europe',
      'diving': 'tropical',
      'skiing': 'europe',
      'romantic': 'luxury'
    };

    return DestinationImages[themeMapping[theme] || baseType];
  };

  const imageData = getImageByTheme(type, theme);

  return (
    <img
      src={imageData.main}
      alt={imageData.alt}
      className={`object-cover rounded-lg ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to a solid color background if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        if (target.parentElement) {
          target.parentElement.style.backgroundColor = 'var(--lottery-gold)';
          target.parentElement.style.display = 'flex';
          target.parentElement.style.alignItems = 'center';
          target.parentElement.style.justifyContent = 'center';
          target.parentElement.innerHTML = `<span style="color: white; font-weight: 600;">${imageData.alt}</span>`;
        }
      }}
    />
  );
};

export default DestinationImageRenderer;