'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash2, Copy, Globe, Link as LinkIcon } from 'lucide-react';
import { useQualificationBuilder } from '@/lib/context/QualificationBuilderContext';
import { SituationConditionBuilder } from './SituationConditionBuilder';
import { AVAILABLE_LANGUAGES, type Situation } from '@/lib/types/qualification-builder';
import { cn } from '@/lib/utils';

interface SituationCardProps {
  situation: Situation;
  index: number;
}

export function SituationCard({ situation, index }: SituationCardProps) {
  const { updateSituation, removeSituation, duplicateSituation, state } = useQualificationBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(situation.name);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Focus input when editing
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNameSave = () => {
    if (editName.trim()) {
      updateSituation(situation.id, { name: editName.trim() });
    } else {
      setEditName(situation.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(situation.name);
      setIsEditing(false);
    }
  };

  const toggleExpand = () => {
    updateSituation(situation.id, { isExpanded: !situation.isExpanded });
  };

  const selectedLanguage = AVAILABLE_LANGUAGES.find((l) => l.value === situation.language);
  const canDelete = state.config && state.config.situations.length > 1;

  return (
    <div className="glass-card rounded-[32px] overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-5 py-4',
          'border-b border-white/10 dark:border-white/5',
          situation.isExpanded ? 'bg-white/20 dark:bg-white/5' : ''
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Expand/Collapse */}
          <button
            onClick={toggleExpand}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-white/50 dark:hover:bg-white/10',
              'text-text-muted hover:text-text-primary'
            )}
          >
            <ChevronDown
              className={cn(
                'w-5 h-5 transition-transform duration-200',
                situation.isExpanded && 'rotate-180'
              )}
            />
          </button>

          {/* Priority Badge */}
          <div className="w-7 h-7 rounded-lg bg-mint/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-mint">{index + 1}</span>
          </div>

          {/* Name */}
          {isEditing ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyDown}
              className={cn(
                'flex-1 min-w-0 px-2 py-1 text-sm font-medium',
                'bg-white/50 dark:bg-white/10 rounded-lg',
                'border border-mint/50',
                'focus:outline-none focus:ring-2 focus:ring-mint/50',
                'text-text-primary'
              )}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 min-w-0 text-left text-sm font-medium text-text-primary truncate hover:text-mint transition-colors"
            >
              {situation.name}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div ref={languageRef} className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium',
                'bg-white/30 dark:bg-white/10',
                'hover:bg-white/50 dark:hover:bg-white/15',
                'transition-colors text-text-secondary'
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              {selectedLanguage?.label || 'English'}
            </button>

            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 z-50 glass-dropdown py-1 min-w-[140px]"
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => {
                        updateSituation(situation.id, { language: lang.value });
                        setShowLanguageDropdown(false);
                      }}
                      className={cn(
                        'w-full px-3 py-1.5 text-left text-xs',
                        'hover:bg-white/50 dark:hover:bg-white/10',
                        'transition-colors',
                        lang.value === situation.language
                          ? 'text-mint font-medium'
                          : 'text-text-primary'
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Duplicate */}
          <button
            onClick={() => duplicateSituation(situation.id)}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-white/50 dark:hover:bg-white/10',
              'text-text-muted hover:text-text-primary'
            )}
            title="Duplicate situation"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => canDelete && removeSituation(situation.id)}
            disabled={!canDelete}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              canDelete
                ? 'hover:bg-error/10 text-text-muted hover:text-error'
                : 'text-text-muted/30 cursor-not-allowed'
            )}
            title={canDelete ? 'Delete situation' : 'Cannot delete the only situation'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {situation.isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Qualified URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                  <LinkIcon className="w-3.5 h-3.5" />
                  Qualified URL (Optional)
                </label>
                <input
                  type="url"
                  value={situation.qualifiedUrl || ''}
                  onChange={(e) => updateSituation(situation.id, { qualifiedUrl: e.target.value })}
                  placeholder="https://example.com/qualified"
                  className={cn(
                    'w-full px-4 py-2.5 text-sm',
                    'bg-white/50 dark:bg-white/5',
                    'border border-white/50 dark:border-white/10',
                    'rounded-xl',
                    'placeholder:text-text-muted text-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-mint/50'
                  )}
                />
                <p className="text-xs text-text-muted">
                  Redirect URL when this situation matches. Leave empty for no redirect.
                </p>
              </div>

              {/* Conditions */}
              <SituationConditionBuilder situation={situation} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
