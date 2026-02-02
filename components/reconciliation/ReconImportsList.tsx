'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  Clock,
  Eye,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ReconProgressBar } from './ReconProgressRing';
import { mockImports } from '@/lib/mock-data/reconciliation';
import type { IRTImport, IRTImportStatus } from '@/lib/types/reconciliation';

interface ReconImportsListProps {
  selectedStudyId?: string;
  onSelectImport: (importData: IRTImport) => void;
  onNewImport?: () => void;
}

type StatusFilter = 'all' | IRTImportStatus;

const statusConfig: Record<
  IRTImportStatus,
  { label: string; icon: React.ElementType; variant: string }
> = {
  uploaded: {
    label: 'Uploaded',
    icon: Upload,
    variant: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  },
  processing: {
    label: 'Processing',
    icon: RefreshCw,
    variant: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  pending_review: {
    label: 'Pending Review',
    icon: Clock,
    variant: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  in_review: {
    label: 'In Review',
    icon: Eye,
    variant: 'bg-mint/10 text-mint border-mint/20',
  },
  pending_approval: {
    label: 'Pending Approval',
    icon: AlertCircle,
    variant: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    variant: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
};

export function ReconImportsList({
  selectedStudyId,
  onSelectImport,
  onNewImport,
}: ReconImportsListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter imports
  const filteredImports = mockImports.filter((imp) => {
    if (selectedStudyId && imp.studyId !== selectedStudyId) return false;
    if (statusFilter !== 'all' && imp.status !== statusFilter) return false;
    return true;
  });

  // Stats
  const totalImports = mockImports.length;
  const pendingReview = mockImports.filter(
    (i) => i.status === 'in_review' || i.status === 'pending_review'
  ).length;
  const completed = mockImports.filter((i) => i.status === 'completed').length;
  const pendingApproval = mockImports.filter((i) => i.status === 'pending_approval').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const StatusBadge = ({ status }: { status: IRTImportStatus }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.variant}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold text-text-primary">IRT Imports</h2>
          <p className="text-text-secondary mt-1">
            Manage and review IRT file imports for reconciliation
          </p>
        </div>
        <Button leftIcon={<Upload className="w-4 h-4" />} onClick={onNewImport}>
          New Import
        </Button>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Imports"
          value={totalImports}
          icon={<FileSpreadsheet className="w-6 h-6 text-vista-blue" />}
          accentColor="blue"
          delay={0}
        />
        <StatsCard
          title="Pending Review"
          value={pendingReview}
          icon={<Clock className="w-6 h-6 text-amber-500" />}
          accentColor="amber"
          delay={0.05}
        />
        <StatsCard
          title="Completed"
          value={completed}
          icon={<CheckCircle2 className="w-6 h-6 text-mint" />}
          accentColor="mint"
          delay={0.1}
        />
        <StatsCard
          title="Pending Approval"
          value={pendingApproval}
          icon={<AlertCircle className="w-6 h-6 text-amber-500" />}
          accentColor="amber"
          delay={0.15}
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedStudyId && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-mint/10 text-mint border border-mint/20">
              <span className="text-text-muted">STUDY:</span>
              {mockImports.find((i) => i.studyId === selectedStudyId)?.studyName || 'All Studies'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Status:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-sm font-medium
                bg-white/50 dark:bg-white/10 border border-white/50 dark:border-white/10
                text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50
                cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="in_review">In Review</option>
              <option value="pending_review">Pending Review</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Imports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <GlassCard padding="none" animate={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Import Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    File Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Imported By
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredImports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <AlertCircle className="w-8 h-8 text-text-muted mx-auto mb-2" />
                      <p className="text-text-muted">No imports found</p>
                    </td>
                  </tr>
                ) : (
                  filteredImports.map((imp, index) => (
                    <motion.tr
                      key={imp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.03 }}
                      className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => onSelectImport(imp)}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-primary">
                          {formatDate(imp.importDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-text-primary">
                            {imp.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={imp.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ReconProgressBar
                            progress={(imp.reviewedSubjects / imp.totalSubjects) * 100}
                            className="w-24"
                          />
                          <span className="text-sm text-text-secondary">
                            {imp.reviewedSubjects}/{imp.totalSubjects}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">{imp.importedBy}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant={imp.status === 'in_review' ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectImport(imp);
                          }}
                        >
                          {imp.status === 'in_review' ? 'Continue' : 'View'}
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
