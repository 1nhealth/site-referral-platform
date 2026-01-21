'use client';

import { useReducer, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, FileUp, Search, CheckCircle2, ListChecks } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { IRTUpload } from '@/components/reconciliation/IRTUpload';
import { IRTRecordReview } from '@/components/reconciliation/IRTRecordReview';
import { MatchingWizard } from '@/components/reconciliation/MatchingWizard';
import { ReconTotalList } from '@/components/reconciliation/ReconTotalList';
import { mockReferrals, getReferralsByStudy } from '@/lib/mock-data/referrals';
import { findMatches } from '@/lib/utils/matching';
import type { Referral } from '@/lib/types';
import type {
  ReconciliationState,
  ReconciliationAction,
  ReconciliationStep,
  IRTRecord,
  ReconciliationMatch,
  MatchCandidate,
} from '@/lib/types/reconciliation';

// Initial state
const initialState: ReconciliationState = {
  step: 'import',
  selectedStudyId: null,
  fileName: null,
  irtRecords: [],
  matches: [],
  currentIndex: 0,
  isProcessing: false,
};

// Reducer
function reconciliationReducer(
  state: ReconciliationState,
  action: ReconciliationAction
): ReconciliationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_STUDY':
      return { ...state, selectedStudyId: action.studyId };
    case 'IMPORT_RECORDS':
      return {
        ...state,
        irtRecords: action.records,
        fileName: action.fileName,
        step: 'review',
        currentIndex: 0,
        matches: [],
      };
    case 'ADD_MATCH':
      return {
        ...state,
        matches: [...state.matches, action.match],
      };
    case 'REMOVE_MATCH':
      return {
        ...state,
        matches: state.matches.filter((m) => m.irtRecord.id !== action.irtRecordId),
      };
    case 'UPDATE_MATCH':
      return {
        ...state,
        matches: state.matches.map((m) =>
          m.irtRecord.id === action.irtRecordId
            ? { ...m, referralId: action.referralId }
            : m
        ),
      };
    case 'NEXT_RECORD':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.irtRecords.length - 1),
      };
    case 'PREV_RECORD':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };
    case 'GO_TO_RECORD':
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.index, state.irtRecords.length - 1)),
      };
    case 'COMPLETE_SESSION':
      return { ...state, step: 'summary' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Step configuration
const steps: { id: ReconciliationStep; label: string; icon: React.ReactNode }[] = [
  { id: 'import', label: 'Import', icon: <FileUp className="w-4 h-4" /> },
  { id: 'review', label: 'Review', icon: <Search className="w-4 h-4" /> },
  { id: 'match', label: 'Match', icon: <CheckCircle2 className="w-4 h-4" /> },
  { id: 'summary', label: 'Summary', icon: <ListChecks className="w-4 h-4" /> },
];

export default function ReconciliationPage() {
  const [state, dispatch] = useReducer(reconciliationReducer, initialState);

  // Get referrals for the selected study
  const studyReferrals = useMemo(() => {
    if (!state.selectedStudyId) return [];
    return getReferralsByStudy(state.selectedStudyId);
  }, [state.selectedStudyId]);

  // Get current IRT record
  const currentIRTRecord = useMemo(() => {
    if (state.irtRecords.length === 0) return null;
    return state.irtRecords[state.currentIndex];
  }, [state.irtRecords, state.currentIndex]);

  // Find matches for current IRT record
  const currentMatches = useMemo((): MatchCandidate[] => {
    if (!currentIRTRecord || studyReferrals.length === 0) return [];
    return findMatches(currentIRTRecord, studyReferrals);
  }, [currentIRTRecord, studyReferrals]);

  // Check if current record has been matched
  const currentRecordMatch = useMemo(() => {
    if (!currentIRTRecord) return null;
    return state.matches.find((m) => m.irtRecord.id === currentIRTRecord.id);
  }, [currentIRTRecord, state.matches]);

  // Handlers
  const handleStudySelect = useCallback((studyId: string) => {
    dispatch({ type: 'SET_STUDY', studyId });
  }, []);

  const handleImport = useCallback((records: IRTRecord[], fileName: string) => {
    dispatch({ type: 'IMPORT_RECORDS', records, fileName });
  }, []);

  const handleProceedToMatching = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: 'match' });
  }, []);

  const handleSelectMatch = useCallback(
    (referralId: string | null, referral?: Referral) => {
      if (!currentIRTRecord) return;

      const match: ReconciliationMatch = {
        id: `match-${Date.now()}`,
        irtRecord: currentIRTRecord,
        referralId,
        referral,
        matchedAt: new Date().toISOString(),
        confidenceScore: referralId
          ? currentMatches.find((m) => m.referralId === referralId)?.confidenceScore || 0
          : 0,
        isManual: true,
      };

      dispatch({ type: 'ADD_MATCH', match });

      // Auto-advance to next record
      if (state.currentIndex < state.irtRecords.length - 1) {
        dispatch({ type: 'NEXT_RECORD' });
      }
    },
    [currentIRTRecord, currentMatches, state.currentIndex, state.irtRecords.length]
  );

  const handleNoMatch = useCallback(() => {
    handleSelectMatch(null);
  }, [handleSelectMatch]);

  const handlePrevRecord = useCallback(() => {
    dispatch({ type: 'PREV_RECORD' });
  }, []);

  const handleNextRecord = useCallback(() => {
    dispatch({ type: 'NEXT_RECORD' });
  }, []);

  const handleGoToRecord = useCallback((index: number) => {
    dispatch({ type: 'GO_TO_RECORD', index });
  }, []);

  const handleComplete = useCallback(() => {
    dispatch({ type: 'COMPLETE_SESSION' });
  }, []);

  const handleRemoveMatch = useCallback((irtRecordId: string) => {
    dispatch({ type: 'REMOVE_MATCH', irtRecordId });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleBackToMatching = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: 'match' });
  }, []);

  // Get step index
  const currentStepIndex = steps.findIndex((s) => s.id === state.step);

  return (
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
            <Scale className="w-7 h-7 text-mint" />
            Reconciliation
          </h1>
          <p className="text-text-secondary mt-1">
            Match IRT report records with referrals in the system
          </p>
        </div>
      </motion.div>

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = state.step === step.id;
            const isPast = index < currentStepIndex;
            const isFuture = index > currentStepIndex;

            return (
              <div key={step.id} className="flex items-center">
                {/* Step circle */}
                <div
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300
                    ${
                      isActive
                        ? 'bg-mint/20 text-mint border border-mint/30'
                        : isPast
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-white/40 dark:bg-white/5 text-text-muted'
                    }
                  `}
                >
                  {step.icon}
                  <span className="text-sm font-medium">{step.label}</span>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-8 h-0.5 mx-2 transition-colors duration-300
                      ${isPast ? 'bg-emerald-500/40' : 'bg-white/20 dark:bg-white/10'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard variant="elevated" padding="lg">
          <AnimatePresence mode="wait">
            {state.step === 'import' && (
              <motion.div
                key="import"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IRTUpload
                  selectedStudyId={state.selectedStudyId}
                  onStudySelect={handleStudySelect}
                  onImport={handleImport}
                />
              </motion.div>
            )}

            {state.step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IRTRecordReview
                  records={state.irtRecords}
                  fileName={state.fileName || ''}
                  onProceed={handleProceedToMatching}
                  onBack={() => dispatch({ type: 'SET_STEP', step: 'import' })}
                  onReset={handleReset}
                />
              </motion.div>
            )}

            {state.step === 'match' && (
              <motion.div
                key="match"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MatchingWizard
                  irtRecords={state.irtRecords}
                  currentIndex={state.currentIndex}
                  matches={state.matches}
                  matchCandidates={currentMatches}
                  onSelectMatch={handleSelectMatch}
                  onNoMatch={handleNoMatch}
                  onPrev={handlePrevRecord}
                  onNext={handleNextRecord}
                  onGoToRecord={handleGoToRecord}
                  onComplete={handleComplete}
                  onReset={handleReset}
                />
              </motion.div>
            )}

            {state.step === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReconTotalList
                  matches={state.matches}
                  totalIRTRecords={state.irtRecords.length}
                  onRemoveMatch={handleRemoveMatch}
                  onBackToMatching={handleBackToMatching}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
}
