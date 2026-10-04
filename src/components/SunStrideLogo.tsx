import React from 'react';
import sunstrideLogoImg from '../assets/sunstride_logo.png';

interface SunStrideLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'symbol' | 'monochrome';
  darkTheme?: boolean;
  zoom?: number;
}

export const SunStrideLogo: React.FC<SunStrideLogoProps> = ({
  className = '',
  size = 38,
  darkTheme = false,
  zoom = 1.15,
}) => {
  const dimensionStyle: React.CSSProperties =
    typeof size === 'number'
      ? { width: size, height: size, transform: `scale(${zoom})` }
      : { width: size, height: size, transform: `scale(${zoom})` };

  return (
    <img
      src={sunstrideLogoImg}
      alt="SunStride Smart Station Official Logo Emblem"
      style={dimensionStyle}
      className={`inline-block object-contain shrink-0 rounded-lg transition-transform ${
        darkTheme
          ? 'drop-shadow-[0_2px_12px_rgba(255,180,46,0.3)]'
          : 'drop-shadow-xs'
      } ${className}`}
      loading="eager"
      decoding="async"
    />
  );
};
