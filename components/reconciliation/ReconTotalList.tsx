'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Download,
  RotateCcw,
  ArrowLeft,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { formatDate } from '@/lib/utils/matching';
import { useToast } from '@/components/ui/Toast';
import type { ReconciliationMatch, ReconciliationSummary } from '@/lib/types/reconciliation';

interface ReconTotalListProps {
  matches: ReconciliationMatch[];
  totalIRTRecords: number;
  onRemoveMatch: (irtRecordId: string) => void;
  onBackToMatching: () => void;
  onReset: () => void;
}

type FilterType = 'all' | 'matched' | 'no-match';

export function ReconTotalList({
  matches,
  totalIRTRecords,
  onRemoveMatch,
  onBackToMatching,
  onReset,
}: ReconTotalListProps) {
  const { addToast } = useToast();
  const [filter, setFilter] = useState<FilterType>('all');

  // Calculate summary stats
  const summary: ReconciliationSummary = useMemo(() => {
    const matched = matches.filter((m) => m.referralId !== null).length;
    const noMatch = matches.filter((m) => m.referralId === null).length;
    const skipped = totalIRTRecords - matches.length;
    const avgConfidence =
      matched > 0
        ? Math.round(
            matches
              .filter((m) => m.referralId !== null)
              .reduce((sum, m) => sum + m.confidenceScore, 0) / matched
          )
        : 0;

    return {
      totalIRTRecords,
      matched,
      noMatch,
      skipped,
      averageConfidence: avgConfidence,
    };
  }, [matches, totalIRTRecords]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    switch (filter) {
      case 'matched':
        return matches.filter((m) => m.referralId !== null);
      case 'no-match':
        return matches.filter((m) => m.referralId === null);
      default:
        return matches;
    }
  }, [matches, filter]);

  // Export to CSV
  const handleExport = () => {
    const headers = [
      'IRT Subject ID',
      'IRT DOB',
      'IRT ICF Date',
      'Referral ID',
      'Referral Name',
      'Referral DOB',
      'Confidence Score',
      'Match Status',
    ];

    const rows = matches.map((match) => [
      match.irtRecord.subjectId,
      match.irtRecord.dateOfBirth,
      match.irtRecord.icfSignDate || '',
      match.referralId || '',
      match.referral ? `${match.referral.firstName} ${match.referral.lastName}` : '',
      match.referral?.dateOfBirth || '',
      match.confidenceScore.toString(),
      match.referralId ? 'Matched' : 'No Match',
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconciliation-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Export Complete',
      message: `Exported ${matches.length} reconciliation records`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-card-inset rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vista-blue/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-vista-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {summary.totalIRTRecords}
              </p>
              <p className="text-sm text-text-muted">Total Records</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="glass-card-inset rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {summary.matched}
              </p>
              <p className="text-sm text-text-muted">Matched</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="glass-card-inset rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {summary.noMatch}
              </p>
              <p className="text-sm text-text-muted">No Match</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="glass-card-inset rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint/10 flex items-center justify-center">
              <span className="text-lg font-bold text-mint">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {summary.averageConfidence}%
              </p>
              <p className="text-sm text-text-muted">Avg Confidence</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skipped warning */}
      {summary.skipped > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {summary.skipped} record{summary.skipped > 1 ? 's were' : ' was'} skipped
            during matching. You can go back to complete them.
          </p>
          <Button variant="ghost" size="sm" onClick={onBackToMatching} className="ml-auto">
            Back to Matching
          </Button>
        </motion.div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'matched', 'no-match'] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${filter === f
                ? 'bg-mint/20 text-mint'
                : 'bg-white/40 dark:bg-white/5 text-text-muted hover:text-text-primary'
              }
            `}
          >
            {f === 'all'
              ? `All (${matches.length})`
              : f === 'matched'
                ? `Matched (${summary.matched})`
                : `No Match (${summary.noMatch})`}
          </button>
        ))}
      </div>

      {/* Matches table */}
      <div className="glass-card-inset rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/5">
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  IRT Subject
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  IRT DOB
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  Matched Referral
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  Confidence
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match, index) => (
                <motion.tr
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="border-b border-white/20 dark:border-white/5 last:border-b-0 hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-text-primary">
                      {match.irtRecord.subjectId}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-text-secondary">
                      {formatDate(match.irtRecord.dateOfBirth)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {match.referral ? (
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {match.referral.firstName} {match.referral.lastName}
                        </p>
                        <p className="text-xs text-text-muted">
                          DOB: {formatDate(match.referral.dateOfBirth)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted italic">No match</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {match.referralId ? (
                      <div className="w-32">
                        <ConfidenceIndicator
                          score={match.confidenceScore}
                          showLabel={false}
                          size="sm"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {match.referralId ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        No Match
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMatch(match.irtRecord.id)}
                      className="text-text-muted hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMatches.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-text-muted">No records match the current filter</p>
          </div>
        )}
      </div>

      {/* Dotted divider */}
      <div className="dotted-divider" />

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBackToMatching}
        >
          Back to Matching
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onReset}
          >
            Start Over
          </Button>
          <Button
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
