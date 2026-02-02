'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ReconProgressRing } from './ReconProgressRing';
import { ReconSubjectModal } from './ReconSubjectModal';
import {
  mockSubjects,
  mockPotentialMatches,
  getPendingSubjects,
} from '@/lib/mock-data/reconciliation';
import type {
  IRTImport,
  IRTSubject,
  PotentialMatch,
  MatchConfidence,
  MatchDecision,
  IRTSubjectMatchStatus,
} from '@/lib/types/reconciliation';

interface ReconSubjectMatcherProps {
  selectedImport: IRTImport | null;
  onBack: () => void;
  onShowDecisionPanel: (match: PotentialMatch) => void;
  decisions: Record<string, MatchDecision>;
  onReject: (subjectId: string, match: PotentialMatch) => void;
  onRemoveDecision: (key: string) => void;
}

type ConfidenceFilter = MatchConfidence | 'all';
type StatusFilter = IRTSubjectMatchStatus | 'all';

const confidenceConfig: Record<MatchConfidence, { label: string; variant: string }> = {
  highly: {
    label: 'HIGHLY',
    variant: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  maybe: {
    label: 'MAYBE',
    variant: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  low: {
    label: 'LOW',
    variant: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  },
};

export function ReconSubjectMatcher({
  selectedImport,
  onBack,
  onShowDecisionPanel,
  decisions,
  onReject,
  onRemoveDecision,
}: ReconSubjectMatcherProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterConfidence, setFilterConfidence] = useState<ConfidenceFilter>('all');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('pending');
  const [viewingSubjectId, setViewingSubjectId] = useState<string | null>(null);
  const [viewingMatchInfo, setViewingMatchInfo] = useState<{ subjectId: string; confidence: MatchConfidence } | null>(null);
  const [viewingLead, setViewingLead] = useState<PotentialMatch | null>(null);

  // Get subjects with pending matches
  const subjects = useMemo(() => {
    return mockSubjects.filter((s) => {
      if (filterStatus === 'all') return s.potentialMatchCount > 0;
      return s.matchStatus === filterStatus && s.potentialMatchCount > 0;
    });
  }, [filterStatus]);

  const currentSubject = subjects[currentIndex];
  const potentialMatches = currentSubject
    ? mockPotentialMatches[currentSubject.id] || []
    : [];

  // Filter matches by confidence
  const filteredMatches = useMemo(() => {
    if (filterConfidence === 'all') return potentialMatches;
    return potentialMatches.filter((m) => m.confidence === filterConfidence);
  }, [potentialMatches, filterConfidence]);

  const handleNext = () => {
    if (currentIndex < subjects.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const ConfidenceBadge = ({ confidence }: { confidence: MatchConfidence }) => {
    const config = confidenceConfig[confidence];
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${config.variant}`}
      >
        {config.label}
      </span>
    );
  };

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

  // All subjects reviewed state
  if (!currentSubject || subjects.length === 0) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" leftIcon={<ChevronLeft className="w-4 h-4" />} onClick={onBack}>
          Back to Imports
        </Button>
        <GlassCard padding="lg" className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-mint mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary">All subjects reviewed!</h3>
          <p className="text-text-secondary mt-2">
            Great work. All potential matches have been processed.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" leftIcon={<ChevronLeft className="w-4 h-4" />} onClick={onBack}>
            Back
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Subject Reconciliation</h2>
            <p className="text-sm text-text-muted">{selectedImport?.fileName}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">
              Subject {currentIndex + 1} of {subjects.length}
            </p>
            <p className="text-xs text-text-muted">
              {Object.keys(decisions).length} decisions made
            </p>
          </div>
          <ReconProgressRing progress={(currentIndex / subjects.length) * 100} size={56} />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center justify-between"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-mint/10 text-mint border border-mint/20">
          <span className="text-text-muted">STATUS:</span>
          {filterStatus === 'all' ? 'All' : 'Pending'}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Filter:</span>
          <div className="relative">
            <select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value as ConfidenceFilter)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-sm font-medium
                bg-white/50 dark:bg-white/10 border border-white/50 dark:border-white/10
                text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50
                cursor-pointer"
            >
              <option value="all">All Confidence</option>
              <option value="highly">Highly Only</option>
              <option value="maybe">Maybe Only</option>
              <option value="low">Low Only</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Subject Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <GlassCard
          variant="elevated"
          padding="lg"
          animate={false}
          className="bg-gradient-to-r from-mint/5 to-transparent border-mint/20"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-text-primary">
                  Subject: {currentSubject.subjectId}
                </h3>
                <StatusBadge status={currentSubject.status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-muted">Site</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {currentSubject.siteName}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-muted">ICF Date</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {currentSubject.icfDate || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-muted">Age</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {currentSubject.age} years
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-muted">Initials</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {currentSubject.initials}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-text-muted">Potential Matches</p>
              <p className="text-3xl font-bold text-mint">{filteredMatches.length}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Potential Matches */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium uppercase tracking-wider text-text-muted">
          Potential Matches
        </h4>

        <AnimatePresence mode="wait">
          {filteredMatches.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard padding="lg" className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-text-muted mx-auto mb-3" />
                <p className="text-text-muted">No matches found with current filters</p>
              </GlassCard>
            </motion.div>
          ) : (
            filteredMatches.map((match, index) => {
              const decisionKey = `${currentSubject.id}-${match.id}`;
              const decision = decisions[decisionKey];
              const isDecided = !!decision;

              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard
                    padding="lg"
                    animate={false}
                    className={`transition-all ${isDecided ? 'opacity-50' : ''}`}
                  >
                    {/* Match Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-text-muted">#{index + 1}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-text-primary">
                              {match.firstName} {match.lastName}
                            </h5>
                            <span className="text-text-muted">({match.initials})</span>
                            <StatusBadge status={match.status} />
                          </div>
                          <p className="text-sm text-text-muted mt-0.5">
                            Lead ID: {match.leadId} • {match.siteName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <ConfidenceBadge confidence={match.confidence} />
                        <span className="text-sm text-text-muted">Score: {match.matchScore}%</span>
                      </div>
                    </div>

                    {/* Match Criteria Table */}
                    <div className="mb-4 rounded-xl bg-white/40 dark:bg-white/5 p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            <th className="pb-2 text-xs font-medium uppercase text-text-muted">
                              Criteria
                            </th>
                            <th className="pb-2 text-xs font-medium uppercase text-text-muted">
                              IRT Value
                            </th>
                            <th className="pb-2 text-xs font-medium uppercase text-text-muted">
                              Lead Value
                            </th>
                            <th className="pb-2 text-xs font-medium uppercase text-text-muted text-center">
                              Match
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          <tr>
                            <td className="py-2 text-text-secondary">Site</td>
                            <td className="py-2 text-text-primary">{currentSubject.siteNumber}</td>
                            <td className="py-2 text-text-primary">{match.siteName}</td>
                            <td className="py-2 text-center">
                              {match.matchedCriteria.site ? (
                                <Check className="w-4 h-4 text-emerald-500 inline" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 inline" />
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-text-secondary">Age</td>
                            <td className="py-2 text-text-primary">{currentSubject.age}</td>
                            <td className="py-2 text-text-primary">
                              Born {match.birthYear} (Age {match.age})
                            </td>
                            <td className="py-2 text-center">
                              {match.matchedCriteria.age ? (
                                <Check className="w-4 h-4 text-emerald-500 inline" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 inline" />
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-text-secondary">ICF Date</td>
                            <td className="py-2 text-text-primary">{currentSubject.icfDate}</td>
                            <td className="py-2 text-text-primary">{match.icfDate || 'N/A'}</td>
                            <td className="py-2 text-center">
                              {match.matchedCriteria.icfDate || match.matchedCriteria.apptToIcf ? (
                                <Check className="w-4 h-4 text-emerald-500 inline" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 inline" />
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Match Type */}
                    <div className="mb-4 flex items-center gap-2 text-sm">
                      <span className="text-text-muted">Match Type:</span>
                      <span className="font-medium text-text-primary">{match.matchType}</span>
                    </div>

                    {/* Other Subject Matches Warning */}
                    {match.otherSubjectMatches.length > 0 && (
                      <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-amber-700 dark:text-amber-400">
                          This lead also matches:{' '}
                          {match.otherSubjectMatches.map((m, idx) => (
                            <span key={m.subjectId}>
                              {idx > 0 && ', '}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingSubjectId(m.subjectId);
                                  setViewingMatchInfo(m);
                                  setViewingLead(match);
                                }}
                                className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
                              >
                                {m.subjectId}
                              </button>
                              <span className="text-amber-600 dark:text-amber-500"> ({m.confidence})</span>
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {/* Notes */}
                    {match.notes && (
                      <div className="mb-4 text-sm text-text-secondary">
                        <span className="font-medium">Notes: </span>
                        {match.notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <Button
                        variant="link"
                        size="sm"
                        rightIcon={<ExternalLink className="w-3 h-3" />}
                      >
                        View Full Lead Details
                      </Button>

                      {isDecided ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              px-2.5 py-1 rounded-full text-xs font-medium border
                              ${
                                decision.decision === 'confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-500 border-red-500/20'
                              }
                            `}
                          >
                            {decision.decision === 'confirmed' ? 'Confirmed' : 'Rejected'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveDecision(decisionKey)}
                          >
                            Undo
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<X className="w-3 h-3" />}
                            onClick={() => onReject(currentSubject.id, match)}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<AlertCircle className="w-3 h-3" />}
                          >
                            Needs Review
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Check className="w-3 h-3" />}
                            onClick={() => onShowDecisionPanel(match)}
                          >
                            Confirm Match
                          </Button>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center justify-between pt-4 border-t border-white/10"
      >
        <Button
          variant="secondary"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous Subject
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Jump to:</span>
          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-sm font-medium
                bg-white/50 dark:bg-white/10 border border-white/50 dark:border-white/10
                text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50
                cursor-pointer"
            >
              <option>Unreviewed</option>
              <option>High Confidence</option>
              <option>Multiple Matches</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>

        <Button
          variant="primary"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          onClick={handleNext}
          disabled={currentIndex === subjects.length - 1}
        >
          Next Subject
        </Button>
      </motion.div>

      {/* Subject Details Modal */}
      <ReconSubjectModal
        isOpen={viewingSubjectId !== null}
        subjectId={viewingSubjectId}
        currentLead={viewingLead}
        matchInfo={viewingMatchInfo}
        onClose={() => {
          setViewingSubjectId(null);
          setViewingMatchInfo(null);
          setViewingLead(null);
        }}
        onConfirm={(subject, lead) => {
          // Add decision for this subject-lead pair
          const key = `${subject.id}-${lead.id}`;
          // Note: This would need to call onShowDecisionPanel or similar
          // For now, we'll just close the modal
          console.log('Confirm match:', subject.subjectId, lead.leadId);
        }}
        onReject={(subject, lead) => {
          // Add rejection for this subject-lead pair
          const key = `${subject.id}-${lead.id}`;
          console.log('Reject match:', subject.subjectId, lead.leadId);
        }}
        onNavigateToSubject={(subject) => {
          // Find the index of this subject and navigate to it
          const idx = subjects.findIndex((s) => s.id === subject.id);
          if (idx !== -1) {
            setCurrentIndex(idx);
          }
        }}
      />
    </div>
  );
}
