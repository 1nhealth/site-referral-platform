'use client';

import Image from 'next/image';
import { useTheme } from '@/lib/context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { width: 100, height: 32 },
  md: { width: 120, height: 40 },
  lg: { width: 150, height: 48 },
  xl: { width: 180, height: 64 },
};

// Icon-only sizes for collapsed sidebar
const iconSizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { theme } = useTheme();
  const dimensions = showText ? sizeMap[size] : iconSizeMap[size];
  const logoSrc = theme === 'dark'
    ? '/logos/1ndata-dark.png'
    : '/logos/1ndata-light.png';

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="1nData"
        width={dimensions.width}
        height={dimensions.height}
        className={showText ? '' : 'object-contain'}
        style={!showText ? { objectFit: 'contain', objectPosition: 'left' } : undefined}
        priority
      />
    </div>
  );
}
