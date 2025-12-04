'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { useToastActions } from '@/components/ui/Toast';
import { ContactInfoCard } from '@/components/referrals/ContactInfoCard';
import { SMSPanel } from '@/components/referrals/SMSPanel';
import { NotesPanel } from '@/components/referrals/NotesPanel';
import { ReferralTimeline, buildTimelineEvents } from '@/components/referrals/ReferralTimeline';
import { AppointmentsPanel } from '@/components/referrals/AppointmentsPanel';
import { StatusChangeModal } from '@/components/referrals/StatusChangeModal';
import { mockReferrals } from '@/lib/mock-data/referrals';
import { mockStudies } from '@/lib/mock-data/studies';
import { mockUsers } from '@/lib/mock-data/users';
import { getAppointmentsByReferral } from '@/lib/mock-data/appointments';
import { getActivityByReferral } from '@/lib/mock-data/activity';
import { statusConfigs, type ReferralStatus, type Note, type Message, type Referral } from '@/lib/types';

export default function ReferralDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToastActions();
  const referralId = params.id as string;

  // Find the referral
  const referral = mockReferrals.find((r) => r.id === referralId);

  // Local state for demo purposes
  const [localReferral, setLocalReferral] = useState<Referral | null>(referral || null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (!localReferral) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-text-secondary mb-4">Referral not found</p>
        <Button variant="secondary" onClick={() => router.push('/referrals')}>
          Back to Referrals
        </Button>
      </div>
    );
  }

  const study = mockStudies.find((s) => s.id === localReferral.studyId);
  const assignedUser = localReferral.assignedTo
    ? mockUsers.find((u) => u.id === localReferral.assignedTo)
    : null;
  const statusConfig = statusConfigs[localReferral.status];
  const currentUser = mockUsers[0]; // Sarah Chen

  // Get appointments and activity for this referral
  const appointments = getAppointmentsByReferral(referralId);
  const activities = getActivityByReferral(referralId);

  // Build timeline events
  const timelineEvents = useMemo(
    () =>
      buildTimelineEvents(
        activities,
        localReferral.notes,
        localReferral.messages,
        appointments
      ),
    [activities, localReferral.notes, localReferral.messages, appointments]
  );

  // Handlers
  const handleStatusChange = (newStatus: ReferralStatus, note?: string) => {
    setLocalReferral((prev) => {
      if (!prev) return prev;
      const updatedReferral = { ...prev, status: newStatus };
      if (note) {
        const newNote: Note = {
          id: `note-${Date.now()}`,
          referralId: prev.id,
          authorId: currentUser.id,
          authorName: `${currentUser.firstName} ${currentUser.lastName}`,
          content: `Status changed to ${statusConfigs[newStatus].label}${note ? `: ${note}` : ''}`,
          createdAt: new Date().toISOString(),
        };
        updatedReferral.notes = [newNote, ...prev.notes];
      }
      return updatedReferral;
    });
    toast.success('Status updated', `Changed to ${statusConfigs[newStatus].label}`);
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      referralId: localReferral.id,
      direction: 'outbound',
      content,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    setLocalReferral((prev) => {
      if (!prev) return prev;
      return { ...prev, messages: [...prev.messages, newMessage] };
    });
    toast.success('Message sent');
  };

  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      referralId: localReferral.id,
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      content,
      createdAt: new Date().toISOString(),
    };
    setLocalReferral((prev) => {
      if (!prev) return prev;
      return { ...prev, notes: [newNote, ...prev.notes] };
    });
    toast.success('Note added');
  };

  const handleEditNote = (noteId: string, content: string) => {
    setLocalReferral((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === noteId ? { ...n, content } : n
        ),
      };
    });
    toast.success('Note updated');
  };

  const handleDeleteNote = (noteId: string) => {
    setLocalReferral((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: prev.notes.filter((n) => n.id !== noteId),
      };
    });
    toast.success('Note deleted');
  };

  const handleScheduleAppointment = () => {
    toast.info('Coming soon', 'Appointment scheduling will be available in a future update');
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    toast.info('Coming soon', 'Appointment rescheduling will be available in a future update');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    toast.info('Coming soon', 'Appointment cancellation will be available in a future update');
  };

  return (
    <>
      <StatusChangeModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={localReferral.status}
        onConfirm={handleStatusChange}
        referralName={`${localReferral.firstName} ${localReferral.lastName}`}
      />

      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/referrals')}
              className="!p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-4">
              <Avatar
                firstName={localReferral.firstName}
                lastName={localReferral.lastName}
                size="xl"
              />
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">
                  {localReferral.firstName} {localReferral.lastName}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-text-secondary">{study?.name}</span>
                  <span className="text-text-muted">•</span>
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${statusConfig.bgClass} ${statusConfig.textClass} hover:opacity-80 transition-opacity`}
                  >
                    {statusConfig.label}
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                {assignedUser && (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar
                      firstName={assignedUser.firstName}
                      lastName={assignedUser.lastName}
                      size="xs"
                    />
                    <span className="text-sm text-text-muted">
                      Assigned to {assignedUser.firstName} {assignedUser.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<Phone className="w-4 h-4" />}
            >
              Call
            </Button>
            <Button
              variant="secondary"
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              SMS
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Calendar className="w-4 h-4" />}
              onClick={handleScheduleAppointment}
            >
              Schedule
            </Button>
          </div>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - 3/5 width */}
          <div className="lg:col-span-3 space-y-6">
            {/* SMS Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SMSPanel
                messages={localReferral.messages}
                onSend={handleSendMessage}
                referralName={`${localReferral.firstName} ${localReferral.lastName}`}
              />
            </motion.div>

            {/* Notes Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <NotesPanel
                notes={localReferral.notes}
                onAdd={handleAddNote}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                currentUserId={currentUser.id}
              />
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ReferralTimeline events={timelineEvents} />
            </motion.div>
          </div>

          {/* Right Column - 2/5 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ContactInfoCard referral={localReferral} />
            </motion.div>

            {/* Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <AppointmentsPanel
                appointments={appointments}
                onSchedule={handleScheduleAppointment}
                onReschedule={handleRescheduleAppointment}
                onCancel={handleCancelAppointment}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
