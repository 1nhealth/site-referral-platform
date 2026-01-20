'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import { KBCategoryCard } from '@/components/kb/KBCategoryCard';
import { kbCategories, searchCategories } from '@/lib/mock-data/kb-categories';

export default function KBCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return kbCategories;
    return searchCategories(searchQuery);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center pt-4"
      >
        <h1 className="text-3xl font-semibold text-text-primary">
          Explore <span className="text-mint">1nData</span> Categories
        </h1>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docs"
            className="w-full pl-12 pr-16 py-3 text-sm font-medium rounded-full
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
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <KBCategoryCard
            key={category.id}
            category={category}
            index={index}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-modal-card rounded-3xl p-12 text-center"
        >
          <Search className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No categories found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your search terms or browse all categories
          </p>
        </motion.div>
      )}
    </div>
  );
}
