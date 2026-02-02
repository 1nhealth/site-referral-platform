'use client';

import { useReducer, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale } from 'lucide-react';
import { ReconTabBar } from '@/components/reconciliation/ReconTabBar';
import { ReconDashboard } from '@/components/reconciliation/ReconDashboard';
import { ReconImportsList } from '@/components/reconciliation/ReconImportsList';
import { ReconSubjectMatcher } from '@/components/reconciliation/ReconSubjectMatcher';
import { ReconDecisionPanel } from '@/components/reconciliation/ReconDecisionPanel';
import { ReconApprovalQueue } from '@/components/reconciliation/ReconApprovalQueue';
import {
  mockSubjects,
  mockPendingApprovals,
} from '@/lib/mock-data/reconciliation';
import type {
  ReconTab,
  IRTImport,
  PotentialMatch,
  MatchDecision,
  ReconPageState,
  ReconPageAction,
} from '@/lib/types/reconciliation';

// Initial state
const initialState: ReconPageState = {
  activeTab: 'dashboard',
  selectedStudyId: null,
  selectedImport: null,
  subjects: [],
  currentSubjectIndex: 0,
  decisions: {},
  filterConfidence: 'all',
  filterStatus: 'pending',
  showDecisionPanel: false,
  selectedMatch: null,
};

// Reducer
function reconReducer(state: ReconPageState, action: ReconPageAction): ReconPageState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'SET_STUDY':
      return { ...state, selectedStudyId: action.studyId };
    case 'SELECT_IMPORT':
      return {
        ...state,
        selectedImport: action.importData,
        activeTab: 'matching',
        currentSubjectIndex: 0,
      };
    case 'SET_SUBJECTS':
      return { ...state, subjects: action.subjects };
    case 'NEXT_SUBJECT':
      return {
        ...state,
        currentSubjectIndex: Math.min(
          state.currentSubjectIndex + 1,
          state.subjects.length - 1
        ),
      };
    case 'PREV_SUBJECT':
      return {
        ...state,
        currentSubjectIndex: Math.max(state.currentSubjectIndex - 1, 0),
      };
    case 'GO_TO_SUBJECT':
      return {
        ...state,
        currentSubjectIndex: Math.max(
          0,
          Math.min(action.index, state.subjects.length - 1)
        ),
      };
    case 'SET_FILTER_CONFIDENCE':
      return { ...state, filterConfidence: action.confidence };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.status };
    case 'ADD_DECISION':
      return {
        ...state,
        decisions: { ...state.decisions, [action.key]: action.decision },
        showDecisionPanel: false,
        selectedMatch: null,
      };
    case 'REMOVE_DECISION': {
      const { [action.key]: _, ...rest } = state.decisions;
      return { ...state, decisions: rest };
    }
    case 'SHOW_DECISION_PANEL':
      return { ...state, showDecisionPanel: true, selectedMatch: action.match };
    case 'HIDE_DECISION_PANEL':
      return { ...state, showDecisionPanel: false, selectedMatch: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function ReconciliationPage() {
  const [state, dispatch] = useReducer(reconReducer, initialState);

  // Get current subject
  const currentSubject = useMemo(() => {
    const subjects = mockSubjects.filter(
      (s) => s.matchStatus === 'pending' && s.potentialMatchCount > 0
    );
    return subjects[state.currentSubjectIndex] || null;
  }, [state.currentSubjectIndex]);

  // Handlers
  const handleTabChange = useCallback((tab: ReconTab) => {
    dispatch({ type: 'SET_TAB', tab });
  }, []);

  const handleSelectImport = useCallback((importData: IRTImport) => {
    dispatch({ type: 'SELECT_IMPORT', importData });
  }, []);

  const handleShowDecisionPanel = useCallback((match: PotentialMatch) => {
    dispatch({ type: 'SHOW_DECISION_PANEL', match });
  }, []);

  const handleCloseDecisionPanel = useCallback(() => {
    dispatch({ type: 'HIDE_DECISION_PANEL' });
  }, []);

  const handleDecisionSubmit = useCallback(
    (decision: MatchDecision) => {
      if (!currentSubject || !state.selectedMatch) return;
      const key = `${currentSubject.id}-${state.selectedMatch.id}`;
      dispatch({ type: 'ADD_DECISION', key, decision });

      // Auto-advance to next subject
      setTimeout(() => {
        dispatch({ type: 'NEXT_SUBJECT' });
      }, 300);
    },
    [currentSubject, state.selectedMatch]
  );

  const handleReject = useCallback(
    (subjectId: string, match: PotentialMatch) => {
      const key = `${subjectId}-${match.id}`;
      dispatch({
        type: 'ADD_DECISION',
        key,
        decision: { decision: 'rejected', match },
      });
    },
    []
  );

  const handleRemoveDecision = useCallback((key: string) => {
    dispatch({ type: 'REMOVE_DECISION', key });
  }, []);

  const handleBackToImports = useCallback(() => {
    dispatch({ type: 'SET_TAB', tab: 'imports' });
  }, []);

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

      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex justify-center"
      >
        <ReconTabBar
          activeTab={state.activeTab}
          onTabChange={handleTabChange}
          pendingApprovalsCount={mockPendingApprovals.length}
        />
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {state.activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReconDashboard
              onTabChange={handleTabChange}
              onSelectImport={handleSelectImport}
            />
          </motion.div>
        )}

        {state.activeTab === 'imports' && (
          <motion.div
            key="imports"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReconImportsList
              selectedStudyId={state.selectedStudyId || undefined}
              onSelectImport={handleSelectImport}
            />
          </motion.div>
        )}

        {state.activeTab === 'matching' && (
          <motion.div
            key="matching"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReconSubjectMatcher
              selectedImport={state.selectedImport}
              onBack={handleBackToImports}
              onShowDecisionPanel={handleShowDecisionPanel}
              decisions={state.decisions}
              onReject={handleReject}
              onRemoveDecision={handleRemoveDecision}
            />
          </motion.div>
        )}

        {state.activeTab === 'approvals' && (
          <motion.div
            key="approvals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReconApprovalQueue />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Panel */}
      <ReconDecisionPanel
        isOpen={state.showDecisionPanel}
        match={state.selectedMatch}
        subject={currentSubject}
        onClose={handleCloseDecisionPanel}
        onSubmit={handleDecisionSubmit}
      />
    </div>
  );
}
