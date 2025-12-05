import { mockReferrals } from './referrals';
import { mockStudies } from './studies';

export interface AIInsight {
  id: string;
  type: 'timing' | 'priority' | 'warning' | 'tip';
  icon: string;
  title: string;
  description: string;
  referralId?: string;
  referralName?: string;
  studyName?: string;
  actionLabel?: string;
}

// Generate contextual AI insights based on referral data
export function generateInsights(): AIInsight[] {
  const insights: AIInsight[] = [];

  // Find referrals with high potential (multiple contact attempts but still active)
  const highPotential = mockReferrals.filter(
    (r) => ['attempt_1', 'attempt_2', 'sent_sms'].includes(r.status) && r.lastContactedAt
  );

  if (highPotential.length > 0) {
    const priority = highPotential[0];
    insights.push({
      id: 'priority-1',
      type: 'priority',
      icon: '📈',
      title: `${priority.firstName} ${priority.lastName} has 78% predicted conversion`,
      description: 'Based on engagement patterns, prioritize follow-up today.',
      referralId: priority.id,
      referralName: `${priority.firstName} ${priority.lastName}`,
      actionLabel: 'View Referral',
    });
  }

  // Best time to call suggestion
  const newReferrals = mockReferrals.filter((r) => r.status === 'new');
  if (newReferrals.length > 0) {
    const targetReferral = newReferrals[0];
    const hours = ['9-11 AM', '2-4 PM', '10 AM-12 PM', '1-3 PM'];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];

    insights.push({
      id: 'timing-1',
      type: 'timing',
      icon: '🎯',
      title: `Best time to call ${targetReferral.firstName}: Today ${randomHour}`,
      description: 'Based on similar patient demographics and past engagement.',
      referralId: targetReferral.id,
      referralName: `${targetReferral.firstName} ${targetReferral.lastName}`,
      actionLabel: 'Schedule Call',
    });
  }

  // Warning for overdue contacts
  const now = new Date();
  const overdueReferrals = mockReferrals.filter((r) => {
    if (!r.lastContactedAt || r.status === 'signed_icf') return false;
    const lastContact = new Date(r.lastContactedAt);
    const daysSinceContact = Math.floor(
      (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceContact >= 3;
  });

  if (overdueReferrals.length > 0) {
    insights.push({
      id: 'warning-1',
      type: 'warning',
      icon: '⚠️',
      title: `${overdueReferrals.length} referrals haven't been contacted in 3+ days`,
      description: 'Response rates drop 40% after 3 days. Consider prioritizing outreach.',
      actionLabel: 'View All',
    });
  }

  // Study performance tip
  const studyPerformance = mockStudies.map((study) => {
    const studyReferrals = mockReferrals.filter((r) => r.studyId === study.id);
    const signed = studyReferrals.filter((r) => r.status === 'signed_icf').length;
    return {
      study,
      conversionRate: studyReferrals.length > 0
        ? Math.round((signed / studyReferrals.length) * 100)
        : 0,
    };
  });

  const bestStudy = studyPerformance.reduce((best, current) =>
    current.conversionRate > best.conversionRate ? current : best
  );

  const sources = ['Facebook ads', 'Google Ads', 'website referrals', 'Instagram'];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];

  insights.push({
    id: 'tip-1',
    type: 'tip',
    icon: '💡',
    title: `${bestStudy.study.name} has highest conversion from ${randomSource}`,
    description: `${bestStudy.conversionRate}% conversion rate. Consider increasing ad spend for this channel.`,
    studyName: bestStudy.study.name,
    actionLabel: 'View Analytics',
  });

  return insights.slice(0, 4); // Return max 4 insights
}

// Rotate through different insight sets for demo variety
let insightRotation = 0;

export function getRotatingInsights(): AIInsight[] {
  const baseInsights = generateInsights();

  // Add some variety by rotating additional insights
  const additionalInsights: AIInsight[] = [
    {
      id: 'tip-2',
      type: 'tip',
      icon: '📱',
      title: 'SMS response rate peaked between 10 AM - 2 PM',
      description: 'Send follow-up messages during this window for better engagement.',
      actionLabel: 'Send SMS',
    },
    {
      id: 'priority-2',
      type: 'priority',
      icon: '🔥',
      title: 'Hot lead: 3 patients viewed consent form this week',
      description: 'They may be ready to schedule. Reach out today.',
      actionLabel: 'View List',
    },
    {
      id: 'timing-2',
      type: 'timing',
      icon: '📅',
      title: 'Tuesdays have 23% higher appointment completion',
      description: 'Consider scheduling more appointments mid-week.',
      actionLabel: 'View Calendar',
    },
  ];

  // Rotate one additional insight in
  const rotatedInsight = additionalInsights[insightRotation % additionalInsights.length];
  insightRotation++;

  return [baseInsights[0], baseInsights[1], rotatedInsight, baseInsights[3] || baseInsights[2]].filter(Boolean);
}
