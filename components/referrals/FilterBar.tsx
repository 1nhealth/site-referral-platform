'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import { GlassCard } from '@/components/ui/GlassCard';
import { mockStudies } from '@/lib/mock-data/studies';
import { mockUsers } from '@/lib/mock-data/users';
import type { ReferralStatus } from '@/lib/types';
import { statusConfigs } from '@/lib/types';

export interface FilterState {
  search: string;
  statuses: ReferralStatus[];
  studyIds: string[];
  assignedTo: string[];
  sortBy: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'last_contacted';
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalCount: number;
  filteredCount: number;
}

const statusOptions: DropdownOption[] = (
  Object.keys(statusConfigs) as ReferralStatus[]
).map((status) => ({
  value: status,
  label: statusConfigs[status].label,
}));

const studyOptions: DropdownOption[] = mockStudies.map((study) => ({
  value: study.id,
  label: study.name,
}));

const userOptions: DropdownOption[] = [
  { value: 'unassigned', label: 'Unassigned' },
  ...mockUsers.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  })),
];

const sortOptions: DropdownOption[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'last_contacted', label: 'Last Contacted' },
];

export function FilterBar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.statuses.length > 0 ||
    filters.studyIds.length > 0 ||
    filters.assignedTo.length > 0;

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.statuses.length +
    filters.studyIds.length +
    filters.assignedTo.length;

  const handleReset = () => {
    onFiltersChange({
      search: '',
      statuses: [],
      studyIds: [],
      assignedTo: [],
      sortBy: 'newest',
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="
              w-full pl-10 pr-4 py-2.5
              bg-bg-secondary/50 dark:bg-bg-tertiary/50
              border border-glass-border
              rounded-xl
              text-text-primary
              placeholder:text-text-muted
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
            "
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Status Filter */}
        <div className="w-48">
          <Dropdown
            options={statusOptions}
            value={filters.statuses}
            onChange={(value) =>
              onFiltersChange({ ...filters, statuses: value as ReferralStatus[] })
            }
            placeholder="Status"
            multiple
            searchable
          />
        </div>

        {/* Study Filter */}
        <div className="w-48">
          <Dropdown
            options={studyOptions}
            value={filters.studyIds}
            onChange={(value) =>
              onFiltersChange({ ...filters, studyIds: value as string[] })
            }
            placeholder="Study"
            multiple
            searchable
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant={showAdvanced ? 'secondary' : 'ghost'}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="relative"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-mint text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Sort */}
        <div className="w-44">
          <Dropdown
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) =>
              onFiltersChange({ ...filters, sortBy: value as FilterState['sortBy'] })
            }
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-bg-tertiary/50 rounded-xl">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-mint text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-mint text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard padding="md" className="mt-2">
              <div className="flex items-end gap-4">
                {/* Assigned To */}
                <div className="w-56">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Assigned To
                  </label>
                  <Dropdown
                    options={userOptions}
                    value={filters.assignedTo}
                    onChange={(value) =>
                      onFiltersChange({ ...filters, assignedTo: value as string[] })
                    }
                    placeholder="Anyone"
                    multiple
                  />
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleReset}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          Showing <span className="font-medium text-text-primary">{filteredCount}</span>
          {filteredCount !== totalCount && (
            <> of <span className="font-medium text-text-primary">{totalCount}</span></>
          )}{' '}
          referrals
        </span>

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Active filters:</span>
            <div className="flex gap-1.5">
              {filters.statuses.map((status) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-mint/20 text-mint rounded-lg text-xs"
                >
                  {statusConfigs[status].label}
                  <button
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        statuses: filters.statuses.filter((s) => s !== status),
                      })
                    }
                    className="hover:bg-mint/30 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.studyIds.map((studyId) => {
                const study = mockStudies.find((s) => s.id === studyId);
                return study ? (
                  <span
                    key={studyId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-500 rounded-lg text-xs"
                  >
                    {study.name}
                    <button
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          studyIds: filters.studyIds.filter((id) => id !== studyId),
                        })
                      }
                      className="hover:bg-purple-500/30 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
