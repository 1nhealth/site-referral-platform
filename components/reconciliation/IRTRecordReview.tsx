'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/matching';
import type { IRTRecord } from '@/lib/types/reconciliation';

interface IRTRecordReviewProps {
  records: IRTRecord[];
  fileName: string;
  onProceed: () => void;
  onBack: () => void;
  onReset: () => void;
}

export function IRTRecordReview({
  records,
  fileName,
  onProceed,
  onBack,
  onReset,
}: IRTRecordReviewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter records based on search
  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;

    const term = searchTerm.toLowerCase();
    return records.filter(
      (record) =>
        record.subjectId.toLowerCase().includes(term) ||
        record.dateOfBirth.includes(term) ||
        record.initials?.toLowerCase().includes(term) ||
        record.firstName?.toLowerCase().includes(term) ||
        record.lastName?.toLowerCase().includes(term)
    );
  }, [records, searchTerm]);

  // Validation stats
  const validationStats = useMemo(() => {
    let valid = 0;
    let warnings = 0;

    records.forEach((record) => {
      const hasRequiredFields = record.subjectId && record.dateOfBirth;
      if (hasRequiredFields) {
        valid++;
      } else {
        warnings++;
      }
    });

    return { valid, warnings, total: records.length };
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vista-blue/10 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-vista-blue" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Review IRT Records
            </h2>
            <p className="text-sm text-text-muted">
              {fileName} &bull; {records.length} records
            </p>
          </div>
        </div>

        {/* Validation Summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-text-muted">
              {validationStats.valid} valid
            </span>
          </div>
          {validationStats.warnings > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-text-muted">
                {validationStats.warnings} warnings
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search by subject ID, DOB, initials, or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card-inset text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50"
        />
      </div>

      {/* Records Table */}
      <div className="glass-card-inset rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/5">
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  Subject ID
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  DOB
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  Initials
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  ICF Date
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  Enrollment
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => {
                const hasRequiredFields = record.subjectId && record.dateOfBirth;

                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-b border-white/20 dark:border-white/5 last:border-b-0 hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-text-primary">
                        {record.subjectId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-primary">
                        {formatDate(record.dateOfBirth)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-primary">
                        {record.initials || (record.firstName && record.lastName ? `${record.firstName[0].toUpperCase()}${record.lastName[0].toUpperCase()}` : '—')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        {formatDate(record.icfSignDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        {formatDate(record.enrollmentDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {hasRequiredFields ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Missing data
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-text-muted">No records match your search</p>
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
          onClick={onBack}
        >
          Back
        </Button>
        {records.length > 0 ? (
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onProceed}
          >
            Proceed to Matching
          </Button>
        ) : (
          <Button
            variant="primary"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onReset}
          >
            Start Over
          </Button>
        )}
      </div>
    </div>
  );
}
