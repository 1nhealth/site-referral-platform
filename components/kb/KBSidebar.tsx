'use client';

import Link from 'next/link';
import {
  ChevronRight,
  MessageSquare,
  ChevronsUpDown,
  Settings,
  FlaskConical,
  TestTube2,
  Search,
  KeyRound,
  LifeBuoy,
  Send,
  Newspaper,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { kbCategories } from '@/lib/mock-data/kb-categories';

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

export function KBSidebar() {
  return (
    <div className="w-64 shrink-0 h-full py-3 pl-3">
      <div className="floating-sidebar h-full flex flex-col rounded-l-xl">
        {/* Header */}
        <div className="p-4">
          <Link
            href="/kb-categories"
            className="flex items-center justify-between w-full px-3 py-2 rounded-full hover:bg-mint/10 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-mint/15 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-mint" />
              </div>
              <span className="text-sm font-medium text-text-primary">1nData</span>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-text-muted" />
          </Link>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 glass-scrollbar">
          {kbCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Settings;
            const colors = colorClasses[category.color] || colorClasses.mint;

            return (
              <div key={category.id}>
                {/* Category Header */}
                <Link
                  href={`/kb/${category.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-full transition-all hover:bg-mint/10"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
                    <IconComponent className={`w-3.5 h-3.5 ${colors.text}`} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-primary">
                    {category.name}
                  </span>
                </Link>

                {/* Document Links */}
                <div className="mt-1 space-y-0.5">
                  {category.documents.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/kb/${category.id}/${doc.slug}`}
                      className="flex items-center justify-between px-3 py-1.5 rounded-full text-xs transition-all group ml-8 text-text-secondary hover:text-mint hover:bg-mint/10"
                    >
                      <span className="truncate">{doc.title}</span>
                      <ChevronRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-mint transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Links */}
        <div className="p-3 border-t border-white/10 space-y-0.5">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-full text-sm transition-all text-text-secondary hover:text-text-primary hover:bg-mint/10"
          >
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4" />
              <span>Support</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-full text-sm transition-all text-text-secondary hover:text-text-primary hover:bg-mint/10"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Feature Request</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-full text-sm transition-all text-text-secondary hover:text-text-primary hover:bg-mint/10"
          >
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span>Release Notes</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>
        </div>
      </div>
    </div>
  );
}
