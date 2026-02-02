'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { mockSubjects } from '@/lib/mock-data/reconciliation';
import type { IRTSubject, PotentialMatch, MatchConfidence } from '@/lib/types/reconciliation';

interface OtherSubjectMatchInfo {
  subjectId: string;
  confidence: MatchConfidence;
}

interface ReconSubjectModalProps {
  isOpen: boolean;
  subjectId: string | null;
  currentLead: PotentialMatch | null;
  matchInfo: OtherSubjectMatchInfo | null;
  onClose: () => void;
  onConfirm: (subject: IRTSubject, lead: PotentialMatch) => void;
  onReject: (subject: IRTSubject, lead: PotentialMatch) => void;
  onNavigateToSubject?: (subject: IRTSubject) => void;
}

const confidenceConfig: Record<MatchConfidence, { label: string; variant: string; description: string }> = {
  highly: {
    label: 'HIGHLY LIKELY',
    variant: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    description: 'Strong match based on multiple criteria',
  },
  maybe: {
    label: 'MAYBE',
    variant: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    description: 'Partial match, requires manual review',
  },
  low: {
    label: 'LOW',
    variant: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    description: 'Weak match, likely not the same person',
  },
};

export function ReconSubjectModal({
  isOpen,
  subjectId,
  currentLead,
  matchInfo,
  onClose,
  onConfirm,
  onReject,
  onNavigateToSubject,
}: ReconSubjectModalProps) {
  // Find the subject by subjectId (e.g., "3525-007")
  const subject = mockSubjects.find((s) => s.subjectId === subjectId);
  const confidence = matchInfo?.confidence || 'low';
  const confidenceInfo = confidenceConfig[confidence];

  const StatusBadge = ({ status }: { status: string }) => {
    const getVariant = () => {
      if (status === 'Randomized' || status === 'Enrolled') {
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      }
      if (status === 'Screen Failed') {
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      }
      return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getVariant()}`}
      >
        {status}
      </span>
    );
  };

  const ConfidenceBadge = ({ conf }: { conf: MatchConfidence }) => {
    const config = confidenceConfig[conf];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${config.variant}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    Other Subject Match
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5">
                    Review this lead&apos;s match with another subject
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-text-muted" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                {!subject ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <p className="text-text-muted">Subject not found</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Confidence Warning */}
                    <div className={`p-4 rounded-2xl border ${confidenceInfo.variant}`}>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Match Confidence:</span>
                            <ConfidenceBadge conf={confidence} />
                          </div>
                          <p className="text-sm mt-1 opacity-80">{confidenceInfo.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subject Info Card */}
                    <GlassCard
                      variant="elevated"
                      padding="lg"
                      animate={false}
                      className="bg-gradient-to-r from-vista-blue/5 to-transparent border-vista-blue/20"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs uppercase tracking-wider text-text-muted">Subject Record</span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-xl font-semibold text-text-primary">
                          {subject.subjectId}
                        </h4>
                        <StatusBadge status={subject.status} />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-text-muted">Site</p>
                          <p className="mt-1 text-sm font-medium text-text-primary">
                            {subject.siteName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-text-muted">ICF Date</p>
                          <p className="mt-1 text-sm font-medium text-text-primary">
                            {subject.icfDate || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-text-muted">Age</p>
                          <p className="mt-1 text-sm font-medium text-text-primary">
                            {subject.age} years
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-text-muted">Initials</p>
                          <p className="mt-1 text-sm font-medium text-text-primary">
                            {subject.initials}
                          </p>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Lead Info Card */}
                    {currentLead && (
                      <GlassCard
                        variant="elevated"
                        padding="lg"
                        animate={false}
                        className="bg-gradient-to-r from-mint/5 to-transparent border-mint/20"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs uppercase tracking-wider text-text-muted">Lead Record</span>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl font-semibold text-text-primary">
                                {currentLead.firstName} {currentLead.lastName}
                              </h4>
                              <span className="text-text-muted">({currentLead.initials})</span>
                              <StatusBadge status={currentLead.status} />
                            </div>
                            <p className="text-sm text-text-muted mt-1">
                              Lead ID: {currentLead.leadId}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-text-muted">Site</p>
                            <p className="mt-1 text-sm font-medium text-text-primary">
                              {currentLead.siteName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-text-muted">ICF Date</p>
                            <p className="mt-1 text-sm font-medium text-text-primary">
                              {currentLead.icfDate || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-text-muted">Age</p>
                            <p className="mt-1 text-sm font-medium text-text-primary">
                              Born {currentLead.birthYear} (Age {currentLead.age})
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-text-muted">Email</p>
                            <p className="mt-1 text-sm font-medium text-text-primary truncate">
                              {currentLead.email || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Match Criteria Comparison */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs uppercase tracking-wider text-text-muted mb-3">Criteria Comparison</p>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              {subject.siteName === currentLead.siteName ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-sm text-text-secondary">Site Match</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {subject.age === currentLead.age ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-sm text-text-secondary">Age Match</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {subject.icfDate === currentLead.icfDate ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-sm text-text-secondary">ICF Date Match</span>
                            </div>
                          </div>
                        </div>

                        {currentLead.notes && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">Notes</p>
                            <p className="text-sm text-text-secondary">{currentLead.notes}</p>
                          </div>
                        )}
                      </GlassCard>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  {subject && currentLead && (
                    <>
                      <Button
                        variant="danger"
                        leftIcon={<X className="w-4 h-4" />}
                        onClick={() => {
                          onReject(subject, currentLead);
                          onClose();
                        }}
                      >
                        Reject Match
                      </Button>
                      <Button
                        variant="primary"
                        leftIcon={<Check className="w-4 h-4" />}
                        onClick={() => {
                          onConfirm(subject, currentLead);
                          onClose();
                        }}
                      >
                        Confirm Match
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
