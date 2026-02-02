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

// ========================================
// Extended Reconciliation Types (v2)
// ========================================

/**
 * Tab identifiers for the reconciliation page
 */
export type ReconTab = 'dashboard' | 'imports' | 'matching' | 'approvals';

/**
 * Status options for IRT imports
 */
export type IRTImportStatus =
  | 'uploaded'
  | 'processing'
  | 'pending_review'
  | 'in_review'
  | 'pending_approval'
  | 'completed';

/**
 * Represents an IRT file import session
 */
export interface IRTImport {
  id: string;
  studyId: string;
  studyName: string;
  fileName: string;
  importDate: string;           // ISO date
  status: IRTImportStatus;
  totalSubjects: number;
  reviewedSubjects: number;
  newSubjects: number;
  pendingMatches: number;
  pendingApprovals?: number;
  importedBy: string;
}

/**
 * Match status for IRT subjects
 */
export type IRTSubjectMatchStatus = 'pending' | 'confirmed' | 'rejected' | 'unmatched';

/**
 * Subject enrollment status
 */
export type IRTSubjectStatus =
  | 'Pre-Enrolled'
  | 'Enrolled'
  | 'Randomized'
  | 'Screen Failed'
  | 'Withdrawn';

/**
 * IRT Subject within an import
 */
export interface IRTSubject {
  id: string;
  subjectId: string;            // e.g., "3525-006"
  status: IRTSubjectStatus;
  siteName: string;
  siteNumber: string;
  icfDate: string | null;       // ISO date
  age: number | null;
  initials: string;
  gender?: 'Male' | 'Female' | 'Other';
  matchStatus: IRTSubjectMatchStatus;
  potentialMatchCount: number;
}

/**
 * Confidence level for potential matches
 */
export type MatchConfidence = 'highly' | 'maybe' | 'low';

/**
 * Criteria that can be matched
 */
export interface MatchedCriteria {
  site: boolean;
  age: boolean;
  icfDate: boolean;
  apptToIcf?: boolean;
  screenfailDate?: boolean;
}

/**
 * Reference to another subject this lead might match
 */
export interface OtherSubjectMatch {
  subjectId: string;
  confidence: MatchConfidence;
}

/**
 * Potential match between IRT subject and a lead/referral
 */
export interface PotentialMatch {
  id: string;
  leadId: string;
  firstName: string;
  lastName: string;
  initials: string;
  email?: string;
  status: string;               // Lead status
  siteName: string;
  icfDate: string | null;       // ISO date
  apptDate?: string | null;     // ISO date
  enrollDate?: string | null;   // ISO date
  screenfailDate?: string | null;
  birthYear: number | null;
  age: number | null;
  matchType: string;            // Description of what matched
  confidence: MatchConfidence;
  matchScore: number;           // 0-100
  matchedCriteria: MatchedCriteria;
  otherSubjectMatches: OtherSubjectMatch[];
  notes?: string;
  contactCount?: number;
  submittedOn?: string;         // ISO date
}

/**
 * Reconciliation status for confirmed matches
 */
export type ReconStatusType = 'ICF' | 'ICF - SF' | 'Enrolled' | 'TBD';

/**
 * Status option with description
 */
export interface ReconStatusOption {
  value: ReconStatusType;
  label: string;
  description: string;
}

/**
 * Decision made during subject matching
 */
export interface MatchDecision {
  decision: 'confirmed' | 'rejected' | 'needs_review';
  reconStatus?: ReconStatusType;
  invoiceDate?: string;
  notes?: string;
  match?: PotentialMatch;
}

/**
 * Pending approval record
 */
export interface PendingApproval {
  id: string;
  studyName: string;
  subjectId: string;
  leadName: string;
  reconStatus: ReconStatusType;
  decidedBy: string;
  decidedAt: string;            // ISO datetime
  invoiceDate: string | null;
  notes?: string;
}

/**
 * Extended state for the reconciliation page (v2)
 */
export interface ReconPageState {
  activeTab: ReconTab;
  selectedStudyId: string | null;
  selectedImport: IRTImport | null;
  subjects: IRTSubject[];
  currentSubjectIndex: number;
  decisions: Record<string, MatchDecision>;   // Key: `${subjectId}-${matchId}`
  filterConfidence: MatchConfidence | 'all';
  filterStatus: IRTSubjectMatchStatus | 'all';
  showDecisionPanel: boolean;
  selectedMatch: PotentialMatch | null;
}

/**
 * Actions for reconciliation state reducer (v2)
 */
export type ReconPageAction =
  | { type: 'SET_TAB'; tab: ReconTab }
  | { type: 'SET_STUDY'; studyId: string }
  | { type: 'SELECT_IMPORT'; importData: IRTImport }
  | { type: 'SET_SUBJECTS'; subjects: IRTSubject[] }
  | { type: 'NEXT_SUBJECT' }
  | { type: 'PREV_SUBJECT' }
  | { type: 'GO_TO_SUBJECT'; index: number }
  | { type: 'SET_FILTER_CONFIDENCE'; confidence: MatchConfidence | 'all' }
  | { type: 'SET_FILTER_STATUS'; status: IRTSubjectMatchStatus | 'all' }
  | { type: 'ADD_DECISION'; key: string; decision: MatchDecision }
  | { type: 'REMOVE_DECISION'; key: string }
  | { type: 'SHOW_DECISION_PANEL'; match: PotentialMatch }
  | { type: 'HIDE_DECISION_PANEL' }
  | { type: 'RESET' };
