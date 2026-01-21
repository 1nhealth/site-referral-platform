// ========================================
// Mock IRT Records for Development
// ========================================

import type { IRTRecord } from '@/lib/types/reconciliation';

// Helper to generate dates relative to today
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Mock IRT records for AURORA-T2D (study-001)
 * Some match existing referrals, some are new enrollments
 */
export const mockIRTRecordsAurora: IRTRecord[] = [
  // Matches Maria Santos (ref-001) - exact DOB match
  {
    id: 'irt-001',
    subjectId: 'AUR-001-001',
    dateOfBirth: '1968-03-15',
    enrollmentDate: daysAgo(10),
    icfSignDate: daysAgo(13),
    screeningDate: daysAgo(15),
    siteNumber: '001',
    initials: 'MS',
    rawData: {
      'Subject ID': 'AUR-001-001',
      'Date of Birth': '1968-03-15',
      'ICF Date': daysAgo(13),
      'Enrollment Date': daysAgo(10),
      Initials: 'MS',
    },
  },
  // Matches William Johnson (ref-009) - exact DOB match
  {
    id: 'irt-002',
    subjectId: 'AUR-001-002',
    dateOfBirth: '1965-08-22',
    enrollmentDate: daysAgo(12),
    icfSignDate: daysAgo(14),
    screeningDate: daysAgo(16),
    siteNumber: '001',
    initials: 'WJ',
    rawData: {
      'Subject ID': 'AUR-001-002',
      'Date of Birth': '1965-08-22',
      'ICF Date': daysAgo(14),
      'Enrollment Date': daysAgo(12),
      Initials: 'WJ',
    },
  },
  // Matches Charles Brown (ref-011) - exact DOB match
  {
    id: 'irt-003',
    subjectId: 'AUR-001-003',
    dateOfBirth: '1958-11-30',
    enrollmentDate: daysAgo(14),
    icfSignDate: daysAgo(16),
    screeningDate: daysAgo(18),
    siteNumber: '001',
    initials: 'CB',
    rawData: {
      'Subject ID': 'AUR-001-003',
      'Date of Birth': '1958-11-30',
      'ICF Date': daysAgo(16),
      'Enrollment Date': daysAgo(14),
      Initials: 'CB',
    },
  },
  // Matches Jennifer Davis (ref-013) - exact DOB match with full name
  {
    id: 'irt-004',
    subjectId: 'AUR-001-004',
    dateOfBirth: '1967-04-25',
    enrollmentDate: daysAgo(8),
    icfSignDate: daysAgo(10),
    screeningDate: daysAgo(12),
    siteNumber: '001',
    firstName: 'Jennifer',
    lastName: 'Davis',
    initials: 'JD',
    rawData: {
      'Subject ID': 'AUR-001-004',
      'Date of Birth': '1967-04-25',
      'ICF Date': daysAgo(10),
      'Enrollment Date': daysAgo(8),
      'First Name': 'Jennifer',
      'Last Name': 'Davis',
    },
  },
  // Matches Dorothy Wilson (ref-060) - DOB match
  {
    id: 'irt-005',
    subjectId: 'AUR-001-005',
    dateOfBirth: '1963-05-12',
    enrollmentDate: daysAgo(11),
    icfSignDate: daysAgo(13),
    screeningDate: daysAgo(15),
    siteNumber: '001',
    initials: 'DW',
    rawData: {
      'Subject ID': 'AUR-001-005',
      'Date of Birth': '1963-05-12',
      'ICF Date': daysAgo(13),
      'Enrollment Date': daysAgo(11),
      Initials: 'DW',
    },
  },
  // Partial match - DOB off by 2 days (could match Steven Anderson ref-062)
  {
    id: 'irt-006',
    subjectId: 'AUR-001-006',
    dateOfBirth: '1957-12-22', // 2 days off from 1957-12-20
    enrollmentDate: daysAgo(9),
    icfSignDate: daysAgo(11),
    screeningDate: daysAgo(13),
    siteNumber: '001',
    initials: 'SA',
    rawData: {
      'Subject ID': 'AUR-001-006',
      'Date of Birth': '1957-12-22',
      'ICF Date': daysAgo(11),
      'Enrollment Date': daysAgo(9),
      Initials: 'SA',
    },
  },
  // No match - new enrollment not in our system
  {
    id: 'irt-007',
    subjectId: 'AUR-001-007',
    dateOfBirth: '1975-06-18',
    enrollmentDate: daysAgo(5),
    icfSignDate: daysAgo(7),
    screeningDate: daysAgo(9),
    siteNumber: '001',
    initials: 'RH',
    rawData: {
      'Subject ID': 'AUR-001-007',
      'Date of Birth': '1975-06-18',
      'ICF Date': daysAgo(7),
      'Enrollment Date': daysAgo(5),
      Initials: 'RH',
    },
  },
  // No match - new enrollment
  {
    id: 'irt-008',
    subjectId: 'AUR-001-008',
    dateOfBirth: '1982-02-03',
    enrollmentDate: daysAgo(4),
    icfSignDate: daysAgo(6),
    screeningDate: daysAgo(8),
    siteNumber: '001',
    firstName: 'Amanda',
    lastName: 'Garcia',
    initials: 'AG',
    rawData: {
      'Subject ID': 'AUR-001-008',
      'Date of Birth': '1982-02-03',
      'ICF Date': daysAgo(6),
      'Enrollment Date': daysAgo(4),
      'First Name': 'Amanda',
      'Last Name': 'Garcia',
    },
  },
  // Matches Christopher Martinez (ref-064) - exact DOB
  {
    id: 'irt-009',
    subjectId: 'AUR-001-009',
    dateOfBirth: '1964-06-15',
    enrollmentDate: daysAgo(7),
    icfSignDate: daysAgo(9),
    screeningDate: daysAgo(11),
    siteNumber: '001',
    initials: 'CM',
    rawData: {
      'Subject ID': 'AUR-001-009',
      'Date of Birth': '1964-06-15',
      'ICF Date': daysAgo(9),
      'Enrollment Date': daysAgo(7),
      Initials: 'CM',
    },
  },
  // Matches Linda Taylor (ref-066) - exact DOB
  {
    id: 'irt-010',
    subjectId: 'AUR-001-010',
    dateOfBirth: '1959-03-22',
    enrollmentDate: daysAgo(6),
    icfSignDate: daysAgo(8),
    screeningDate: daysAgo(10),
    siteNumber: '001',
    initials: 'LT',
    rawData: {
      'Subject ID': 'AUR-001-010',
      'Date of Birth': '1959-03-22',
      'ICF Date': daysAgo(8),
      'Enrollment Date': daysAgo(6),
      Initials: 'LT',
    },
  },
  // No match - new enrollment
  {
    id: 'irt-011',
    subjectId: 'AUR-001-011',
    dateOfBirth: '1978-09-14',
    enrollmentDate: daysAgo(3),
    icfSignDate: daysAgo(5),
    screeningDate: daysAgo(7),
    siteNumber: '001',
    initials: 'KP',
    rawData: {
      'Subject ID': 'AUR-001-011',
      'Date of Birth': '1978-09-14',
      'ICF Date': daysAgo(5),
      'Enrollment Date': daysAgo(3),
      Initials: 'KP',
    },
  },
  // Ambiguous match - DOB could match multiple people (close dates)
  {
    id: 'irt-012',
    subjectId: 'AUR-001-012',
    dateOfBirth: '1968-03-17', // 2 days off from Maria Santos
    enrollmentDate: daysAgo(2),
    icfSignDate: daysAgo(4),
    screeningDate: daysAgo(6),
    siteNumber: '001',
    initials: 'TK',
    rawData: {
      'Subject ID': 'AUR-001-012',
      'Date of Birth': '1968-03-17',
      'ICF Date': daysAgo(4),
      'Enrollment Date': daysAgo(2),
      Initials: 'TK',
    },
  },
];

/**
 * Mock IRT records for RESOLVE-RA (study-003)
 */
export const mockIRTRecordsResolve: IRTRecord[] = [
  // Matches Barbara Williams (ref-010) - exact DOB
  {
    id: 'irt-ra-001',
    subjectId: 'RSV-001-001',
    dateOfBirth: '1970-02-14',
    enrollmentDate: daysAgo(9),
    icfSignDate: daysAgo(11),
    screeningDate: daysAgo(13),
    siteNumber: '001',
    initials: 'BW',
    rawData: {
      'Subject ID': 'RSV-001-001',
      'Date of Birth': '1970-02-14',
      'ICF Date': daysAgo(11),
      'Enrollment Date': daysAgo(9),
      Initials: 'BW',
    },
  },
  // Matches Susan Miller (ref-012) - exact DOB
  {
    id: 'irt-ra-002',
    subjectId: 'RSV-001-002',
    dateOfBirth: '1962-07-08',
    enrollmentDate: daysAgo(8),
    icfSignDate: daysAgo(10),
    screeningDate: daysAgo(12),
    siteNumber: '001',
    firstName: 'Susan',
    lastName: 'Miller',
    initials: 'SM',
    rawData: {
      'Subject ID': 'RSV-001-002',
      'Date of Birth': '1962-07-08',
      'ICF Date': daysAgo(10),
      'Enrollment Date': daysAgo(8),
      'First Name': 'Susan',
      'Last Name': 'Miller',
    },
  },
  // No match - new enrollment
  {
    id: 'irt-ra-003',
    subjectId: 'RSV-001-003',
    dateOfBirth: '1971-11-25',
    enrollmentDate: daysAgo(4),
    icfSignDate: daysAgo(6),
    screeningDate: daysAgo(8),
    siteNumber: '001',
    initials: 'JC',
    rawData: {
      'Subject ID': 'RSV-001-003',
      'Date of Birth': '1971-11-25',
      'ICF Date': daysAgo(6),
      'Enrollment Date': daysAgo(4),
      Initials: 'JC',
    },
  },
];

/**
 * Get IRT records by study
 */
export function getIRTRecordsByStudy(studyId: string): IRTRecord[] {
  switch (studyId) {
    case 'study-001':
      return mockIRTRecordsAurora;
    case 'study-003':
      return mockIRTRecordsResolve;
    default:
      return [];
  }
}

/**
 * All mock IRT records
 */
export const allMockIRTRecords: IRTRecord[] = [
  ...mockIRTRecordsAurora,
  ...mockIRTRecordsResolve,
];

/**
 * Generate CSV content from IRT records
 */
export function generateIRTCSV(records: IRTRecord[]): string {
  const headers = ['Subject ID', 'Date of Birth', 'ICF Date', 'Enrollment Date', 'Screening Date', 'Site', 'Initials', 'First Name', 'Last Name'];

  const rows = records.map(record => [
    record.subjectId,
    record.dateOfBirth,
    record.icfSignDate || '',
    record.enrollmentDate || '',
    record.screeningDate || '',
    record.siteNumber,
    record.initials || '',
    record.firstName || '',
    record.lastName || '',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
}
