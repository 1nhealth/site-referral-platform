'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Search, Check } from 'lucide-react';
import type { FormDefinition } from '@/lib/types/form-builder';
import { cn } from '@/lib/utils';

interface FormSelectorProps {
  selectedFormId: string | null;
  onSelectForm: (formId: string, form: FormDefinition) => void;
}

export function FormSelector({ selectedFormId, onSelectForm }: FormSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableForms, setAvailableForms] = useState<FormDefinition[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load forms from localStorage
  useEffect(() => {
    const forms: FormDefinition[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('form-')) {
        try {
          const form = JSON.parse(localStorage.getItem(key) || '');
          if (form && form.id && form.name) {
            forms.push(form);
          }
        } catch (e) {
          console.warn(`Failed to parse form: ${key}`);
        }
      }
    }
    // Sort by updated date, newest first
    forms.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setAvailableForms(forms);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedForm = availableForms.find((f) => f.id === selectedFormId);

  const filteredForms = availableForms.filter((form) =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (form: FormDefinition) => {
    onSelectForm(form.id, form);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3',
          'bg-white/50 dark:bg-white/5 backdrop-blur-sm',
          'border border-white/50 dark:border-white/10',
          'rounded-2xl transition-all duration-200',
          'hover:bg-white/60 dark:hover:bg-white/10',
          'focus:outline-none focus:ring-2 focus:ring-mint/50',
          isOpen && 'ring-2 ring-mint/50'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-mint/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-mint" />
          </div>
          <div className="text-left">
            {selectedForm ? (
              <>
                <p className="text-sm font-medium text-text-primary">{selectedForm.name}</p>
                <p className="text-xs text-text-muted">
                  {Object.keys(selectedForm.fields).length} fields
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-text-muted">Select a form</p>
                <p className="text-xs text-text-muted">Choose a form to build qualifications</p>
              </>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass-dropdown overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search forms..."
                  className={cn(
                    'w-full pl-9 pr-3 py-2 text-sm',
                    'bg-white/50 dark:bg-white/5',
                    'border border-white/50 dark:border-white/10',
                    'rounded-xl',
                    'placeholder:text-text-muted text-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-mint/50'
                  )}
                />
              </div>
            </div>

            {/* Form List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredForms.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-text-muted">
                    {availableForms.length === 0
                      ? 'No forms available. Create a form in the Form Builder first.'
                      : 'No forms match your search.'}
                  </p>
                </div>
              ) : (
                filteredForms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => handleSelect(form)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                      'transition-colors duration-150',
                      form.id === selectedFormId
                        ? 'bg-mint/10 text-mint'
                        : 'hover:bg-white/50 dark:hover:bg-white/5 text-text-primary'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        form.id === selectedFormId ? 'bg-mint/20' : 'bg-white/50 dark:bg-white/10'
                      )}
                    >
                      <FileText
                        className={cn(
                          'w-4 h-4',
                          form.id === selectedFormId ? 'text-mint' : 'text-text-muted'
                        )}
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">{form.name}</p>
                      <p className="text-xs text-text-muted">
                        {Object.keys(form.fields).length} fields · {form.status}
                      </p>
                    </div>
                    {form.id === selectedFormId && <Check className="w-4 h-4 text-mint" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
