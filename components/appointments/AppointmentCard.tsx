'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, FileText, MoreHorizontal, Clock, Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  variant?: 'compact' | 'detailed';
  showActions?: boolean;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClick?: (appointment: Appointment) => void;
  isHighlighted?: boolean;
}

const appointmentTypeConfig = {
  phone_screen: {
    label: 'Phone Screen',
    icon: Phone,
    color: 'text-vista-blue',
    bgColor: 'bg-vista-blue/10',
  },
  in_person_screen: {
    label: 'In-Person',
    icon: MapPin,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  consent_visit: {
    label: 'Consent Visit',
    icon: FileText,
    color: 'text-mint',
    bgColor: 'bg-mint/10',
  },
};

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function isToday(date: string): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function AppointmentCard({
  appointment,
  variant = 'compact',
  showActions = true,
  onReschedule,
  onCancel,
  onClick,
  isHighlighted = false,
}: AppointmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = appointmentTypeConfig[appointment.type];
  const Icon = config.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick?.(appointment)}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer',
          'hover:bg-white/50 dark:hover:bg-white/5',
          isHighlighted && 'ring-1 ring-mint/30 bg-mint/5'
        )}
      >
        <span className="text-sm font-medium text-text-primary w-14 shrink-0">
          {formatTime(appointment.scheduledFor)}
        </span>
        <div className={cn('p-1.5 rounded-lg shrink-0', config.bgColor)}>
          <Icon className={cn('w-3.5 h-3.5', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {appointment.referralName}
          </p>
          <p className="text-xs text-text-muted truncate">
            {appointment.studyName}
          </p>
        </div>
        {showActions && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 rounded-2xl glass-dropdown py-1.5 z-50 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReschedule?.(appointment.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
        )}
      </div>
    );
  }

  // Detailed variant
  return (
    <motion.div
      onClick={() => onClick?.(appointment)}
      className={cn(
        'p-4 rounded-lg transition-all cursor-pointer',
        'bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10',
        isHighlighted && 'ring-1 ring-mint/30 bg-mint/5'
      )}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2.5 rounded-lg shrink-0', config.bgColor)}>
          <Icon className={cn('w-5 h-5', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-text-primary truncate">
              {appointment.referralName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
              <Clock className="w-3 h-3" />
              {formatTime(appointment.scheduledFor)}
            </div>
          </div>
          <p className="text-sm text-text-secondary mt-0.5">
            {appointment.studyName}
          </p>
          {appointment.notes && (
            <p className="text-xs text-text-muted mt-2 line-clamp-2">
              {appointment.notes}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar className="w-3 h-3" />
              {isToday(appointment.scheduledFor) ? (
                <span className="text-mint font-medium">Today</span>
              ) : (
                formatDate(appointment.scheduledFor)
              )}
            </div>
            {showActions && (
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReschedule?.(appointment.id);
                  }}
                  className="px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel?.(appointment.id);
                  }}
                  className="px-2.5 py-1 text-xs text-error hover:bg-error/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
