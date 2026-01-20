'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Settings,
  FlaskConical,
  TestTube2,
  Search,
  KeyRound,
  LifeBuoy,
  ArrowRight,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import type { KBCategory } from '@/lib/mock-data/kb-categories';

const iconMap: Record<string, LucideIcon> = {
  Settings,
  FlaskConical,
  TestTube2,
  Search,
  KeyRound,
  LifeBuoy,
};

const colorClasses: Record<string, { bg: string; text: string }> = {
  mint: { bg: 'bg-mint/15', text: 'text-mint' },
  blue: { bg: 'bg-vista-blue/15', text: 'text-vista-blue' },
  purple: { bg: 'bg-purple-500/15', text: 'text-purple-500' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-500' },
  rose: { bg: 'bg-rose-500/15', text: 'text-rose-500' },
  cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-500' },
};

interface KBCategoryCardProps {
  category: KBCategory;
  index: number;
}

export function KBCategoryCard({ category, index }: KBCategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Settings;
  const colors = colorClasses[category.color] || colorClasses.mint;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="glass-modal-card p-6 rounded-3xl flex flex-col h-full"
    >
      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <IconComponent className={`w-5 h-5 ${colors.text}`} />
        </div>
        <h3 className="text-base font-semibold text-text-primary leading-tight">
          {category.name}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4">
        {category.description}
      </p>

      {/* Document links */}
      <div className="space-y-2.5 mb-5 flex-1">
        {category.documents.slice(0, 3).map((doc) => (
          <Link
            key={doc.id}
            href={`/kb/${category.id}/${doc.slug}`}
            className="flex items-start gap-2 text-sm text-mint hover:text-mint-light transition-colors group"
          >
            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-mint/70 group-hover:translate-x-0.5 transition-transform" />
            <span className="leading-tight">{doc.title}</span>
          </Link>
        ))}
      </div>

      {/* View all button */}
      <Link
        href={`/kb/${category.id}`}
        className="inline-flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-text-primary glass-button rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
      >
        <span>View all documents</span>
        <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-mint group-hover:translate-x-0.5 transition-all" />
      </Link>
    </motion.div>
  );
}
