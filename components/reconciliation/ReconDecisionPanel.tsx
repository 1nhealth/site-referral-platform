'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { reconStatusOptions } from '@/lib/mock-data/reconciliation';
import type {
  PotentialMatch,
  IRTSubject,
  ReconStatusType,
  MatchDecision,
} from '@/lib/types/reconciliation';

interface ReconDecisionPanelProps {
  isOpen: boolean;
  match: PotentialMatch | null;
  subject: IRTSubject | null;
  onClose: () => void;
  onSubmit: (decision: MatchDecision) => void;
}

export function ReconDecisionPanel({
  isOpen,
  match,
  subject,
  onClose,
  onSubmit,
}: ReconDecisionPanelProps) {
  const [reconStatus, setReconStatus] = useState<ReconStatusType>('ICF');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!match) return;

    onSubmit({
      decision: 'confirmed',
      reconStatus,
      invoiceDate: invoiceDate || undefined,
      notes: notes || undefined,
      match,
    });

    // Reset form
    setReconStatus('ICF');
    setInvoiceDate('');
    setNotes('');
  };

  const handleClose = () => {
    // Reset form
    setReconStatus('ICF');
    setInvoiceDate('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && match && subject && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50
              bg-bg-secondary/95 backdrop-blur-xl
              border-l border-white/20 shadow-2xl
              overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Confirm Match</h3>
                <motion.button
                  onClick={handleClose}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-text-muted" />
                </motion.button>
              </div>

              {/* Match Summary */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Confirming Match
                  </span>
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  <span className="font-medium">{subject.subjectId}</span>
                  {' → '}
                  <span className="font-medium">
                    {match.firstName} {match.lastName}
                  </span>
                </p>
              </div>

              {/* Recon Status */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Reconciliation Status *
                </label>
                <div className="space-y-2">
                  {reconStatusOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all
                        ${
                          reconStatus === option.value
                            ? 'bg-mint/10 border-mint/30'
                            : 'bg-white/30 dark:bg-white/5 border-white/20 hover:bg-white/40 dark:hover:bg-white/10'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="reconStatus"
                        value={option.value}
                        checked={reconStatus === option.value}
                        onChange={(e) => setReconStatus(e.target.value as ReconStatusType)}
                        className="mt-0.5 text-mint focus:ring-mint"
                      />
                      <div>
                        <span className="text-sm font-medium text-text-primary">
                          {option.label}
                        </span>
                        <p className="text-xs text-text-muted mt-0.5">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Invoice Date */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Invoice Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl
                      bg-white/50 dark:bg-white/10
                      border border-white/50 dark:border-white/10
                      text-text-primary text-sm
                      placeholder:text-text-muted
                      focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
                      transition-all"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes about this decision..."
                  className="w-full px-4 py-3 rounded-xl resize-none
                    bg-white/50 dark:bg-white/10
                    border border-white/50 dark:border-white/10
                    text-text-primary text-sm
                    placeholder:text-text-muted
                    focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
                    transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button variant="secondary" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleSubmit}>
                  Confirm & Next
                </Button>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="text-center text-xs text-text-muted">
                <p>
                  Keyboard shortcuts:{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-text-secondary">C</kbd>{' '}
                  Confirm •{' '}
                  <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-text-secondary">
                    R
                  </kbd>{' '}
                  Reject
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
