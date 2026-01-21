'use client';

import { getConfidenceColor, getConfidenceLevel } from '@/lib/utils/matching';

interface ConfidenceIndicatorProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceIndicator({
  score,
  showLabel = true,
  size = 'md',
}: ConfidenceIndicatorProps) {
  const colors = getConfidenceColor(score);
  const level = getConfidenceLevel(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const barHeight = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  const levelLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    'very-low': 'Very Low',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Score badge */}
      <span
        className={`
          inline-flex items-center font-semibold rounded-lg border
          ${sizeClasses[size]}
          ${colors.bg}
          ${colors.text}
          ${colors.border}
        `}
      >
        {score}%
      </span>

      {/* Progress bar */}
      <div className={`flex-1 min-w-[60px] bg-slate-200/50 dark:bg-slate-700/50 rounded-full ${barHeight[size]} overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            level === 'high'
              ? 'bg-emerald-500'
              : level === 'medium'
                ? 'bg-amber-500'
                : level === 'low'
                  ? 'bg-orange-500'
                  : 'bg-slate-400'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span className={`text-xs font-medium ${colors.text}`}>
          {levelLabels[level]}
        </span>
      )}
    </div>
  );
}
