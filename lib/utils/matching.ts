// ========================================
// Matching Algorithm for IRT Reconciliation
// ========================================

import type { Referral } from '@/lib/types';
import type { IRTRecord, MatchCandidate, MatchReason } from '@/lib/types/reconciliation';

/**
 * Scoring weights for matching algorithm
 * Designed to produce multiple potential matches for user review
 */
const MATCH_WEIGHTS = {
  dateOfBirth: {
    exact: 35,
    offByDays: (days: number) => Math.max(0, 28 - days * 2), // More generous: up to 14 days
  },
  icfDate: {
    exact: 20,
    proximity: (days: number) => Math.max(0, 16 - days * 1.5), // Up to ~10 days
  },
  enrollmentDate: {
    exact: 15,
    proximity: (days: number) => Math.max(0, 12 - days),
  },
  appointmentDate: {
    proximity: (days: number) => Math.max(0, 12 - days),
  },
  name: {
    exact: 15,
    fuzzy: 10,
    initials: 8,
  },
  status: {
    signedIcf: 12,
    appointmentScheduled: 8,
  },
};

const MINIMUM_SCORE_THRESHOLD = 12; // Lower threshold to show more candidates

/**
 * Compare two date strings and return match info
 */
function compareDates(
  date1: string | null | undefined,
  date2: string | null | undefined
): { exact: boolean; daysOff: number | null } {
  if (!date1 || !date2) return { exact: false, daysOff: null };

  // Parse dates (handle both YYYY-MM-DD and ISO datetime)
  const d1 = new Date(date1.split('T')[0]);
  const d2 = new Date(date2.split('T')[0]);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return { exact: false, daysOff: null };
  }

  const diffMs = Math.abs(d1.getTime() - d2.getTime());
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return {
    exact: diffDays === 0,
    daysOff: diffDays,
  };
}

/**
 * Calculate days between two dates (positive if date1 is before date2)
 */
function daysBetween(
  date1: string | null | undefined,
  date2: string | null | undefined
): number | null {
  if (!date1 || !date2) return null;

  const d1 = new Date(date1.split('T')[0]);
  const d2 = new Date(date2.split('T')[0]);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return null;
  }

  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display in match reasons (short format)
 */
function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return '—';

  const date = new Date(dateString.split('T')[0]);
  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate string similarity (0-1 scale)
 */
function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);

  return 1 - distance / maxLen;
}

/**
 * Compare names and return scoring info
 */
function compareNames(
  irtFirst: string | undefined,
  irtLast: string | undefined,
  refFirst: string,
  refLast: string
): { points: number; type: 'exact' | 'fuzzy'; details: string } {
  if (!irtFirst && !irtLast) {
    return { points: 0, type: 'fuzzy', details: '' };
  }

  const normalize = (s: string) => s.toLowerCase().trim();

  const firstMatch = irtFirst ? normalize(irtFirst) === normalize(refFirst) : false;
  const lastMatch = irtLast ? normalize(irtLast) === normalize(refLast) : false;

  if (firstMatch && lastMatch) {
    return { points: MATCH_WEIGHTS.name.exact, type: 'exact', details: 'Full name match' };
  }

  // Fuzzy matching
  const firstSimilar = irtFirst ? stringSimilarity(irtFirst, refFirst) > 0.8 : false;
  const lastSimilar = irtLast ? stringSimilarity(irtLast, refLast) > 0.8 : false;

  if (firstSimilar && lastSimilar) {
    return { points: MATCH_WEIGHTS.name.fuzzy, type: 'fuzzy', details: 'Names similar (possible typo)' };
  }

  if (lastMatch) {
    return { points: 5, type: 'fuzzy', details: 'Last name matches' };
  }

  if (lastSimilar) {
    return { points: 3, type: 'fuzzy', details: 'Last name similar' };
  }

  return { points: 0, type: 'fuzzy', details: '' };
}

/**
 * Check if initials match
 */
function checkInitials(
  initials: string | undefined,
  firstName: string,
  lastName: string
): boolean {
  if (!initials || initials.length < 2) return false;

  const expected = (firstName[0] + lastName[0]).toUpperCase();
  return initials.toUpperCase() === expected;
}

/**
 * Find matching referrals for an IRT record
 */
export function findMatches(
  irtRecord: IRTRecord,
  referrals: Referral[],
  options?: { minScore?: number }
): MatchCandidate[] {
  const minScore = options?.minScore ?? MINIMUM_SCORE_THRESHOLD;
  const candidates: MatchCandidate[] = [];

  for (const referral of referrals) {
    let score = 0;
    const reasons: MatchReason[] = [];

    // 1. Date of Birth comparison (most important)
    const dobMatch = compareDates(irtRecord.dateOfBirth, referral.dateOfBirth);
    const irtDobFormatted = formatDateShort(irtRecord.dateOfBirth);
    const refDobFormatted = formatDateShort(referral.dateOfBirth);
    if (dobMatch.exact) {
      score += MATCH_WEIGHTS.dateOfBirth.exact;
      reasons.push({
        field: 'dateOfBirth',
        type: 'exact',
        weight: MATCH_WEIGHTS.dateOfBirth.exact,
        details: `Exact DOB match: ${refDobFormatted}`,
      });
    } else if (dobMatch.daysOff !== null && dobMatch.daysOff <= 14) {
      const pts = MATCH_WEIGHTS.dateOfBirth.offByDays(dobMatch.daysOff);
      if (pts > 0) {
        score += pts;
        reasons.push({
          field: 'dateOfBirth',
          type: 'proximity',
          weight: pts,
          details: `DOB off by ${dobMatch.daysOff} day${dobMatch.daysOff === 1 ? '' : 's'}: ${irtDobFormatted} vs ${refDobFormatted}`,
        });
      }
    }

    // 2. ICF Date vs last contacted date (proxy for ICF date in our system)
    if (irtRecord.icfSignDate && referral.status === 'signed_icf' && referral.lastContactedAt) {
      const icfMatch = compareDates(irtRecord.icfSignDate, referral.lastContactedAt);
      const irtIcfFormatted = formatDateShort(irtRecord.icfSignDate);
      const refContactFormatted = formatDateShort(referral.lastContactedAt);
      if (icfMatch.exact) {
        score += MATCH_WEIGHTS.icfDate.exact;
        reasons.push({
          field: 'icfDate',
          type: 'exact',
          weight: MATCH_WEIGHTS.icfDate.exact,
          details: `ICF date matches last contact: ${irtIcfFormatted}`,
        });
      } else if (icfMatch.daysOff !== null && icfMatch.daysOff <= 7) {
        const pts = MATCH_WEIGHTS.icfDate.proximity(icfMatch.daysOff);
        if (pts > 0) {
          score += pts;
          reasons.push({
            field: 'icfDate',
            type: 'proximity',
            weight: pts,
            details: `ICF within ${icfMatch.daysOff} day${icfMatch.daysOff === 1 ? '' : 's'}: ${irtIcfFormatted} vs ${refContactFormatted}`,
          });
        }
      }
    }

    // 3. Appointment date correlation
    if (referral.appointmentDate && irtRecord.icfSignDate) {
      const apptToIcf = daysBetween(referral.appointmentDate, irtRecord.icfSignDate);
      if (apptToIcf !== null && apptToIcf >= 0 && apptToIcf <= 14) {
        const pts = MATCH_WEIGHTS.appointmentDate.proximity(apptToIcf);
        if (pts > 0) {
          const apptFormatted = formatDateShort(referral.appointmentDate);
          const icfFormatted = formatDateShort(irtRecord.icfSignDate);
          score += pts;
          reasons.push({
            field: 'appointmentDate',
            type: 'proximity',
            weight: pts,
            details: `Appointment ${apptToIcf} day${apptToIcf === 1 ? '' : 's'} before ICF: ${apptFormatted} → ${icfFormatted}`,
          });
        }
      }
    }

    // 4. Name matching (if available in IRT)
    if (irtRecord.firstName || irtRecord.lastName) {
      const nameScore = compareNames(
        irtRecord.firstName,
        irtRecord.lastName,
        referral.firstName,
        referral.lastName
      );
      if (nameScore.points > 0) {
        score += nameScore.points;
        reasons.push({
          field: 'name',
          type: nameScore.type,
          weight: nameScore.points,
          details: nameScore.details,
        });
      }
    } else if (irtRecord.initials) {
      // Check initials if full name not available
      if (checkInitials(irtRecord.initials, referral.firstName, referral.lastName)) {
        score += MATCH_WEIGHTS.name.initials;
        reasons.push({
          field: 'name',
          type: 'fuzzy',
          weight: MATCH_WEIGHTS.name.initials,
          details: 'Initials match',
        });
      }
    }

    // 5. Status bonus
    if (referral.status === 'signed_icf') {
      score += MATCH_WEIGHTS.status.signedIcf;
      reasons.push({
        field: 'status',
        type: 'exact',
        weight: MATCH_WEIGHTS.status.signedIcf,
        details: 'Referral has signed ICF status',
      });
    } else if (referral.status === 'appointment_scheduled') {
      score += MATCH_WEIGHTS.status.appointmentScheduled;
      reasons.push({
        field: 'status',
        type: 'exact',
        weight: MATCH_WEIGHTS.status.appointmentScheduled,
        details: 'Referral has appointment scheduled',
      });
    }

    // Only include if score meets threshold
    if (score >= minScore) {
      candidates.push({
        referralId: referral.id,
        referral,
        confidenceScore: Math.min(100, score),
        matchReasons: reasons,
      });
    }
  }

  // Sort by confidence score descending
  return candidates.sort((a, b) => b.confidenceScore - a.confidenceScore);
}

/**
 * Get confidence level label based on score
 */
export function getConfidenceLevel(score: number): 'high' | 'medium' | 'low' | 'very-low' {
  if (score >= 90) return 'high';
  if (score >= 70) return 'medium';
  if (score >= 50) return 'low';
  return 'very-low';
}

/**
 * Get confidence color classes based on score
 */
export function getConfidenceColor(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  const level = getConfidenceLevel(score);
  switch (level) {
    case 'high':
      return {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
      };
    case 'medium':
      return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
      };
    case 'low':
      return {
        bg: 'bg-orange-500/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-500/30',
      };
    default:
      return {
        bg: 'bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
      };
  }
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
