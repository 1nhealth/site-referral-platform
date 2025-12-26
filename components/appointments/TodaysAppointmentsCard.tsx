'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { AppointmentCard } from './AppointmentCard';
import type { Appointment } from '@/lib/types';

interface TodaysAppointmentsCardProps {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
}

function isNow(date: string): boolean {
  const appointmentTime = new Date(date);
  const now = new Date();
  const diffMinutes = Math.abs(appointmentTime.getTime() - now.getTime()) / (1000 * 60);
  return diffMinutes < 30;
}

function isNext(appointments: Appointment[], appointment: Appointment): boolean {
  const now = new Date();
  const upcoming = appointments
    .filter(a => new Date(a.scheduledFor) > now)
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  return upcoming[0]?.id === appointment.id;
}

export function TodaysAppointmentsCard({
  appointments,
  onAppointmentClick,
  onReschedule,
  onCancel,
}: TodaysAppointmentsCardProps) {
  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-mint" />
          <h3 className="text-lg font-semibold text-text-primary">Today</h3>
        </div>
        {appointments.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-mint/10 text-mint text-sm font-medium">
            {appointments.length}
          </span>
        )}
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          type="no-appointments"
          title="No appointments today"
          description="Your schedule is clear"
          className="py-6"
        />
      ) : (
        <div className="space-y-1">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AppointmentCard
                appointment={appointment}
                variant="compact"
                onClick={onAppointmentClick}
                onReschedule={onReschedule}
                onCancel={onCancel}
                isHighlighted={isNow(appointment.scheduledFor) || isNext(appointments, appointment)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
