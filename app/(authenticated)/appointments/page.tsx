'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, CalendarDays } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import {
  AppointmentCalendar,
  AppointmentScheduleModal,
  TodaysAppointmentsCard,
  PastDueCard,
  WeekOverviewCard,
} from '@/components/appointments';
import {
  mockAppointments,
  getTodaysAppointments,
  getPastDueAppointments,
  getWeeklyStats,
  getAppointmentsForMonth,
} from '@/lib/mock-data/appointments';
import type { Appointment } from '@/lib/types';

export default function AppointmentsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDefaultDate, setScheduleDefaultDate] = useState<Date | undefined>();

  // Get appointments data
  const todaysAppointments = useMemo(() => getTodaysAppointments(), []);
  const pastDueAppointments = useMemo(() => getPastDueAppointments(), []);
  const weeklyStats = useMemo(() => getWeeklyStats(), []);
  const monthAppointments = useMemo(
    () => getAppointmentsForMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  // Handlers
  const handleScheduleClick = (date?: Date) => {
    setSelectedAppointment(null);
    setScheduleDefaultDate(date);
    setIsScheduleModalOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsScheduleModalOpen(true);
  };

  const handleReschedule = (id: string) => {
    const appointment = mockAppointments.find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsScheduleModalOpen(true);
    }
  };

  const handleCancel = (id: string) => {
    // In a real app, this would call an API
    console.log('Cancel appointment:', id);
  };

  const handleMarkComplete = (id: string) => {
    // In a real app, this would call an API
    console.log('Mark complete:', id);
  };

  const handleSaveAppointment = (data: {
    referralId: string;
    referralName: string;
    studyId: string;
    studyName: string;
    scheduledFor: string;
    type: Appointment['type'];
    notes?: string;
  }) => {
    // In a real app, this would call an API
    console.log('Save appointment:', data);
  };

  const handleDeleteAppointment = (id: string) => {
    // In a real app, this would call an API
    console.log('Delete appointment:', id);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    // Update month if clicking a day from a different month
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <CalendarDays className="w-7 h-7 text-mint" />
              Appointments
            </h1>
            <p className="text-text-secondary mt-1">
              Manage your scheduled appointments and calendar
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleScheduleClick()}
          >
            Schedule Appointment
          </Button>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <GlassCard padding="lg">
              <AppointmentCalendar
                appointments={monthAppointments}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                onDateSelect={handleDayClick}
                onAppointmentClick={handleAppointmentClick}
                onScheduleClick={handleScheduleClick}
                selectedDate={selectedDate}
              />
            </GlassCard>
          </motion.div>

          {/* Right Column - List Cards */}
          <div className="space-y-6">
            {/* Today's Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <TodaysAppointmentsCard
                appointments={todaysAppointments}
                onAppointmentClick={handleAppointmentClick}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            </motion.div>

            {/* Past Due */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <PastDueCard
                appointments={pastDueAppointments}
                onReschedule={handleReschedule}
                onMarkComplete={handleMarkComplete}
                onCancel={handleCancel}
              />
            </motion.div>

            {/* Week Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <WeekOverviewCard
                stats={weeklyStats}
                onDayClick={handleDayClick}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <AppointmentScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedAppointment(null);
          setScheduleDefaultDate(undefined);
        }}
        appointment={selectedAppointment}
        defaultDate={scheduleDefaultDate}
        onSave={handleSaveAppointment}
        onDelete={handleDeleteAppointment}
      />
    </>
  );
}
