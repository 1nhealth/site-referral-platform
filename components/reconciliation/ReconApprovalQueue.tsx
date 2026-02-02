'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Download,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { mockPendingApprovals } from '@/lib/mock-data/reconciliation';
import type { PendingApproval, ReconStatusType } from '@/lib/types/reconciliation';

interface ReconApprovalQueueProps {
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const reconStatusColors: Record<ReconStatusType, string> = {
  ICF: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'ICF - SF': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Enrolled: 'bg-mint/10 text-mint border-mint/20',
  TBD: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

export function ReconApprovalQueue({ onApprove, onReject }: ReconApprovalQueueProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === mockPendingApprovals.length ? [] : mockPendingApprovals.map((a) => a.id)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleApprove = (id: string) => {
    onApprove?.(id);
  };

  const handleReject = (id: string) => {
    onReject?.(id);
  };

  const handleBulkApprove = () => {
    selectedItems.forEach((id) => onApprove?.(id));
    setSelectedItems([]);
  };

  const handleBulkReject = () => {
    selectedItems.forEach((id) => onReject?.(id));
    setSelectedItems([]);
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
          <h2 className="text-xl font-semibold text-text-primary">Pending Approvals</h2>
          <p className="text-text-secondary mt-1">
            Review and approve reconciliation decisions before invoicing
          </p>
        </div>
        <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
          Export All
        </Button>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Approval"
          value={mockPendingApprovals.length}
          icon={<Clock className="w-6 h-6 text-amber-500" />}
          accentColor="amber"
          delay={0}
        />
        <StatsCard
          title="Approved Today"
          value={12}
          icon={<ThumbsUp className="w-6 h-6 text-mint" />}
          accentColor="mint"
          delay={0.05}
        />
        <StatsCard
          title="Rejected Today"
          value={2}
          icon={<ThumbsDown className="w-6 h-6 text-red-500" />}
          accentColor="amber"
          delay={0.1}
        />
        <StatsCard
          title="Ready to Invoice"
          value={18}
          icon={<CheckCircle2 className="w-6 h-6 text-vista-blue" />}
          accentColor="blue"
          delay={0.15}
        />
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-mint/10 border border-mint/20"
          >
            <span className="text-sm font-medium text-mint">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ThumbsUp className="w-3 h-3" />}
                onClick={handleBulkApprove}
              >
                Approve Selected
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<ThumbsDown className="w-3 h-3" />}
                onClick={handleBulkReject}
              >
                Reject Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approvals Table */}
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
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === mockPendingApprovals.length}
                      onChange={toggleSelectAll}
                      className="rounded border-white/30 text-mint focus:ring-mint"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Study
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Lead
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Decided By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockPendingApprovals.map((approval, index) => (
                  <motion.tr
                    key={approval.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.03 }}
                    className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(approval.id)}
                        onChange={() => toggleSelect(approval.id)}
                        className="rounded border-white/30 text-mint focus:ring-mint"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-primary">{approval.studyName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-mint">{approval.subjectId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-primary">{approval.leadName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${reconStatusColors[approval.reconStatus]}`}
                      >
                        {approval.reconStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">{approval.decidedBy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">
                        {formatDate(approval.decidedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          onClick={() =>
                            setExpandedItem(expandedItem === approval.id ? null : approval.id)
                          }
                          className="p-1.5 rounded-lg text-text-muted hover:bg-white/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleApprove(approval.id)}
                          className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleReject(approval.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {/* Expanded Details */}
                {mockPendingApprovals.map((approval) => (
                  <AnimatePresence key={`expanded-${approval.id}`}>
                    {expandedItem === approval.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={8} className="bg-white/20 dark:bg-white/5 px-6 py-4">
                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                                Invoice Date
                              </p>
                              <p className="text-sm text-text-primary">
                                {approval.invoiceDate || 'Not set'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                                Decision Notes
                              </p>
                              <p className="text-sm text-text-primary">
                                {approval.notes || 'No notes'}
                              </p>
                            </div>
                            <div className="text-right">
                              <Button
                                variant="link"
                                size="sm"
                                rightIcon={<ExternalLink className="w-3 h-3" />}
                              >
                                View Full Match Details
                              </Button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
