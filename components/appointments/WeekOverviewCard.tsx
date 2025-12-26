'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Phone, MapPin, FileText } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WeekOverviewCardProps {
  stats: {
    total: number;
    byType: Record<Appointment['type'], number>;
    byDay: { date: Date; count: number }[];
  };
  onDayClick?: (date: Date) => void;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateRange(days: { date: Date }[]): string {
  if (days.length === 0) return '';
  const start = days[0].date;
  const end = days[days.length - 1].date;
  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function WeekOverviewCard({ stats, onDayClick }: WeekOverviewCardProps) {
  const typeStats = [
    {
      label: 'Phone',
      value: stats.byType.phone_screen,
      color: 'text-vista-blue',
    },
    {
      label: 'In-Person',
      value: stats.byType.in_person_screen,
      color: 'text-purple-500',
    },
    {
      label: 'Consent',
      value: stats.byType.consent_visit,
      color: 'text-mint',
    },
  ];

  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-vista-blue" />
          <h3 className="text-lg font-semibold text-text-primary">This Week</h3>
        </div>
        <span className="text-xs text-text-muted">
          {formatDateRange(stats.byDay)}
        </span>
      </div>

      {/* Stats Row - Simplified */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
          <p className="text-xs text-text-muted">Total</p>
        </div>
        {typeStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Day Breakdown */}
      <div className="flex gap-1.5">
        {stats.byDay.map((day, index) => {
          const dayOfWeek = day.date.getDay();
          const today = isToday(day.date);
          const hasAppointments = day.count > 0;

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              onClick={() => onDayClick?.(day.date)}
              className={cn(
                'flex-1 flex flex-col items-center py-2.5 rounded-lg transition-all',
                'hover:bg-white/50 dark:hover:bg-white/5',
                today && 'ring-1 ring-mint/40 bg-mint/5'
              )}
            >
              <span className={cn(
                'text-[10px] font-medium mb-1',
                today ? 'text-mint' : 'text-text-muted'
              )}>
                {dayNames[dayOfWeek]}
              </span>
              <span className={cn(
                'text-base font-semibold',
                hasAppointments ? 'text-text-primary' : 'text-text-muted'
              )}>
                {day.count}
              </span>
              {hasAppointments && (
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: Math.min(day.count, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-mint"
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </GlassCard>
  );
}
