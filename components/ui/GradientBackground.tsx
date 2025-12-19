'use client';

import { memo } from 'react';

interface GradientBackgroundProps {
  className?: string;
}

export const GradientBackground = memo(function GradientBackground({
  className = '',
}: GradientBackgroundProps) {
  return (
    <div className={`glassmorphic-bg ${className}`} aria-hidden="true">
      {/* Animated gradient orbs - immersive pastel colors */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
      <div className="gradient-orb gradient-orb-4" />
      <div className="gradient-orb gradient-orb-5" />
      <div className="gradient-orb gradient-orb-6" />
      <div className="gradient-orb gradient-orb-7" />
    </div>
  );
});
