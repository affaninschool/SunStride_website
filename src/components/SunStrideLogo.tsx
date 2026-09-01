import React from 'react';

interface SunStrideLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'symbol' | 'monochrome';
  darkTheme?: boolean;
}

export const SunStrideLogo: React.FC<SunStrideLogoProps> = ({
  className = '',
  size = 36,
  variant = 'symbol',
  darkTheme = false,
}) => {
  const goldColor = '#EAA43A';
  const charcoalColor = darkTheme ? '#FFFFFF' : '#1C242C';
  const subArcCharcoal = darkTheme ? '#E2E8F0' : '#1C242C';

  return (
    <svg
      viewBox="0 0 500 320"
      width={size}
      height={typeof size === 'number' ? (size * 320) / 500 : 'auto'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label="SunStride Logo"
    >
      <g id="sunstride-logo-mark">
        {/* ========================================================
            UPPER CONCENTRIC RADIATING SOLAR & RFID ARCS (GOLD)
            3 Concentric rings split into 4 radial segments
            Center of arcs: (250, 220)
            ======================================================== */}
        
        {/* OUTER RING (R_out: 200, R_in: 178) */}
        {/* Top-Left Sector: 180° to 139° */}
        <path
          d="M 50,220 A 200 200 0 0 1 101.4,77.5 L 116.8,93.4 A 178 178 0 0 0 72,220 Z"
          fill={goldColor}
        />
        {/* Top-Center-Left Sector: 133° to 94° */}
        <path
          d="M 116.1,70.5 A 200 200 0 0 1 239.5,20.4 L 240.7,42.4 A 178 178 0 0 0 130.7,87.0 Z"
          fill={goldColor}
        />
        {/* Top-Center-Right Sector: 86° to 47° */}
        <path
          d="M 260.5,20.4 A 200 200 0 0 1 383.9,70.5 L 369.3,87.0 A 178 178 0 0 0 259.3,42.4 Z"
          fill={goldColor}
        />
        {/* Top-Right Sector: 41° to 0° */}
        <path
          d="M 398.6,77.5 A 200 200 0 0 1 450,220 L 428,220 A 178 178 0 0 0 383.2,93.4 Z"
          fill={goldColor}
        />

        {/* MIDDLE RING (R_out: 160, R_in: 140) */}
        {/* Top-Left Sector */}
        <path
          d="M 90,220 A 160 160 0 0 1 131.1,106.0 L 144.7,119.7 A 140 140 0 0 0 110,220 Z"
          fill={goldColor}
        />
        {/* Top-Center-Left Sector */}
        <path
          d="M 142.9,100.4 A 160 160 0 0 1 241.6,60.3 L 242.7,80.3 A 140 140 0 0 0 155.0,115.4 Z"
          fill={goldColor}
        />
        {/* Top-Center-Right Sector */}
        <path
          d="M 258.4,60.3 A 160 160 0 0 1 357.1,100.4 L 345.0,115.4 A 140 140 0 0 0 257.3,80.3 Z"
          fill={goldColor}
        />
        {/* Top-Right Sector */}
        <path
          d="M 368.9,106.0 A 160 160 0 0 1 410,220 L 390,220 A 140 140 0 0 0 355.3,119.7 Z"
          fill={goldColor}
        />

        {/* INNER RING (R_out: 122, R_in: 104) */}
        {/* Top-Left Sector */}
        <path
          d="M 128,220 A 122 122 0 0 1 159.4,133.1 L 171.8,145.7 A 104 104 0 0 0 146,220 Z"
          fill={goldColor}
        />
        {/* Top-Center-Left Sector */}
        <path
          d="M 168.4,128.8 A 122 122 0 0 1 243.6,98.2 L 244.5,116.2 A 104 104 0 0 0 178.2,142.3 Z"
          fill={goldColor}
        />
        {/* Top-Center-Right Sector */}
        <path
          d="M 256.4,98.2 A 122 122 0 0 1 331.6,128.8 L 321.8,142.3 A 104 104 0 0 0 255.5,116.2 Z"
          fill={goldColor}
        />
        {/* Top-Right Sector */}
        <path
          d="M 340.6,133.1 A 122 122 0 0 1 372,220 L 354,220 A 104 104 0 0 0 328.2,145.7 Z"
          fill={goldColor}
        />

        {/* ========================================================
            CENTRAL TUNNEL ARCH (DARK CHARCOAL)
            R_out: 86, R_in: 66, centered at (250, 220)
            ======================================================== */}
        <path
          d="M 164,220 A 86 86 0 0 1 336,220 L 366,220 A 116 116 0 0 0 134,220 Z"
          fill={subArcCharcoal}
        />

        {/* ========================================================
            LOWER PERSPECTIVE TRACK & HIGHWAY CORRIDOR
            ======================================================== */}
        
        {/* --- LEFT SIDE: RAILWAY TIES / SLEEPERS (Perspective Steps) --- */}
        {/* Top Sleeper 4 */}
        <polygon points="214,166 238,153 246,159 223,173" fill={charcoalColor} />
        {/* Sleeper 3 */}
        <polygon points="191,195 224,177 234,184 203,203" fill={charcoalColor} />
        {/* Sleeper 2 */}
        <polygon points="160,229 204,204 216,213 174,238" fill={charcoalColor} />
        {/* Bottom Sleeper 1 & Ground Rail Bed with notch */}
        <polygon points="62,290 126,252 144,262 82,290" fill={charcoalColor} />
        <polygon points="62,290 82,290 205,215 190,290 155,290 196,224" fill={charcoalColor} />

        {/* --- RIGHT SIDE: SMOOTH CURVING HIGHWAY STREAMS --- */}
        {/* Center-Right Inner Highway Ribbon */}
        <path
          d="M 238,138 C 242,165 245,210 242,290 L 274,290 C 277,215 272,165 258,138 Z"
          fill={charcoalColor}
        />
        {/* Outer Right Sweeping Highway Curve (Tapering out to baseline) */}
        <path
          d="M 264,140 C 285,175 320,230 455,290 L 345,290 C 295,250 275,200 252,143 Z"
          fill={charcoalColor}
        />
      </g>
    </svg>
  );
};
