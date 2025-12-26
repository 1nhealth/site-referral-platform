'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onScheduleClick: (date?: Date) => void;
  selectedDate: Date | null;
}

const appointmentTypeColors = {
  phone_screen: 'bg-vista-blue',
  in_person_screen: 'bg-purple-500',
  consent_visit: 'bg-mint',
};

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (Date | null)[] = [];

  // Add padding for days before the first of the month
  for (let i = 0; i < startPadding; i++) {
    const prevMonthDay = new Date(year, month, -startPadding + i + 1);
    days.push(prevMonthDay);
  }

  // Add days of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  // Add padding to complete the grid (6 rows x 7 days = 42)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const nextMonthDay = new Date(year, month + 1, i);
    days.push(nextMonthDay);
  }

  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function getAppointmentsForDay(appointments: Appointment[], date: Date): Appointment[] {
  return appointments.filter(appt => {
    const apptDate = new Date(appt.scheduledFor);
    return isSameDay(apptDate, date);
  });
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function DayCell({
  date,
  isCurrentMonth,
  appointments,
  isSelected,
  onSelect,
  onSchedule,
  onAppointmentClick,
}: {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
  isSelected: boolean;
  onSelect: () => void;
  onSchedule: () => void;
  onAppointmentClick: (appointment: Appointment) => void;
}) {
  const today = isToday(date);
  const hasAppointments = appointments.length > 0;
  const cellRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<'left' | 'right' | 'center'>('center');

  // Determine popover position based on cell position
  useEffect(() => {
    if (cellRef.current && isSelected) {
      const rect = cellRef.current.getBoundingClientRect();
      const parentRect = cellRef.current.closest('.calendar-grid')?.getBoundingClientRect();
      if (parentRect) {
        const cellCenter = rect.left + rect.width / 2;
        const parentCenter = parentRect.left + parentRect.width / 2;
        const threshold = parentRect.width * 0.25;

        if (cellCenter < parentCenter - threshold) {
          setPopoverPosition('left');
        } else if (cellCenter > parentCenter + threshold) {
          setPopoverPosition('right');
        } else {
          setPopoverPosition('center');
        }
      }
    }
  }, [isSelected]);

  const popoverClasses = cn(
    'absolute top-full mt-2 w-56 glass-dropdown rounded-2xl p-3 z-50',
    popoverPosition === 'left' && 'left-0',
    popoverPosition === 'right' && 'right-0',
    popoverPosition === 'center' && 'left-1/2 -translate-x-1/2'
  );

  return (
    <div className="relative" ref={cellRef}>
      <button
        onClick={onSelect}
        onDoubleClick={onSchedule}
        className={cn(
          'w-full h-[72px] p-3 rounded-lg transition-all flex flex-col items-start justify-start',
          'hover:bg-white/60 dark:hover:bg-white/10',
          !isCurrentMonth && 'opacity-40',
          today && 'ring-2 ring-mint/50 bg-mint/5',
          isSelected && !today && 'bg-mint/10 ring-1 ring-mint/40'
        )}
      >
        <span className={cn(
          'text-sm font-medium leading-none',
          today ? 'text-mint' : 'text-text-primary'
        )}>
          {date.getDate()}
        </span>

        {hasAppointments && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {appointments.slice(0, 3).map((appt) => (
              <div
                key={appt.id}
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  appointmentTypeColors[appt.type]
                )}
              />
            ))}
            {appointments.length > 3 && (
              <span className="text-[9px] text-text-muted leading-none">
                +{appointments.length - 3}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Popover for selected day */}
      <AnimatePresence>
        {isSelected && hasAppointments && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={popoverClasses}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary">
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSchedule();
                }}
                className="p-1.5 rounded-lg text-mint hover:bg-mint/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {appointments.map((appt) => (
                <button
                  key={appt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppointmentClick(appt);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      appointmentTypeColors[appt.type]
                    )} />
                    <span className="text-xs text-text-muted">
                      {new Date(appt.scheduledFor).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary truncate pl-4">
                    {appt.referralName}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppointmentCalendar({
  appointments,
  currentMonth,
  onMonthChange,
  onDateSelect,
  onAppointmentClick,
  onScheduleClick,
  selectedDate,
}: AppointmentCalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = getCalendarDays(year, month);

  const goToPreviousMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
    onDateSelect(today);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <h2 className="text-xl font-semibold text-text-primary min-w-[180px] text-center">
            {formatMonthYear(currentMonth)}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-text-primary" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-all"
          >
            Today
          </button>
          <button
            onClick={() => onScheduleClick()}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-mint hover:bg-mint/90 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-vista-blue" />
          <span>Phone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span>In-Person</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-mint" />
          <span>Consent</span>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-text-muted py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 calendar-grid">
        {days.map((date, index) => {
          if (!date) return <div key={index} />;

          const isCurrentMonth = date.getMonth() === month;
          const dayAppointments = getAppointmentsForDay(appointments, date);
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

          return (
            <DayCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              appointments={dayAppointments}
              isSelected={isSelected}
              onSelect={() => onDateSelect(date)}
              onSchedule={() => onScheduleClick(date)}
              onAppointmentClick={onAppointmentClick}
            />
          );
        })}
      </div>
    </div>
  );
}
