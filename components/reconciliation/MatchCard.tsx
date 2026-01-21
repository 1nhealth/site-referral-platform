'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Calendar, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { formatDate, getConfidenceColor } from '@/lib/utils/matching';
import { statusConfigs } from '@/lib/types';
import type { MatchCandidate } from '@/lib/types/reconciliation';

interface MatchCardProps {
  candidate: MatchCandidate;
  rank: number;
  onSelect: () => void;
  isSelected?: boolean;
}

export function MatchCard({ candidate, rank, onSelect, isSelected }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { referral, confidenceScore, matchReasons } = candidate;
  const colors = getConfidenceColor(confidenceScore);
  const statusConfig = statusConfigs[referral.status];

  return (
    <motion.div
      layout
      className={`
        glass-card-inset rounded-xl overflow-hidden transition-all duration-200
        ${isSelected ? 'ring-2 ring-mint' : 'hover:ring-1 hover:ring-mint/30'}
      `}
    >
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Referral info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Rank badge */}
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-semibold text-sm
                ${rank === 1 ? 'bg-mint/20 text-mint' : 'bg-slate-100 dark:bg-slate-800 text-text-muted'}
              `}
            >
              {rank}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name and status */}
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-text-primary">
                  {referral.firstName} {referral.lastName}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig.bgClass}`}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Key info */}
              <div className="flex items-center gap-4 mt-1.5 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  DOB: {formatDate(referral.dateOfBirth)}
                </span>
                {referral.appointmentDate && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Appt: {formatDate(referral.appointmentDate)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Confidence and action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-36">
              <ConfidenceIndicator score={confidenceScore} showLabel={false} size="sm" />
            </div>
            <Button
              variant={isSelected ? 'secondary' : 'primary'}
              size="sm"
              onClick={onSelect}
              disabled={isSelected}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>

        {/* Match reasons toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 mt-3 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? 'Hide' : 'Show'} match details
        </button>
      </div>

      {/* Expanded match reasons */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-glass-border/50"
          >
            <div className="p-4 pt-3 space-y-2">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                Match Reasons
              </p>
              {matchReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-text-secondary">{reason.details}</span>
                  </div>
                  <span className={`font-medium ${colors.text}`}>
                    +{reason.weight} pts
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-glass-border/50">
                <span className="text-sm font-medium text-text-primary">
                  Total Score
                </span>
                <span className={`font-semibold ${colors.text}`}>
                  {confidenceScore} pts
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
