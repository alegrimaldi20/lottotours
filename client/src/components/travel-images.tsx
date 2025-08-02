import React from 'react';

// Travel destination images
export const ParisImage = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sky background */}
    <rect width="200" height="200" fill="url(#parisGradient)" />
    
    {/* Eiffel Tower */}
    <g transform="translate(90, 40)">
      {/* Tower structure */}
      <path d="M10 140 L5 40 L15 40 Z" fill="#8B4513" stroke="#654321" strokeWidth="0.5"/>
      <path d="M10 140 L2 60 L18 60 Z" fill="#A0522D" stroke="#654321" strokeWidth="0.5"/>
      <path d="M10 140 L0 80 L20 80 Z" fill="#8B4513" stroke="#654321" strokeWidth="0.5"/>
      
      {/* Tower levels */}
      <rect x="3" y="60" width="14" height="2" fill="#654321"/>
      <rect x="1" y="80" width="18" height="2" fill="#654321"/>
      <rect x="5" y="100" width="10" height="2" fill="#654321"/>
      
      {/* Antenna */}
      <line x1="10" y1="40" x2="10" y2="30" stroke="#654321" strokeWidth="1"/>
      <circle cx="10" cy="30" r="1" fill="#654321"/>
    </g>
    
    {/* Clouds */}
    <circle cx="40" cy="30" r="8" fill="rgba(255,255,255,0.8)"/>
    <circle cx="48" cy="30" r="10" fill="rgba(255,255,255,0.8)"/>
    <circle cx="56" cy="30" r="8" fill="rgba(255,255,255,0.8)"/>
    
    <circle cx="140" cy="45" r="6" fill="rgba(255,255,255,0.7)"/>
    <circle cx="146" cy="45" r="8" fill="rgba(255,255,255,0.7)"/>
    <circle cx="152" cy="45" r="6" fill="rgba(255,255,255,0.7)"/>
    
    <defs>
      <linearGradient id="parisGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB"/>
        <stop offset="100%" stopColor="#E6F3FF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const TropicalImage = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ocean and sky background */}
    <rect width="200" height="120" fill="url(#skyGradient)" />
    <rect y="120" width="200" height="80" fill="url(#oceanGradient)" />
    
    {/* Island */}
    <ellipse cx="100" cy="140" rx="80" ry="20" fill="#F4A460"/>
    
    {/* Palm trees */}
    <g transform="translate(70, 100)">
      <rect x="8" y="20" width="4" height="25" fill="#8B4513"/>
      <path d="M10 20 Q5 10 0 15 Q8 12 10 20" fill="#228B22"/>
      <path d="M10 20 Q15 10 20 15 Q12 12 10 20" fill="#228B22"/>
      <path d="M10 20 Q8 5 3 8 Q10 8 10 20" fill="#32CD32"/>
      <path d="M10 20 Q12 5 17 8 Q10 8 10 20" fill="#32CD32"/>
    </g>
    
    <g transform="translate(120, 110)">
      <rect x="6" y="15" width="3" height="20" fill="#8B4513"/>
      <path d="M7.5 15 Q3 8 0 12 Q6 10 7.5 15" fill="#228B22"/>
      <path d="M7.5 15 Q12 8 15 12 Q9 10 7.5 15" fill="#228B22"/>
      <path d="M7.5 15 Q6 3 2 6 Q7.5 6 7.5 15" fill="#32CD32"/>
    </g>
    
    {/* Overwater bungalow */}
    <g transform="translate(130, 125)">
      <rect x="0" y="8" width="25" height="12" fill="#D2B48C"/>
      <polygon points="0,8 12.5,0 25,8" fill="#8B4513"/>
      <rect x="10" y="12" width="5" height="6" fill="#4682B4"/>
      <rect x="8" y="20" width="2" height="8" fill="#8B4513"/>
      <rect x="17" y="20" width="2" height="8" fill="#8B4513"/>
    </g>
    
    {/* Sun */}
    <circle cx="160" cy="40" r="15" fill="#FFD700"/>
    <g transform="translate(160, 40)">
      <line x1="-20" y1="0" x2="-17" y2="0" stroke="#FFD700" strokeWidth="2"/>
      <line x1="17" y1="0" x2="20" y2="0" stroke="#FFD700" strokeWidth="2"/>
      <line x1="0" y1="-20" x2="0" y2="-17" stroke="#FFD700" strokeWidth="2"/>
      <line x1="0" y1="17" x2="0" y2="20" stroke="#FFD700" strokeWidth="2"/>
    </g>
    
    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB"/>
        <stop offset="100%" stopColor="#E0F6FF"/>
      </linearGradient>
      <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00BFFF"/>
        <stop offset="100%" stopColor="#1E90FF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const TokyoImage = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="200" height="200" fill="url(#tokyoGradient)" />
    
    {/* Mount Fuji silhouette */}
    <polygon points="150,120 170,80 190,120" fill="#8A9BA8"/>
    <polygon points="155,120 170,85 185,120" fill="#B0C4DE"/>
    
    {/* Ramen bowl */}
    <g transform="translate(50, 80)">
      <ellipse cx="30" cy="35" rx="28" ry="8" fill="#8B4513"/>
      <ellipse cx="30" cy="32" rx="25" ry="15" fill="#F5DEB3"/>
      <ellipse cx="30" cy="30" rx="23" ry="12" fill="#DEB887"/>
      
      {/* Noodles */}
      <path d="M15 30 Q20 25 25 30 Q30 35 35 30 Q40 25 45 30" fill="none" stroke="#F5DEB3" strokeWidth="2"/>
      <path d="M18 32 Q23 27 28 32 Q33 37 38 32 Q43 27 48 32" fill="none" stroke="#F5DEB3" strokeWidth="2"/>
      
      {/* Garnish */}
      <circle cx="25" cy="28" r="2" fill="#FF6347"/>
      <circle cx="35" cy="29" r="2" fill="#32CD32"/>
      <rect x="20" y="26" width="3" height="1" fill="#228B22"/>
      
      {/* Chopsticks */}
      <line x1="50" y1="20" x2="65" y2="10" stroke="#8B4513" strokeWidth="2"/>
      <line x1="52" y1="22" x2="67" y2="12" stroke="#8B4513" strokeWidth="2"/>
    </g>
    
    {/* Cherry blossoms */}
    <g fill="#FFB6C1" opacity="0.8">
      <circle cx="30" cy="40" r="3"/>
      <circle cx="28" cy="45" r="2"/>
      <circle cx="35" cy="38" r="2.5"/>
      <circle cx="170" cy="50" r="2"/>
      <circle cx="175" cy="55" r="3"/>
      <circle cx="165" cy="60" r="2.5"/>
    </g>
    
    <defs>
      <linearGradient id="tokyoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFE4E1"/>
        <stop offset="100%" stopColor="#FFF8DC"/>
      </linearGradient>
    </defs>
  </svg>
);

export const EuropeImage = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="200" height="200" fill="url(#europeGradient)" />
    
    {/* Classical building (Parthenon-style) */}
    <g transform="translate(50, 70)">
      {/* Base */}
      <rect x="0" y="80" width="100" height="8" fill="#D3D3D3"/>
      
      {/* Columns */}
      <rect x="10" y="40" width="6" height="40" fill="#F5F5F5"/>
      <rect x="25" y="40" width="6" height="40" fill="#F5F5F5"/>
      <rect x="40" y="40" width="6" height="40" fill="#F5F5F5"/>
      <rect x="55" y="40" width="6" height="40" fill="#F5F5F5"/>
      <rect x="70" y="40" width="6" height="40" fill="#F5F5F5"/>
      <rect x="85" y="40" width="6" height="40" fill="#F5F5F5"/>
      
      {/* Entablature */}
      <rect x="5" y="35" width="90" height="8" fill="#E0E0E0"/>
      
      {/* Pediment */}
      <polygon points="0,35 50,15 100,35" fill="#DCDCDC"/>
      
      {/* Column capitals */}
      <rect x="8" y="38" width="10" height="3" fill="#E0E0E0"/>
      <rect x="23" y="38" width="10" height="3" fill="#E0E0E0"/>
      <rect x="38" y="38" width="10" height="3" fill="#E0E0E0"/>
      <rect x="53" y="38" width="10" height="3" fill="#E0E0E0"/>
      <rect x="68" y="38" width="10" height="3" fill="#E0E0E0"/>
      <rect x="83" y="38" width="10" height="3" fill="#E0E0E0"/>
    </g>
    
    {/* Decorative elements */}
    <circle cx="30" cy="50" r="3" fill="#FFD700" opacity="0.7"/>
    <circle cx="170" cy="60" r="4" fill="#FFD700" opacity="0.7"/>
    <circle cx="25" cy="180" r="2" fill="#FFD700" opacity="0.7"/>
    
    <defs>
      <linearGradient id="europeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F0F8FF"/>
        <stop offset="100%" stopColor="#E6E6FA"/>
      </linearGradient>
    </defs>
  </svg>
);

export const AdventureGearImage = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="200" height="200" fill="url(#gearGradient)" />
    
    {/* Backpack */}
    <g transform="translate(70, 40)">
      {/* Main body */}
      <rect x="10" y="20" width="40" height="60" rx="8" fill="#2F4F4F"/>
      <rect x="12" y="22" width="36" height="56" rx="6" fill="#708090"/>
      
      {/* Top flap */}
      <rect x="8" y="15" width="44" height="12" rx="6" fill="#2F4F4F"/>
      
      {/* Straps */}
      <rect x="5" y="25" width="4" height="45" fill="#8B4513"/>
      <rect x="51" y="25" width="4" height="45" fill="#8B4513"/>
      
      {/* Side pockets */}
      <ellipse cx="5" cy="45" rx="8" ry="12" fill="#556B2F"/>
      <ellipse cx="55" cy="45" rx="8" ry="12" fill="#556B2F"/>
      
      {/* Buckles and details */}
      <rect x="15" y="18" width="3" height="2" fill="#C0C0C0"/>
      <rect x="42" y="18" width="3" height="2" fill="#C0C0C0"/>
      <circle cx="30" cy="35" r="2" fill="#FF6347"/>
      
      {/* Zippers */}
      <line x1="20" y1="30" x2="40" y2="30" stroke="#C0C0C0" strokeWidth="1"/>
      <line x1="20" y1="50" x2="40" y2="50" stroke="#C0C0C0" strokeWidth="1"/>
    </g>
    
    {/* Hiking items around the backpack */}
    {/* Water bottle */}
    <g transform="translate(130, 100)">
      <rect x="0" y="0" width="12" height="25" rx="6" fill="#4169E1"/>
      <rect x="2" y="2" width="8" height="20" rx="4" fill="#87CEEB"/>
      <rect x="3" y="-2" width="6" height="4" rx="3" fill="#2F4F4F"/>
    </g>
    
    {/* Compass */}
    <g transform="translate(40, 140)">
      <circle cx="8" cy="8" r="8" fill="#DAA520"/>
      <circle cx="8" cy="8" r="6" fill="#F5F5F5"/>
      <line x1="8" y1="4" x2="8" y2="12" stroke="#FF0000" strokeWidth="2"/>
      <line x1="4" y1="8" x2="12" y2="8" stroke="#000000" strokeWidth="1"/>
    </g>
    
    {/* Rope */}
    <g stroke="#D2691E" strokeWidth="3" fill="none">
      <path d="M20 120 Q30 125 25 135 Q20 145 30 150"/>
      <path d="M25 135 Q35 140 30 150"/>
    </g>
    
    <defs>
      <linearGradient id="gearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F0F8FF"/>
        <stop offset="100%" stopColor="#E0FFFF"/>
      </linearGradient>
    </defs>
  </svg>
);

// Mission type images
export const CulturalMissionImage = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="url(#culturalGradient)" />
    <g transform="translate(30, 25)">
      <rect x="0" y="20" width="40" height="30" fill="#8B4513"/>
      <rect x="5" y="25" width="30" height="20" fill="#F5DEB3"/>
      <polygon points="0,20 20,5 40,20" fill="#A0522D"/>
      <rect x="15" y="30" width="10" height="15" fill="#654321"/>
      <rect x="10" y="35" width="5" height="5" fill="#4682B4"/>
      <rect x="25" y="35" width="5" height="5" fill="#4682B4"/>
    </g>
    <defs>
      <linearGradient id="culturalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF8DC"/>
        <stop offset="100%" stopColor="#F0E68C"/>
      </linearGradient>
    </defs>
  </svg>
);

export const SportsMissionImage = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="url(#sportsGradient)" />
    {/* Beach scene with volleyball */}
    <rect y="70" width="100" height="30" fill="#F4A460"/>
    <circle cx="50" cy="40" r="12" fill="#FFD700"/>
    <g stroke="#FF6347" strokeWidth="2" fill="none">
      <circle cx="50" cy="40" r="12"/>
      <path d="M38 40 Q50 25 62 40"/>
      <path d="M38 40 Q50 55 62 40"/>
      <line x1="38" y1="40" x2="62" y2="40"/>
    </g>
    <defs>
      <linearGradient id="sportsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB"/>
        <stop offset="100%" stopColor="#E0F6FF"/>
      </linearGradient>
    </defs>
  </svg>
);