'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import Player to avoid SSR issues (it accesses document at import time)
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

interface LottieContainerProps {
  animationUrl?: string;
  fallback?: ReactNode;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function LottieContainer({
  animationUrl,
  fallback,
  width = 300,
  height = 300,
  loop = true,
  autoplay = true,
  className = '',
}: LottieContainerProps) {
  // If no animation URL but fallback provided, show fallback
  if (!animationUrl && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  // If no animation URL and no fallback, show placeholder
  if (!animationUrl) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-white/30 text-sm text-center">
          <div className="mb-2">
            <svg
              className="w-12 h-12 mx-auto opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p>[Lottie Animation]</p>
          <p className="text-xs mt-1 opacity-60">Placeholder</p>
        </div>
      </div>
    );
  }

  return (
    <Player
      src={animationUrl}
      loop={loop}
      autoplay={autoplay}
      style={{ width, height }}
      className={className}
    />
  );
}
