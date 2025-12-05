'use client';

import { motion } from 'framer-motion';
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

type GlassCardVariant = 'default' | 'elevated' | 'inset' | 'liquid' | 'frosted';
type AccentColor = 'mint' | 'blue' | 'purple' | 'amber';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  shimmer?: boolean;
  accentColor?: AccentColor;
  children?: ReactNode;
}

const variantClasses: Record<GlassCardVariant, string> = {
  default: 'glass-card',
  elevated: 'glass-card-elevated',
  inset: 'glass-card-inset',
  liquid: 'glass-liquid',
  frosted: 'glass-frosted',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const accentGlowClasses: Record<AccentColor, string> = {
  mint: 'hover-glow-mint',
  blue: 'hover-glow-blue',
  purple: 'hover-glow-purple',
  amber: 'hover-glow-amber',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      animate = true,
      shimmer = false,
      accentColor,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const shimmerClass = shimmer ? 'glass-card-shimmer' : '';
    const glowClass = accentColor ? accentGlowClasses[accentColor] : '';
    const baseClasses = `${variantClasses[variant]} ${paddingClasses[padding]} ${shimmerClass} ${glowClass} ${className}`.trim();

    if (!animate) {
      return (
        <div ref={ref} className={baseClasses} {...props}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
