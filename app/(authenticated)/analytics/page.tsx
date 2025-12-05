'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Clock,
  MessageSquare,
  Target,
  Award,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProFeatureGate } from '@/components/ui/ProFeatureGate';
import { AreaChart, BarChart, FunnelChart, DonutChart } from '@/components/charts';
import {
  getReferralsOverTime,
  getConversionFunnel,
  getSourcePerformance,
  getStatusDistribution,
  getAnalyticsMetrics,
} from '@/lib/mock-data/analytics';

function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = 'mint',
  delay = 0,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  delay?: number;
}) {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    mint: { bg: 'bg-mint/10', text: 'text-mint' },
    vistaBlue: { bg: 'bg-vista-blue/10', text: 'text-vista-blue' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
  };

  const colors = colorClasses[color] || colorClasses.mint;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <GlassCard padding="md" className="h-full">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${colors.bg}`}>
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
            {subtext && (
              <p className="text-xs text-text-muted mt-1">{subtext}</p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function AnalyticsContent() {
  const referralsOverTime = getReferralsOverTime(30);
  const funnelData = getConversionFunnel();
  const sourceData = getSourcePerformance();
  const statusData = getStatusDistribution();
  const metrics = getAnalyticsMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>
        <p className="text-text-secondary mt-1">
          Track referral performance and conversion metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          subtext="Overall performance"
          color="mint"
          delay={0}
        />
        <MetricCard
          icon={Clock}
          label="Avg. Time to Contact"
          value={metrics.avgTimeToContact}
          subtext="First outreach"
          color="vistaBlue"
          delay={0.05}
        />
        <MetricCard
          icon={MessageSquare}
          label="SMS Response Rate"
          value={`${metrics.smsResponseRate}%`}
          subtext="Message engagement"
          color="purple"
          delay={0.1}
        />
        <MetricCard
          icon={Award}
          label="Best Study"
          value={`${metrics.bestStudyRate}%`}
          subtext={metrics.bestStudy}
          color="warning"
          delay={0.15}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referrals Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <GlassCard padding="lg">
            <div className="mb-4">
              <h3 className="font-semibold text-text-primary">Referrals Over Time</h3>
              <p className="text-sm text-text-muted">Last 30 days</p>
            </div>
            <AreaChart data={referralsOverTime} height={250} color="mint" />
          </GlassCard>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <GlassCard padding="lg">
            <div className="mb-4">
              <h3 className="font-semibold text-text-primary">Conversion Funnel</h3>
              <p className="text-sm text-text-muted">Referral journey stages</p>
            </div>
            <FunnelChart data={funnelData} height={250} />
          </GlassCard>
        </motion.div>

        {/* Source Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <GlassCard padding="lg">
            <div className="mb-4">
              <h3 className="font-semibold text-text-primary">Source Performance</h3>
              <p className="text-sm text-text-muted">Conversion rate by referral source</p>
            </div>
            <BarChart data={sourceData} height={250} layout="vertical" />
          </GlassCard>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <GlassCard padding="lg">
            <div className="mb-4">
              <h3 className="font-semibold text-text-primary">Status Distribution</h3>
              <p className="text-sm text-text-muted">Current referral statuses</p>
            </div>
            <DonutChart
              data={statusData}
              height={280}
              centerValue={metrics.totalReferrals}
              centerLabel="Total Referrals"
            />
          </GlassCard>
        </motion.div>
      </div>

      {/* Additional Metrics Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <GlassCard padding="lg">
          <h3 className="font-semibold text-text-primary mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-text-muted">Total Referrals</p>
              <p className="text-xl font-bold text-text-primary">{metrics.totalReferrals}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Signed</p>
              <p className="text-xl font-bold text-mint">{metrics.signedCount}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Scheduled</p>
              <p className="text-xl font-bold text-vista-blue">{metrics.scheduledCount}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Avg. Conversion Time</p>
              <p className="text-xl font-bold text-purple-500">{metrics.avgConversionTime}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProFeatureGate
      featureName="Advanced Analytics"
      description="Track referral performance, conversion funnels, and source effectiveness with detailed charts and metrics."
    >
      <AnalyticsContent />
    </ProFeatureGate>
  );
}
