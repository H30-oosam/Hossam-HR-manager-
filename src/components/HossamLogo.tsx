import React from 'react';

interface HossamLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export const HossamLogo: React.FC<HossamLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = true,
}) => {
  // Dimensions based on size preset
  const sizeMap = {
    sm: { graphic: 'h-12 w-12', title: 'text-xs', subtitle: 'text-[7px]', brand: 'text-[9px]', gap: 'gap-1' },
    md: { graphic: 'h-24 w-24', title: 'text-sm', subtitle: 'text-[8px]', brand: 'text-xs', gap: 'gap-3' },
    lg: { graphic: 'h-36 w-36', title: 'text-lg', subtitle: 'text-[10px]', brand: 'text-base', gap: 'gap-4' },
    xl: { graphic: 'h-48 w-48', title: 'text-2xl', subtitle: 'text-[12px]', brand: 'text-2xl', gap: 'gap-5' },
  };

  const current = sizeMap[size];

  // Colors
  const textColor = lightText ? 'text-white' : 'text-[#0A1A3D]';
  const accentColor = lightText ? 'text-indigo-400' : 'text-indigo-600';
  const strokeColor = lightText ? 'white' : '#0A1A3D';
  const fillColor = lightText ? 'rgba(255, 255, 255, 0.05)' : 'rgba(10, 26, 61, 0.05)';

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className} ${current.gap}`}>
      {/* High-Fidelity SVG of the Connected HR Nodes Logo as requested */}
      <svg
        className={`${current.graphic} transition-all duration-300 hover:scale-105`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connecting Lines with Outer Ring Nodes */}
        {/* Line to Top-Left */}
        <line x1="100" y1="100" x2="62" y2="62" stroke={strokeColor} strokeWidth="2" />
        <circle cx="78" cy="78" r="3" fill={strokeColor} />

        {/* Line to Top-Right */}
        <line x1="100" y1="100" x2="138" y2="62" stroke={strokeColor} strokeWidth="2" />
        <circle cx="122" cy="78" r="3" fill={strokeColor} />

        {/* Line to Top */}
        <line x1="100" y1="100" x2="100" y2="46" stroke={strokeColor} strokeWidth="2" />
        <circle cx="100" cy="68" r="3" fill={strokeColor} />

        {/* Line to Middle-Left */}
        <line x1="100" y1="100" x2="52" y2="114" stroke={strokeColor} strokeWidth="2" />
        <circle cx="73" cy="107" r="3" fill={strokeColor} />

        {/* Line to Middle-Right */}
        <line x1="100" y1="100" x2="148" y2="114" stroke={strokeColor} strokeWidth="2" />
        <circle cx="127" cy="107" r="3" fill={strokeColor} />


        {/* Central Core Circle (Manager) */}
        <circle cx="100" cy="100" r="28" fill={fillColor} stroke={strokeColor} strokeWidth="3" />
        {/* Inner concentric accent ring */}
        <circle cx="100" cy="100" r="33" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        
        {/* Central Silhouette: Businessman with tie */}
        <g transform="translate(85, 82) scale(0.7)">
          {/* Head */}
          <circle cx="21" cy="12" r="8" fill={strokeColor} />
          {/* Collar/Tie */}
          <path d="M17 25 L21 32 L25 25 Z" fill={strokeColor} />
          <path d="M15 23 L21 21 L27 23 L25 25 L17 25 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          {/* Torso */}
          <path d="M4 34 C4 23 12 21 21 21 C30 21 38 23 38 34" fill={strokeColor} />
        </g>

        {/* 5 Satellite Sub-Circles (Team Nodes) */}

        {/* 1. Top-Left Node */}
        <circle cx="62" cy="62" r="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <g transform="translate(52, 52) scale(0.4)">
          <circle cx="25" cy="15" r="9" fill={strokeColor} />
          <path d="M7 40 C7 28 17 25 25 25 C33 25 43 28 43 40" fill={strokeColor} />
        </g>

        {/* 2. Top-Right Node */}
        <circle cx="138" cy="62" r="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <g transform="translate(128, 52) scale(0.4)">
          <circle cx="25" cy="15" r="9" fill={strokeColor} />
          {/* Female style avatar torso/hair */}
          <path d="M7 40 C7 28 17 25 25 25 C33 25 43 28 43 40" fill={strokeColor} />
          <path d="M16 11 C15 15 35 15 34 11 Z" fill={strokeColor} />
        </g>

        {/* 3. Center-Top Node */}
        <circle cx="100" cy="38" r="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <g transform="translate(90, 28) scale(0.4)">
          <circle cx="25" cy="15" r="9" fill={strokeColor} />
          <path d="M7 40 C7 28 17 25 25 25 C33 25 43 28 43 40" fill={strokeColor} />
        </g>

        {/* 4. Left Node */}
        <circle cx="48" cy="114" r="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <g transform="translate(38, 104) scale(0.4)">
          <circle cx="25" cy="15" r="9" fill={strokeColor} />
          <path d="M7 40 C7 28 17 25 25 25 C33 25 43 28 43 40" fill={strokeColor} />
        </g>

        {/* 5. Right Node */}
        <circle cx="152" cy="114" r="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <g transform="translate(142, 104) scale(0.4)">
          <circle cx="25" cy="15" r="9" fill={strokeColor} />
          <path d="M7 40 C7 28 17 25 25 25 C33 25 43 28 43 40" fill={strokeColor} />
          <path d="M16 11 C15 15 35 15 34 11 Z" fill={strokeColor} />
        </g>
      </svg>

      {/* Typography with precise alignment to the uploaded logo */}
      {showText && (
        <div className="flex flex-col items-center">
          <h3 className={`${current.title} font-extrabold tracking-[0.16em] uppercase ${textColor}`}>
            HUMAN RESOURCES
          </h3>
          
          {/* "SERVICES" banner with lines and dots */}
          <div className="flex items-center gap-2 w-full max-w-[240px] my-1 opacity-90">
            <div className={`h-[2px] flex-1 bg-gradient-to-r from-transparent to-${lightText ? 'white' : '[#0A1A3D]'}/60`} />
            <span className={`inline-flex items-center gap-1.5 ${current.subtitle} font-bold tracking-[0.3em] uppercase ${textColor}`}>
              ● SERVICES ●
            </span>
            <div className={`h-[2px] flex-1 bg-gradient-to-l from-transparent to-${lightText ? 'white' : '[#0A1A3D]'}/60`} />
          </div>

          <h4 className={`${current.brand} font-serif font-semibold mt-0.5 tracking-wide italic select-text text-indigo-400`}>
            HossamElwardany
          </h4>
        </div>
      )}
    </div>
  );
};
