// ========================================
// Mock Data for Reconciliation Feature
// ========================================

import type {
  IRTImport,
  IRTSubject,
  PotentialMatch,
  PendingApproval,
  ReconStatusOption,
} from '@/lib/types/reconciliation';

// ========================================
// Studies
// ========================================

export interface Study {
  id: string;
  name: string;
  code: string;
}

export const mockStudies: Study[] = [
  { id: '1', name: 'Idorsia Sleep Study', code: 'IDRS-2025' },
  { id: '2', name: 'Evommune Dermatology', code: 'EVOM-2024' },
  { id: '3', name: 'Seaport Oncology', code: 'SEAP-2025' },
];

// ========================================
// IRT Imports
// ========================================

export const mockImports: IRTImport[] = [
  {
    id: '1',
    studyId: '1',
    studyName: 'Idorsia Sleep Study',
    fileName: 'IXRS_01152026.xlsx',
    importDate: '2026-01-15',
    status: 'in_review',
    totalSubjects: 47,
    reviewedSubjects: 32,
    newSubjects: 6,
    pendingMatches: 15,
    importedBy: 'Kelly Martinez',
  },
  {
    id: '2',
    studyId: '1',
    studyName: 'Idorsia Sleep Study',
    fileName: 'IXRS_01082026.xlsx',
    importDate: '2026-01-08',
    status: 'completed',
    totalSubjects: 41,
    reviewedSubjects: 41,
    newSubjects: 4,
    pendingMatches: 0,
    importedBy: 'Nakisha Muhammad',
  },
  {
    id: '3',
    studyId: '1',
    studyName: 'Idorsia Sleep Study',
    fileName: 'IXRS_01012026.xlsx',
    importDate: '2026-01-01',
    status: 'completed',
    totalSubjects: 38,
    reviewedSubjects: 38,
    newSubjects: 3,
    pendingMatches: 0,
    importedBy: 'Kelly Martinez',
  },
  {
    id: '4',
    studyId: '1',
    studyName: 'Idorsia Sleep Study',
    fileName: 'IXRS_12252025.xlsx',
    importDate: '2025-12-25',
    status: 'pending_approval',
    totalSubjects: 35,
    reviewedSubjects: 35,
    newSubjects: 5,
    pendingMatches: 0,
    pendingApprovals: 8,
    importedBy: 'Nakisha Muhammad',
  },
  {
    id: '5',
    studyId: '2',
    studyName: 'Evommune Dermatology',
    fileName: 'IXRS_01142026.xlsx',
    importDate: '2026-01-14',
    status: 'in_review',
    totalSubjects: 23,
    reviewedSubjects: 10,
    newSubjects: 8,
    pendingMatches: 13,
    importedBy: 'Kelly Martinez',
  },
];

// ========================================
// IRT Subjects
// ========================================

export const mockSubjects: IRTSubject[] = [
  {
    id: '1',
    subjectId: '3525-006',
    status: 'Pre-Enrolled',
    siteName: 'Teradan Clinical Trials, LLC',
    siteNumber: '3525',
    icfDate: '2025-09-02',
    age: 12,
    initials: 'AE',
    gender: 'Male',
    matchStatus: 'pending',
    potentialMatchCount: 3,
  },
  {
    id: '2',
    subjectId: '3525-007',
    status: 'Enrolled',
    siteName: 'Teradan Clinical Trials, LLC',
    siteNumber: '3525',
    icfDate: '2025-09-05',
    age: 45,
    initials: 'JS',
    gender: 'Female',
    matchStatus: 'confirmed',
    potentialMatchCount: 1,
  },
  {
    id: '3',
    subjectId: '3525-008',
    status: 'Screen Failed',
    siteName: 'Teradan Clinical Trials, LLC',
    siteNumber: '3525',
    icfDate: '2025-09-10',
    age: 34,
    initials: 'MK',
    gender: 'Male',
    matchStatus: 'pending',
    potentialMatchCount: 2,
  },
  {
    id: '4',
    subjectId: '4102-001',
    status: 'Pre-Enrolled',
    siteName: 'Metro Health Research',
    siteNumber: '4102',
    icfDate: '2025-09-12',
    age: 28,
    initials: 'LR',
    gender: 'Female',
    matchStatus: 'unmatched',
    potentialMatchCount: 0,
  },
  {
    id: '5',
    subjectId: '4102-002',
    status: 'Randomized',
    siteName: 'Metro Health Research',
    siteNumber: '4102',
    icfDate: '2025-09-15',
    age: 52,
    initials: 'DW',
    gender: 'Male',
    matchStatus: 'pending',
    potentialMatchCount: 1,
  },
];

// ========================================
// Potential Matches (keyed by subject ID)
// ========================================

export const mockPotentialMatches: Record<string, PotentialMatch[]> = {
  '1': [
    {
      id: '101',
      leadId: 'L-45892',
      firstName: 'Avery',
      lastName: 'Edwards',
      initials: 'AE',
      email: 'avery.e@email.com',
      status: 'Randomized',
      siteName: 'Teradan Clinical Trials, LLC',
      icfDate: '2025-09-02',
      apptDate: '2025-08-28',
      birthYear: 2012,
      age: 12,
      matchType: 'site, age, icf date matches',
      confidence: 'highly',
      matchScore: 95,
      matchedCriteria: { site: true, age: true, icfDate: true },
      otherSubjectMatches: [{ subjectId: '3525-007', confidence: 'low' }],
      notes: 'Parent called to confirm appointment. Very interested in the study.',
      contactCount: 5,
      submittedOn: '2025-08-15',
    },
    {
      id: '102',
      leadId: 'L-45901',
      firstName: 'Andrew',
      lastName: 'Ellis',
      initials: 'AE',
      email: 'andrew.ellis@email.com',
      status: 'Screening',
      siteName: 'Teradan Clinical Trials, LLC',
      icfDate: '2025-09-02',
      apptDate: '2025-09-01',
      birthYear: 2013,
      age: 11,
      matchType: 'site, icf date matches',
      confidence: 'maybe',
      matchScore: 72,
      matchedCriteria: { site: true, age: false, icfDate: true },
      otherSubjectMatches: [],
      notes: 'Interested in study. Needs follow-up call.',
      contactCount: 2,
      submittedOn: '2025-08-20',
    },
    {
      id: '103',
      leadId: 'L-45955',
      firstName: 'Alex',
      lastName: 'Evans',
      initials: 'AE',
      email: 'alex.evans@email.com',
      status: 'Qualified',
      siteName: 'Teradan Clinical Trials, LLC',
      icfDate: null,
      apptDate: '2025-09-02',
      birthYear: 2012,
      age: 12,
      matchType: 'site, age, appt to icf date matches',
      confidence: 'highly',
      matchScore: 88,
      matchedCriteria: { site: true, age: true, icfDate: false, apptToIcf: true },
      otherSubjectMatches: [],
      notes: 'Scheduled for screening visit.',
      contactCount: 3,
      submittedOn: '2025-08-22',
    },
  ],
  '3': [
    {
      id: '301',
      leadId: 'L-46102',
      firstName: 'Michael',
      lastName: 'Kim',
      initials: 'MK',
      email: 'michael.kim@email.com',
      status: 'Screen Failed',
      siteName: 'Teradan Clinical Trials, LLC',
      icfDate: '2025-09-10',
      screenfailDate: '2025-09-15',
      birthYear: 1990,
      age: 34,
      matchType: 'site, screenfail date matches',
      confidence: 'highly',
      matchScore: 92,
      matchedCriteria: { site: true, screenfailDate: true, age: false, icfDate: false },
      otherSubjectMatches: [],
      notes: 'Did not meet inclusion criteria.',
      contactCount: 4,
      submittedOn: '2025-08-25',
    },
    {
      id: '302',
      leadId: 'L-46115',
      firstName: 'Matthew',
      lastName: 'Kennedy',
      initials: 'MK',
      email: 'matt.k@email.com',
      status: 'Screening',
      siteName: 'Teradan Clinical Trials, LLC',
      icfDate: '2025-09-11',
      birthYear: 1991,
      age: 33,
      matchType: 'site, age matches',
      confidence: 'low',
      matchScore: 45,
      matchedCriteria: { site: true, age: false, icfDate: false },
      otherSubjectMatches: [],
      notes: 'In screening process.',
      contactCount: 2,
      submittedOn: '2025-09-01',
    },
  ],
  '5': [
    {
      id: '501',
      leadId: 'L-46250',
      firstName: 'David',
      lastName: 'Williams',
      initials: 'DW',
      email: 'david.w@email.com',
      status: 'Randomized',
      siteName: 'Metro Health Research',
      icfDate: '2025-09-15',
      enrollDate: '2025-09-20',
      birthYear: 1973,
      age: 52,
      matchType: 'site, age, icf date matches',
      confidence: 'highly',
      matchScore: 97,
      matchedCriteria: { site: true, age: true, icfDate: true },
      otherSubjectMatches: [],
      notes: 'Successfully enrolled. Very cooperative participant.',
      contactCount: 6,
      submittedOn: '2025-08-30',
    },
  ],
};

// ========================================
// Pending Approvals
// ========================================

export const mockPendingApprovals: PendingApproval[] = [
  {
    id: '1',
    studyName: 'Idorsia Sleep Study',
    subjectId: '3525-006',
    leadName: 'Avery Edwards',
    reconStatus: 'ICF',
    decidedBy: 'Kelly Martinez',
    decidedAt: '2026-01-15T14:30:00Z',
    invoiceDate: '2026-01-31',
    notes: 'Strong match - all criteria met.',
  },
  {
    id: '2',
    studyName: 'Idorsia Sleep Study',
    subjectId: '3525-009',
    leadName: 'Jordan Smith',
    reconStatus: 'Enrolled',
    decidedBy: 'Kelly Martinez',
    decidedAt: '2026-01-15T15:00:00Z',
    invoiceDate: '2026-01-31',
    notes: 'Confirmed enrollment.',
  },
  {
    id: '3',
    studyName: 'Evommune Dermatology',
    subjectId: '405-113',
    leadName: 'Patrick Evans',
    reconStatus: 'ICF - SF',
    decidedBy: 'Nakisha Muhammad',
    decidedAt: '2026-01-14T10:15:00Z',
    invoiceDate: '2026-01-31',
    notes: 'Screen failed due to lab values.',
  },
  {
    id: '4',
    studyName: 'Idorsia Sleep Study',
    subjectId: '4102-002',
    leadName: 'David Williams',
    reconStatus: 'Enrolled',
    decidedBy: 'Nakisha Muhammad',
    decidedAt: '2026-01-14T11:45:00Z',
    invoiceDate: '2026-01-31',
    notes: 'Randomized on 09/20.',
  },
];

// ========================================
// Recon Status Options
// ========================================

export const reconStatusOptions: ReconStatusOption[] = [
  {
    value: 'ICF',
    label: 'ICF',
    description: 'Confirmed 1nHealth ICF, actively screening',
  },
  {
    value: 'ICF - SF',
    label: 'ICF - SF',
    description: '1nHealth referral that screen failed',
  },
  {
    value: 'Enrolled',
    label: 'Enrolled',
    description: 'Confirmed enrolled/randomized',
  },
  {
    value: 'TBD',
    label: 'TBD',
    description: 'Possible match, needs follow-up',
  },
];

// ========================================
// Helper Functions
// ========================================

export function getImportsByStudy(studyId: string): IRTImport[] {
  return mockImports.filter((imp) => imp.studyId === studyId);
}

export function getSubjectsForImport(importId: string): IRTSubject[] {
  // In a real app, subjects would be linked to specific imports
  // For mock data, return all subjects for the matching study
  return mockSubjects;
}

export function getPotentialMatchesForSubject(subjectId: string): PotentialMatch[] {
  return mockPotentialMatches[subjectId] || [];
}

export function getSubjectsWithMatches(): IRTSubject[] {
  return mockSubjects.filter((s) => s.potentialMatchCount > 0);
}

export function getPendingSubjects(): IRTSubject[] {
  return mockSubjects.filter((s) => s.matchStatus === 'pending' && s.potentialMatchCount > 0);
}

// ========================================
// Dashboard Stats
// ========================================

export interface ReconDashboardStats {
  pendingReviews: number;
  awaitingApproval: number;
  completedThisWeek: number;
  totalMatches: number;
  completedTrend: number;
}

export function getDashboardStats(): ReconDashboardStats {
  const pendingReviews = mockImports
    .filter((i) => i.status === 'in_review')
    .reduce((sum, i) => sum + i.pendingMatches, 0);

  const awaitingApproval = mockPendingApprovals.length;

  return {
    pendingReviews,
    awaitingApproval,
    completedThisWeek: 23,
    totalMatches: 89,
    completedTrend: 15,
  };
}
