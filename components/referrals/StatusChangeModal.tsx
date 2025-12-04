'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import type { ReferralStatus } from '@/lib/types';
import { statusConfigs } from '@/lib/types';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: ReferralStatus;
  onConfirm: (newStatus: ReferralStatus, note?: string) => void;
  referralName: string;
}

const statusOrder: ReferralStatus[] = [
  'new',
  'attempt_1',
  'attempt_2',
  'attempt_3',
  'attempt_4',
  'attempt_5',
  'sent_sms',
  'appointment_scheduled',
  'phone_screen_failed',
  'not_interested',
  'signed_icf',
];

export function StatusChangeModal({
  isOpen,
  onClose,
  currentStatus,
  onConfirm,
  referralName,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReferralStatus | null>(null);
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus, note.trim() || undefined);
      setSelectedStatus(null);
      setNote('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Status"
      size="md"
    >
      <div className="space-y-6">
        <p className="text-text-secondary">
          Change status for <span className="font-medium text-text-primary">{referralName}</span>
        </p>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-2">
          {statusOrder.map((status) => {
            const config = statusConfigs[status];
            const isSelected = selectedStatus === status;
            const isCurrent = currentStatus === status;

            return (
              <motion.button
                key={status}
                onClick={() => !isCurrent && setSelectedStatus(status)}
                disabled={isCurrent}
                className={`
                  relative p-3 rounded-xl text-left transition-all
                  ${isCurrent
                    ? 'opacity-50 cursor-not-allowed bg-bg-tertiary'
                    : isSelected
                    ? 'ring-2 ring-mint bg-mint/10'
                    : 'hover:bg-bg-tertiary'
                  }
                `}
                whileHover={!isCurrent ? { scale: 1.02 } : undefined}
                whileTap={!isCurrent ? { scale: 0.98 } : undefined}
              >
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass}`}
                >
                  {config.label}
                </span>
                {isCurrent && (
                  <span className="absolute top-2 right-2 text-xs text-text-muted">
                    Current
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Note Input */}
        {selectedStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Textarea
              label="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add context for this status change..."
              rows={3}
            />
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-glass-border">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedStatus}
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
