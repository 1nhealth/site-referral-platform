'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Keyboard,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MatchCard } from './MatchCard';
import { formatDate } from '@/lib/utils/matching';
import type { Referral } from '@/lib/types';
import type {
  IRTRecord,
  ReconciliationMatch,
  MatchCandidate,
} from '@/lib/types/reconciliation';

interface MatchingWizardProps {
  irtRecords: IRTRecord[];
  currentIndex: number;
  matches: ReconciliationMatch[];
  matchCandidates: MatchCandidate[];
  onSelectMatch: (referralId: string | null, referral?: Referral) => void;
  onNoMatch: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoToRecord: (index: number) => void;
  onComplete: () => void;
  onReset: () => void;
}

export function MatchingWizard({
  irtRecords,
  currentIndex,
  matches,
  matchCandidates,
  onSelectMatch,
  onNoMatch,
  onPrev,
  onNext,
  onGoToRecord,
  onComplete,
  onReset,
}: MatchingWizardProps) {
  const currentRecord = irtRecords[currentIndex];
  const totalRecords = irtRecords.length;

  // Check if current record is already matched
  const currentMatch = useMemo(() => {
    return matches.find((m) => m.irtRecord.id === currentRecord?.id);
  }, [matches, currentRecord]);

  // Progress stats
  const progressStats = useMemo(() => {
    const matched = matches.filter((m) => m.referralId !== null).length;
    const noMatch = matches.filter((m) => m.referralId === null).length;
    const pending = totalRecords - matched - noMatch;
    const percentage = Math.round((matches.length / totalRecords) * 100);

    return { matched, noMatch, pending, percentage };
  }, [matches, totalRecords]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if in input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          onNoMatch();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          e.preventDefault();
          const idx = parseInt(e.key) - 1;
          if (matchCandidates[idx]) {
            onSelectMatch(
              matchCandidates[idx].referralId,
              matchCandidates[idx].referral
            );
          }
          break;
      }
    },
    [onPrev, onNext, onNoMatch, onSelectMatch, matchCandidates]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentRecord) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-muted">No records to match</p>
      </div>
    );
  }

  const isLastRecord = currentIndex === totalRecords - 1;
  const allProcessed = matches.length === totalRecords;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Record {currentIndex + 1} of {totalRecords}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              {progressStats.matched} matched
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <XCircle className="w-4 h-4" />
              {progressStats.noMatch} no match
            </span>
            <span className="text-text-muted">
              {progressStats.pending} remaining
            </span>
          </div>
        </div>
        <div className="h-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-mint rounded-full transition-all duration-300"
            style={{ width: `${progressStats.percentage}%` }}
          />
        </div>
      </div>

      {/* Current IRT Record */}
      <div className="glass-card-inset rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-text-primary">
                {currentRecord.subjectId}
              </h3>
              {currentMatch && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${
                    currentMatch.referralId
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {currentMatch.referralId ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Matched
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      No Match
                    </>
                  )}
                </span>
              )}
            </div>
            <p className="text-sm text-text-muted mt-1">IRT Record Details</p>
          </div>

          {/* Record navigation dots */}
          <div className="flex items-center gap-1">
            {irtRecords.slice(Math.max(0, currentIndex - 3), currentIndex + 4).map((record, idx) => {
              const actualIndex = Math.max(0, currentIndex - 3) + idx;
              const isMatched = matches.some((m) => m.irtRecord.id === record.id);
              const isCurrent = actualIndex === currentIndex;

              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onGoToRecord(actualIndex)}
                  className={`
                    w-2.5 h-2.5 rounded-full transition-all
                    ${isCurrent ? 'w-6 bg-mint' : isMatched ? 'bg-emerald-500/50' : 'bg-slate-300 dark:bg-slate-600'}
                  `}
                  title={`Go to record ${actualIndex + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Record fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              Date of Birth
            </p>
            <p className="font-medium text-text-primary">
              {formatDate(currentRecord.dateOfBirth)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              ICF Date
            </p>
            <p className="font-medium text-text-primary">
              {formatDate(currentRecord.icfSignDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              Enrollment Date
            </p>
            <p className="font-medium text-text-primary">
              {formatDate(currentRecord.enrollmentDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              Initials / Name
            </p>
            <p className="font-medium text-text-primary">
              {currentRecord.firstName && currentRecord.lastName
                ? `${currentRecord.firstName} ${currentRecord.lastName}`
                : currentRecord.initials || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Match Candidates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-text-primary">
            Potential Matches ({matchCandidates.length})
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Keyboard className="w-3.5 h-3.5" />
            Press 1-5 to quick select
          </div>
        </div>

        {matchCandidates.length > 0 ? (
          <div className="space-y-3">
            {matchCandidates.slice(0, 5).map((candidate, idx) => (
              <motion.div
                key={candidate.referralId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <MatchCard
                  candidate={candidate}
                  rank={idx + 1}
                  isSelected={currentMatch?.referralId === candidate.referralId}
                  onSelect={() =>
                    onSelectMatch(candidate.referralId, candidate.referral)
                  }
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card-inset rounded-xl p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <p className="font-medium text-text-primary">
              No matching referrals found
            </p>
            <p className="text-sm text-text-muted mt-1">
              This may be a new enrollment not yet in our system
            </p>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={onReset}
              className="mt-4"
            >
              Start Over
            </Button>
          </div>
        )}

        {/* No match button */}
        <div className="mt-4">
          <Button
            variant="ghost"
            className="w-full justify-center"
            leftIcon={<XCircle className="w-4 h-4" />}
            onClick={onNoMatch}
            disabled={currentMatch?.referralId === null}
          >
            Mark as No Match (N)
          </Button>
        </div>
      </div>

      {/* Dotted divider */}
      <div className="dotted-divider" />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {allProcessed && (
            <Button variant="primary" onClick={onComplete}>
              View Summary
            </Button>
          )}
          {!isLastRecord && (
            <Button
              variant="secondary"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={onNext}
            >
              {currentMatch ? 'Next' : 'Skip'}
            </Button>
          )}
          {isLastRecord && !allProcessed && (
            <Button variant="secondary" onClick={onComplete}>
              Continue to Summary
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
