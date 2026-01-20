'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, FileText, Clock, ArrowRight } from 'lucide-react';
import type { KBDocument } from '@/lib/mock-data/kb-categories';

interface KBDocumentCardProps {
  document: KBDocument;
  index: number;
  color?: 'mint' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan';
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  mint: { bg: 'bg-mint/10', text: 'text-mint', border: 'border-mint/20' },
  blue: { bg: 'bg-vista-blue/10', text: 'text-vista-blue', border: 'border-vista-blue/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

// Fake reading time based on title length
function getReadingTime(title: string): string {
  const words = title.split(' ').length;
  const minutes = Math.max(2, Math.min(8, words));
  return `${minutes} min read`;
}

export function KBDocumentCard({ document, index, color = 'mint' }: KBDocumentCardProps) {
  const colors = colorClasses[color] || colorClasses.mint;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="glass-modal-card rounded-2xl overflow-hidden flex flex-col group hover:scale-[1.02] transition-transform"
    >
      {/* Content */}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
            <FileText className={`w-5 h-5 ${colors.text}`} />
          </div>
          <h3 className="text-base font-semibold text-text-primary leading-tight pt-1">
            {document.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(document.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{getReadingTime(document.title)}</span>
          </div>
        </div>
      </div>

      {/* Read document button */}
      <Link
        href={`/kb/${document.categoryId}/${document.slug}`}
        className={`flex items-center justify-between px-5 py-3 border-t ${colors.border} text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors`}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Read document</span>
        </div>
        <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${colors.text}`} />
      </Link>
    </motion.div>
  );
}
