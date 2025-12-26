'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Clock,
  User,
  Search,
  ChevronDown,
  Check,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types';
import { mockReferrals } from '@/lib/mock-data/referrals';
import { mockStudies } from '@/lib/mock-data/studies';

interface AppointmentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  defaultDate?: Date;
  onSave: (data: AppointmentFormData) => void;
  onDelete?: (appointmentId: string) => void;
}

interface AppointmentFormData {
  referralId: string;
  referralName: string;
  studyId: string;
  studyName: string;
  scheduledFor: string;
  type: Appointment['type'];
  notes?: string;
}

const appointmentTypes = [
  { value: 'phone_screen' as const, label: 'Phone Screen', icon: Phone, color: 'text-vista-blue', bgColor: 'bg-vista-blue/10' },
  { value: 'in_person_screen' as const, label: 'In-Person Screen', icon: MapPin, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { value: 'consent_visit' as const, label: 'Consent Visit', icon: FileText, color: 'text-mint', bgColor: 'bg-mint/10' },
];

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTimeForInput(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

export function AppointmentScheduleModal({
  isOpen,
  onClose,
  appointment,
  defaultDate,
  onSave,
  onDelete,
}: AppointmentScheduleModalProps) {
  const [mounted, setMounted] = useState(false);
  const [referralSearch, setReferralSearch] = useState('');
  const [showReferralDropdown, setShowReferralDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!appointment;

  // Form state
  const [formData, setFormData] = useState<{
    referralId: string;
    referralName: string;
    studyId: string;
    studyName: string;
    date: string;
    time: string;
    type: Appointment['type'];
    notes: string;
  }>({
    referralId: '',
    referralName: '',
    studyId: '',
    studyName: '',
    date: '',
    time: '09:00',
    type: 'phone_screen',
    notes: '',
  });

  // Initialize form with appointment data or defaults
  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        const appointmentDate = new Date(appointment.scheduledFor);
        setFormData({
          referralId: appointment.referralId,
          referralName: appointment.referralName,
          studyId: appointment.studyId,
          studyName: appointment.studyName,
          date: formatDateForInput(appointmentDate),
          time: formatTimeForInput(appointmentDate),
          type: appointment.type,
          notes: appointment.notes || '',
        });
        setReferralSearch(appointment.referralName);
      } else {
        const date = defaultDate || new Date();
        setFormData({
          referralId: '',
          referralName: '',
          studyId: '',
          studyName: '',
          date: formatDateForInput(date),
          time: '09:00',
          type: 'phone_screen',
          notes: '',
        });
        setReferralSearch('');
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, appointment, defaultDate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredReferrals = mockReferrals.filter(
    (r) =>
      r.firstName.toLowerCase().includes(referralSearch.toLowerCase()) ||
      r.lastName.toLowerCase().includes(referralSearch.toLowerCase())
  );

  const handleSelectReferral = (referral: typeof mockReferrals[0]) => {
    const study = mockStudies.find((s) => s.id === referral.studyId);
    setFormData({
      ...formData,
      referralId: referral.id,
      referralName: `${referral.firstName} ${referral.lastName}`,
      studyId: referral.studyId,
      studyName: study?.name || '',
    });
    setReferralSearch(`${referral.firstName} ${referral.lastName}`);
    setShowReferralDropdown(false);
  };

  const handleSubmit = () => {
    if (!formData.referralId || !formData.date || !formData.time) {
      return;
    }

    const scheduledFor = new Date(`${formData.date}T${formData.time}`).toISOString();

    onSave({
      referralId: formData.referralId,
      referralName: formData.referralName,
      studyId: formData.studyId,
      studyName: formData.studyName,
      scheduledFor,
      type: formData.type,
      notes: formData.notes || undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    if (appointment && onDelete) {
      onDelete(appointment.id);
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-9998"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-6 top-6 bottom-6 w-[420px] glass-modal-panel z-9999 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {isEditing ? 'Edit Appointment' : 'Schedule Appointment'}
                </h2>
                <p className="text-sm text-text-secondary">
                  {isEditing ? 'Update appointment details' : 'Set up a new appointment'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-text-secondary hover:text-text-primary glass-button hover:scale-105 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header divider */}
            <div className="mx-6 py-2">
              <div
                className="h-px"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
                  backgroundSize: '8px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Referral Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                  <User className="w-4 h-4 text-text-muted" />
                  Referral
                </label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={referralSearch}
                      onChange={(e) => {
                        setReferralSearch(e.target.value);
                        setShowReferralDropdown(true);
                      }}
                      onFocus={() => setShowReferralDropdown(true)}
                      placeholder="Search referrals..."
                      className={cn(
                        'w-full pl-10 pr-4 py-2.5 rounded-xl',
                        'bg-white/80 dark:bg-slate-800/60',
                        'border border-white/90 dark:border-slate-700/50',
                        'focus:ring-2 focus:ring-mint/40 focus:outline-none',
                        'text-text-primary placeholder:text-text-muted text-sm'
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {showReferralDropdown && filteredReferrals.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 glass-dropdown rounded-2xl max-h-48 overflow-y-auto overflow-hidden z-50"
                      >
                        {filteredReferrals.slice(0, 6).map((referral) => (
                          <button
                            key={referral.id}
                            onClick={() => handleSelectReferral(referral)}
                            className={cn(
                              'w-full px-4 py-2.5 text-left flex items-center gap-3',
                              'hover:bg-white/50 dark:hover:bg-white/10 transition-colors',
                              formData.referralId === referral.id && 'bg-mint/10'
                            )}
                          >
                            <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center text-mint text-xs font-semibold">
                              {referral.firstName[0]}{referral.lastName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">
                                {referral.firstName} {referral.lastName}
                              </p>
                              <p className="text-xs text-text-muted truncate">
                                {mockStudies.find((s) => s.id === referral.studyId)?.name}
                              </p>
                            </div>
                            {formData.referralId === referral.id && (
                              <Check className="w-4 h-4 text-mint shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {formData.studyName && (
                  <p className="text-xs text-text-muted ml-6">
                    Study: {formData.studyName}
                  </p>
                )}
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Appointment Type
                </label>
                <div className="flex gap-2">
                  {appointmentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={cn(
                          'flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all',
                          'border',
                          isSelected
                            ? `${type.bgColor} border-current ${type.color}`
                            : 'bg-white/50 dark:bg-white/5 border-transparent hover:bg-white/80 dark:hover:bg-white/10'
                        )}
                      >
                        <div className={cn('p-2 rounded-lg', type.bgColor)}>
                          <Icon className={cn('w-4 h-4', type.color)} />
                        </div>
                        <span className={cn(
                          'text-xs font-medium',
                          isSelected ? type.color : 'text-text-secondary'
                        )}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl',
                      'bg-white/80 dark:bg-slate-800/60',
                      'border border-white/90 dark:border-slate-700/50',
                      'focus:ring-2 focus:ring-mint/40 focus:outline-none',
                      'text-text-primary text-sm'
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    <Clock className="w-4 h-4 text-text-muted" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl',
                      'bg-white/80 dark:bg-slate-800/60',
                      'border border-white/90 dark:border-slate-700/50',
                      'focus:ring-2 focus:ring-mint/40 focus:outline-none',
                      'text-text-primary text-sm'
                    )}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes about this appointment..."
                  rows={3}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl resize-none',
                    'bg-white/80 dark:bg-slate-800/60',
                    'border border-white/90 dark:border-slate-700/50',
                    'focus:ring-2 focus:ring-mint/40 focus:outline-none',
                    'text-text-primary placeholder:text-text-muted text-sm'
                  )}
                />
              </div>

              {/* Delete Confirmation */}
              {isEditing && showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-lg bg-error/10 border border-error/20"
                >
                  <p className="text-sm text-text-primary mb-3">
                    Are you sure you want to delete this appointment?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-text-primary glass-button rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-error hover:bg-error/90 rounded-full"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer divider */}
            <div className="mx-6 py-2">
              <div
                className="h-px"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
                  backgroundSize: '8px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-between">
              {isEditing ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-error glass-button rounded-full hover:bg-error/10 hover:scale-105 active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-medium text-text-primary glass-button rounded-full hover:scale-105 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.referralId || !formData.date || !formData.time}
                  className={cn(
                    'px-5 py-1.5 text-xs font-medium text-white rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all',
                    formData.referralId && formData.date && formData.time
                      ? 'bg-[linear-gradient(135deg,#36A67E_0%,#2E9B73_50%,#1F7A58_100%)] hover:bg-[linear-gradient(135deg,#4AC498_0%,#36A67E_50%,#2E9B73_100%)]'
                      : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  )}
                >
                  {isEditing ? 'Update' : 'Schedule'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
