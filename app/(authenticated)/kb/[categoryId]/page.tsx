'use client';

import { useState, useMemo, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Command,
  ChevronRight,
  FileText,
  Settings,
  FlaskConical,
  TestTube2,
  KeyRound,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import { KBSidebar } from '@/components/kb/KBSidebar';
import { KBDocumentCard } from '@/components/kb/KBDocumentCard';
import { getCategoryById } from '@/lib/mock-data/kb-categories';

const iconMap: Record<string, LucideIcon> = {
  Settings,
  FlaskConical,
  TestTube2,
  Search: Search,
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

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export default function KBCategoryPage({ params }: PageProps) {
  const { categoryId } = use(params);
  const category = getCategoryById(categoryId);
  const [searchQuery, setSearchQuery] = useState('');

  if (!category) {
    notFound();
  }

  const IconComponent = iconMap[category.icon] || Settings;
  const colors = colorClasses[category.color] || colorClasses.mint;

  // Filter documents based on search
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return category.documents;
    const lowerQuery = searchQuery.toLowerCase();
    return category.documents.filter((doc) =>
      doc.title.toLowerCase().includes(lowerQuery)
    );
  }, [category.documents, searchQuery]);

  // Split category name for styling (first word normal, rest in mint)
  const nameParts = category.name.split(' ');
  const firstWord = nameParts[0];
  const restOfName = nameParts.slice(1).join(' ');

  return (
    <div className="flex h-[calc(100vh-4rem)] -mx-6 -mt-6">
      {/* Sidebar */}
      <KBSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header Section */}
        <div className="pt-4">
          <div className="px-8 pb-6">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-text-muted mb-6"
            >
              <Link href="/kb-categories" className="hover:text-text-primary transition-colors">
                Knowledge Base
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-text-primary font-medium">{category.name}</span>
            </motion.nav>

            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-4 mb-6"
            >
              <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}>
                <IconComponent className={`w-7 h-7 ${colors.text}`} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-text-primary mb-1">
                  {firstWord} <span className="text-mint">{restOfName}</span>
                </h1>
                <p className="text-text-secondary">{category.description}</p>
              </div>
            </motion.div>

            {/* Search and Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center justify-between gap-4"
            >
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-12 pr-16 py-2.5 text-sm font-medium rounded-full
                    bg-white/80 dark:bg-slate-800/60
                    border border-white/90 dark:border-slate-700/50
                    text-text-primary placeholder:text-text-muted
                    focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint
                    hover:bg-white/90 dark:hover:bg-slate-700/60
                    transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-muted">
                  <Command className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">K</span>
                </div>
              </div>

              {/* Document Count Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-button">
                <FileText className={`w-4 h-4 ${colors.text}`} />
                <span className="text-sm font-medium text-text-primary">
                  {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocuments.map((doc, index) => (
              <KBDocumentCard
                key={doc.id}
                document={doc}
                index={index}
                color={category.color}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredDocuments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-modal-card rounded-3xl p-12 text-center"
            >
              <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                <Search className={`w-8 h-8 ${colors.text}`} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No documents found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search terms
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
