'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Calendar, MoreHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useState, useRef, useEffect } from 'react';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PastDueCardProps {
  appointments: Appointment[];
  onReschedule?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
}

function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
}

function PastDueItem({
  appointment,
  onReschedule,
  onMarkComplete,
  onCancel,
}: {
  appointment: Appointment;
  onReschedule?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
      <div className="p-2 rounded-lg bg-warning/10 shrink-0">
        <Clock className="w-4 h-4 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {appointment.referralName}
        </p>
        <p className="text-xs text-warning font-medium">
          {formatTimeAgo(appointment.scheduledFor)}
        </p>
      </div>
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-36 rounded-2xl glass-dropdown py-1.5 z-50 overflow-hidden">
            <button
              onClick={() => {
                onReschedule?.(appointment.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            >
              Reschedule
            </button>
            <button
              onClick={() => {
                onMarkComplete?.(appointment.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-mint hover:bg-mint/10 transition-colors"
            >
              Mark Complete
            </button>
            <button
              onClick={() => {
                onCancel?.(appointment.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PastDueCard({
  appointments,
  onReschedule,
  onMarkComplete,
  onCancel,
}: PastDueCardProps) {
  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold text-text-primary">Past Due</h3>
        </div>
        {appointments.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
            {appointments.length}
          </span>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-10 h-10 text-mint/50 mx-auto mb-3" />
          <p className="text-sm text-text-secondary">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {appointments.slice(0, 5).map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PastDueItem
                appointment={appointment}
                onReschedule={onReschedule}
                onMarkComplete={onMarkComplete}
                onCancel={onCancel}
              />
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
