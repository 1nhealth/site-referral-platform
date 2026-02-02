'use client';

import { motion } from 'framer-motion';

interface ReconProgressRingProps {
  progress: number;          // 0-100
  size?: number;             // Diameter in pixels
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  color?: 'mint' | 'blue' | 'amber' | 'red';
}

const colorMap = {
  mint: {
    stroke: '#2E9B73',
    bg: 'rgba(46, 155, 115, 0.1)',
  },
  blue: {
    stroke: '#7991C6',
    bg: 'rgba(121, 145, 198, 0.1)',
  },
  amber: {
    stroke: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  red: {
    stroke: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
  },
};

export function ReconProgressRing({
  progress,
  size = 60,
  strokeWidth = 6,
  showLabel = true,
  label,
  color = 'mint',
}: ReconProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const colors = colorMap[color];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/20 dark:text-white/10"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-text-primary">
            {label ?? `${Math.round(progress)}%`}
          </span>
        </div>
      )}
    </div>
  );
}

// Linear progress bar variant
interface ReconProgressBarProps {
  progress: number;
  height?: number;
  showLabel?: boolean;
  color?: 'mint' | 'blue' | 'amber' | 'red';
  className?: string;
}

export function ReconProgressBar({
  progress,
  height = 6,
  showLabel = false,
  color = 'mint',
  className = '',
}: ReconProgressBarProps) {
  const colors = colorMap[color];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex-1 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colors.stroke }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-text-secondary min-w-[40px] text-right">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
