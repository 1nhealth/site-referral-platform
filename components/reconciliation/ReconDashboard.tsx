'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  FileSpreadsheet,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ReconProgressBar } from './ReconProgressRing';
import {
  mockImports,
  mockPendingApprovals,
  mockStudies,
  getDashboardStats,
} from '@/lib/mock-data/reconciliation';
import type { ReconTab, IRTImport } from '@/lib/types/reconciliation';

interface ReconDashboardProps {
  onTabChange: (tab: ReconTab) => void;
  onSelectImport: (importData: IRTImport) => void;
}

export function ReconDashboard({ onTabChange, onSelectImport }: ReconDashboardProps) {
  const stats = getDashboardStats();
  const activeImports = mockImports.filter(
    (i) => i.status === 'in_review' || i.status === 'pending_review'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-text-primary">Welcome back</h2>
        <p className="text-text-secondary mt-1">
          Here&apos;s what&apos;s happening with your reconciliations today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={<Clock className="w-6 h-6 text-amber-500" />}
          accentColor="amber"
          delay={0}
          onView={() => onTabChange('matching')}
        />
        <StatsCard
          title="Awaiting Approval"
          value={stats.awaitingApproval}
          icon={<AlertCircle className="w-6 h-6 text-vista-blue" />}
          accentColor="blue"
          delay={0.05}
          onView={() => onTabChange('approvals')}
        />
        <StatsCard
          title="Completed This Week"
          value={stats.completedThisWeek}
          icon={<CheckCircle2 className="w-6 h-6 text-mint" />}
          accentColor="mint"
          trend={{ value: stats.completedTrend, direction: 'up' }}
          delay={0.1}
        />
        <StatsCard
          title="Total Matches"
          value={stats.totalMatches}
          suffix=""
          icon={<Users className="w-6 h-6 text-purple-500" />}
          accentColor="purple"
          delay={0.15}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Imports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <GlassCard padding="lg" animate={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Active Imports</h3>
              <button
                onClick={() => onTabChange('imports')}
                className="text-sm text-mint hover:text-mint-light flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {activeImports.length === 0 ? (
                <p className="text-text-muted text-sm py-4 text-center">No active imports</p>
              ) : (
                activeImports.slice(0, 3).map((imp) => (
                  <motion.div
                    key={imp.id}
                    className="glass-list-item flex items-center justify-between p-3 rounded-xl cursor-pointer"
                    onClick={() => onSelectImport(imp)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{imp.fileName}</p>
                        <p className="text-xs text-text-muted">
                          {imp.reviewedSubjects}/{imp.totalSubjects} reviewed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ReconProgressBar
                        progress={(imp.reviewedSubjects / imp.totalSubjects) * 100}
                        className="w-20"
                      />
                      <span
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${
                            imp.status === 'in_review'
                              ? 'bg-mint/10 text-mint border border-mint/20'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }
                        `}
                      >
                        {imp.status === 'in_review' ? 'In Review' : 'Pending'}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <GlassCard padding="lg" animate={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Pending Approvals</h3>
              <button
                onClick={() => onTabChange('approvals')}
                className="text-sm text-mint hover:text-mint-light flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {mockPendingApprovals.length === 0 ? (
                <p className="text-text-muted text-sm py-4 text-center">No pending approvals</p>
              ) : (
                mockPendingApprovals.slice(0, 4).map((approval) => (
                  <div
                    key={approval.id}
                    className="glass-list-item flex items-center justify-between p-3 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {approval.subjectId} → {approval.leadName}
                      </p>
                      <p className="text-xs text-text-muted">{approval.studyName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Study Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <GlassCard padding="lg" animate={false}>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Study Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockStudies.map((study, index) => (
              <motion.div
                key={study.id}
                className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-text-primary">{study.name}</h4>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-mint/10 text-mint border border-mint/20">
                    {study.code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-text-primary">
                      {24 + index * 8}
                    </p>
                    <p className="text-xs text-text-muted">Total ICFs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-mint">
                      {87 - index * 5}%
                    </p>
                    <p className="text-xs text-text-muted">Match Rate</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
