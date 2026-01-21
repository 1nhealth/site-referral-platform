// ========================================
// Reconciliation Types
// ========================================

import { Referral } from './index';

/**
 * Represents a record from an IRT (Interactive Response Technology) report
 */
export interface IRTRecord {
  id: string;
  subjectId: string;              // IRT subject ID from sponsor
  dateOfBirth: string;            // ISO date YYYY-MM-DD
  enrollmentDate: string | null;
  icfSignDate: string | null;     // Informed Consent Form sign date
  screeningDate: string | null;
  siteNumber: string;
  initials?: string;              // Often used instead of full name
  firstName?: string;             // May not be in IRT report
  lastName?: string;              // May not be in IRT report
  studyId?: string;               // If IRT report is multi-study
  rawData: Record<string, string>; // Original CSV row data
}

/**
 * A potential match between an IRT record and a referral
 */
export interface MatchCandidate {
  referralId: string;
  referral: Referral;
  confidenceScore: number;        // 0-100
  matchReasons: MatchReason[];
}

/**
 * Explains why a match was suggested
 */
export interface MatchReason {
  field: string;                  // e.g., 'dateOfBirth', 'icfDate'
  type: 'exact' | 'fuzzy' | 'proximity';
  weight: number;                 // Contribution to score
  details: string;                // Human-readable explanation
}

/**
 * A confirmed match between an IRT record and a referral
 */
export interface ReconciliationMatch {
  id: string;
  irtRecord: IRTRecord;
  referralId: string | null;      // null = marked as "no match"
  referral?: Referral;            // The matched referral (if any)
  matchedAt: string;              // ISO datetime
  confidenceScore: number;
  isManual: boolean;              // User override vs algorithm match
  notes?: string;
}

/**
 * Wizard step identifier
 */
export type ReconciliationStep = 'import' | 'review' | 'match' | 'summary';

/**
 * Column mapping for CSV import
 */
export interface IRTColumnMapping {
  csvColumn: string;
  mappedTo: keyof IRTRecord | null;
  sample: string;
  isRequired: boolean;
}

/**
 * State for the reconciliation page
 */
export interface ReconciliationState {
  step: ReconciliationStep;
  selectedStudyId: string | null;
  fileName: string | null;
  irtRecords: IRTRecord[];
  matches: ReconciliationMatch[];
  currentIndex: number;
  isProcessing: boolean;
}

/**
 * Actions for reconciliation state reducer
 */
export type ReconciliationAction =
  | { type: 'SET_STEP'; step: ReconciliationStep }
  | { type: 'SET_STUDY'; studyId: string }
  | { type: 'IMPORT_RECORDS'; records: IRTRecord[]; fileName: string }
  | { type: 'ADD_MATCH'; match: ReconciliationMatch }
  | { type: 'REMOVE_MATCH'; irtRecordId: string }
  | { type: 'UPDATE_MATCH'; irtRecordId: string; referralId: string | null }
  | { type: 'NEXT_RECORD' }
  | { type: 'PREV_RECORD' }
  | { type: 'GO_TO_RECORD'; index: number }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET' };

/**
 * Summary statistics for reconciliation
 */
export interface ReconciliationSummary {
  totalIRTRecords: number;
  matched: number;
  noMatch: number;
  skipped: number;
  averageConfidence: number;
}
