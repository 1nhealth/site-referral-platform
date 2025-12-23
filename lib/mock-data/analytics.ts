import { mockReferrals } from './referrals';
import { mockStudies } from './studies';
import type { ReferralStatus } from '@/lib/types';

// Generate time-series data for referrals over last 30 days
export function getReferralsOverTime(days: number = 30) {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate realistic daily variation
    const baseValue = 3;
    const variation = Math.floor(Math.random() * 5);
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.5 : 1;

    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.floor((baseValue + variation) * weekendFactor),
      date: date.toISOString(),
    });
  }

  return data;
}

// Conversion funnel data
export function getConversionFunnel() {
  const statusCounts: Record<string, number> = {};

  mockReferrals.forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const total = mockReferrals.length;

  // Define funnel stages in order (using actual ReferralStatus values)
  const funnelStages = [
    { status: 'new', label: 'New Referrals' },
    { status: 'attempt_1', label: 'Contact Attempted' },
    { status: 'sent_sms', label: 'SMS Sent' },
    { status: 'appointment_scheduled', label: 'Scheduled' },
    { status: 'signed_icf', label: 'Signed' },
  ];

  // Calculate cumulative funnel values
  const phoneScreenFailed = statusCounts['phone_screen_failed'] || 0;
  const notInterested = statusCounts['not_interested'] || 0;
  // Combine all attempt statuses for "contacted" calculation
  const attemptStatuses = ['attempt_1', 'attempt_2', 'attempt_3', 'attempt_4', 'attempt_5'];
  const totalAttempts = attemptStatuses.reduce((sum, status) => sum + (statusCounts[status] || 0), 0);

  return funnelStages.map((stage, index) => {
    // Each stage represents people who reached at least that stage
    const currentStageCount = statusCounts[stage.status] || 0;

    // Calculate how many are at or past this stage
    let atOrPastThisStage = 0;
    for (let i = index; i < funnelStages.length; i++) {
      atOrPastThisStage += statusCounts[funnelStages[i].status] || 0;
    }

    // Add back some exits that happened after reaching this stage
    if (index > 0) {
      atOrPastThisStage += Math.floor((phoneScreenFailed + notInterested) * (1 - index / funnelStages.length));
    } else {
      atOrPastThisStage = total;
    }

    return {
      name: stage.label,
      value: atOrPastThisStage,
      percentage: Math.round((atOrPastThisStage / total) * 100),
    };
  });
}

// Source performance data
export function getSourcePerformance() {
  const sources = ['Facebook', 'Google Ads', 'Instagram', 'Website', 'Referral'];

  return sources.map((source) => {
    // Simulate different conversion rates per source
    const conversionRates: Record<string, number> = {
      'Facebook': 28,
      'Google Ads': 35,
      'Instagram': 22,
      'Website': 42,
      'Referral': 55,
    };

    return {
      name: source,
      value: conversionRates[source] || 30,
      color: source === 'Referral' ? '#2E9B73' : source === 'Website' ? '#7B9FE0' : undefined,
    };
  });
}

// Status distribution for donut chart
export function getStatusDistribution() {
  const statusCounts: Record<string, number> = {};

  mockReferrals.forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const statusLabels: Record<string, string> = {
    new: 'New',
    attempt_1: 'Attempt 1',
    attempt_2: 'Attempt 2',
    attempt_3: 'Attempt 3',
    attempt_4: 'Attempt 4',
    attempt_5: 'Attempt 5',
    sent_sms: 'Sent SMS',
    appointment_scheduled: 'Scheduled',
    phone_screen_failed: 'Screen Failed',
    not_interested: 'Not Interested',
    signed_icf: 'Signed ICF',
  };

  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
      status: status as ReferralStatus,
    }))
    .sort((a, b) => b.value - a.value);
}

// Key metrics
export function getAnalyticsMetrics() {
  const total = mockReferrals.length;
  const signed = mockReferrals.filter((r) => r.status === 'signed_icf').length;
  const scheduled = mockReferrals.filter((r) => r.status === 'appointment_scheduled').length;
  const contactedStatuses = [
    'attempt_1', 'attempt_2', 'attempt_3', 'attempt_4', 'attempt_5',
    'sent_sms', 'appointment_scheduled', 'signed_icf'
  ];
  const contacted = mockReferrals.filter((r) =>
    contactedStatuses.includes(r.status)
  ).length;

  // Calculate average time to first contact (mock data)
  const avgTimeToContact = '2.3 hrs';

  // Calculate average conversion time (mock data)
  const avgConversionTime = '4.2 days';

  // SMS response rate (mock)
  const smsResponseRate = 68;

  // Best performing study
  const studyPerformance = mockStudies.map((study) => {
    const studyReferrals = mockReferrals.filter((r) => r.studyId === study.id);
    const studySigned = studyReferrals.filter((r) => r.status === 'signed_icf').length;
    return {
      name: study.name,
      conversionRate: studyReferrals.length > 0
        ? Math.round((studySigned / studyReferrals.length) * 100)
        : 0,
    };
  });

  const bestStudy = studyPerformance.reduce((best, current) =>
    current.conversionRate > best.conversionRate ? current : best
  );

  return {
    totalReferrals: total,
    signedCount: signed,
    scheduledCount: scheduled,
    contactedCount: contacted,
    conversionRate: Math.round((signed / total) * 100),
    avgTimeToContact,
    avgConversionTime,
    smsResponseRate,
    bestStudy: bestStudy.name,
    bestStudyRate: bestStudy.conversionRate,
  };
}

// Study comparison data
export function getStudyComparison() {
  return mockStudies.map((study) => {
    const studyReferrals = mockReferrals.filter((r) => r.studyId === study.id);
    const signed = studyReferrals.filter((r) => r.status === 'signed_icf').length;

    return {
      name: study.name.length > 15 ? study.name.substring(0, 15) + '...' : study.name,
      value: studyReferrals.length > 0
        ? Math.round((signed / studyReferrals.length) * 100)
        : 0,
      total: studyReferrals.length,
      signed,
    };
  });
}
