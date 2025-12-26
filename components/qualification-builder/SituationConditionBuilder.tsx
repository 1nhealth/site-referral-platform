'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, Search, Check, X } from 'lucide-react';
import { useQualificationBuilder } from '@/lib/context/QualificationBuilderContext';
import {
  type Situation,
  type QualificationConditionGroup,
  type QualificationCondition,
  createEmptyCondition,
} from '@/lib/types/qualification-builder';
import type { FieldConfig, ConditionOperator } from '@/lib/types/form-builder';
import {
  getOperatorsForFieldType,
  getOperatorLabel,
  operatorRequiresValue,
} from '@/lib/utils/condition-evaluator';
import { cn } from '@/lib/utils';

interface SituationConditionBuilderProps {
  situation: Situation;
}

export function SituationConditionBuilder({ situation }: SituationConditionBuilderProps) {
  const { updateConditionGroup, addConditionGroup, removeConditionGroup, updateSituation, availableFields } =
    useQualificationBuilder();

  const handleUpdateCondition = (
    groupId: string,
    conditionId: string,
    updates: Partial<QualificationCondition>
  ) => {
    const group = situation.conditionGroups.find((g) => g.id === groupId);
    if (!group) return;

    const updatedConditions = group.conditions.map((c) =>
      c.id === conditionId ? { ...c, ...updates } : c
    );

    updateConditionGroup(situation.id, { ...group, conditions: updatedConditions });
  };

  const handleAddCondition = (groupId: string) => {
    const group = situation.conditionGroups.find((g) => g.id === groupId);
    if (!group) return;

    const newCondition = createEmptyCondition();
    updateConditionGroup(situation.id, {
      ...group,
      conditions: [...group.conditions, newCondition],
    });
  };

  const handleRemoveCondition = (groupId: string, conditionId: string) => {
    const group = situation.conditionGroups.find((g) => g.id === groupId);
    if (!group) return;

    // If this is the last condition in the group, remove the group instead
    if (group.conditions.length === 1) {
      if (situation.conditionGroups.length > 1) {
        removeConditionGroup(situation.id, groupId);
      }
      return;
    }

    updateConditionGroup(situation.id, {
      ...group,
      conditions: group.conditions.filter((c) => c.id !== conditionId),
    });
  };

  const handleGroupLogicToggle = (groupId: string) => {
    const group = situation.conditionGroups.find((g) => g.id === groupId);
    if (!group) return;

    updateConditionGroup(situation.id, {
      ...group,
      logic: group.logic === 'and' ? 'or' : 'and',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary">When</label>
        {situation.conditionGroups.length > 1 && (
          <button
            onClick={() =>
              updateSituation(situation.id, {
                groupLogic: situation.groupLogic === 'and' ? 'or' : 'and',
              })
            }
            className={cn(
              'px-2 py-0.5 rounded-md text-xs font-medium transition-colors',
              situation.groupLogic === 'and'
                ? 'bg-mint/15 text-mint'
                : 'bg-vista-blue/15 text-vista-blue'
            )}
          >
            {situation.groupLogic.toUpperCase()} between groups
          </button>
        )}
      </div>

      <div className="space-y-3">
        {situation.conditionGroups.map((group, groupIndex) => (
          <div key={group.id}>
            {/* Group logic connector */}
            {groupIndex > 0 && (
              <div className="flex items-center gap-3 py-2">
                <button
                  onClick={() =>
                    updateSituation(situation.id, {
                      groupLogic: situation.groupLogic === 'and' ? 'or' : 'and',
                    })
                  }
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors',
                    situation.groupLogic === 'and'
                      ? 'bg-mint/15 text-mint hover:bg-mint/25'
                      : 'bg-vista-blue/15 text-vista-blue hover:bg-vista-blue/25'
                  )}
                >
                  {situation.groupLogic.toUpperCase()}
                </button>
                <div
                  className="flex-1 h-px"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
                    backgroundSize: '8px 1px',
                    backgroundRepeat: 'repeat-x',
                  }}
                />
              </div>
            )}

            {/* Condition Group */}
            <ConditionGroup
              group={group}
              fields={availableFields}
              onUpdateCondition={(conditionId, updates) =>
                handleUpdateCondition(group.id, conditionId, updates)
              }
              onAddCondition={() => handleAddCondition(group.id)}
              onRemoveCondition={(conditionId) => handleRemoveCondition(group.id, conditionId)}
              onToggleLogic={() => handleGroupLogicToggle(group.id)}
              canRemoveGroup={situation.conditionGroups.length > 1}
              onRemoveGroup={() => removeConditionGroup(situation.id, group.id)}
            />
          </div>
        ))}
      </div>

      {/* Add Group Button */}
      <button
        onClick={() => addConditionGroup(situation.id)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-xs font-medium',
          'text-text-secondary hover:text-mint',
          'transition-colors'
        )}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Group
      </button>
    </div>
  );
}

// ============================================
// Condition Group Component
// ============================================

interface ConditionGroupProps {
  group: QualificationConditionGroup;
  fields: FieldConfig[];
  onUpdateCondition: (conditionId: string, updates: Partial<QualificationCondition>) => void;
  onAddCondition: () => void;
  onRemoveCondition: (conditionId: string) => void;
  onToggleLogic: () => void;
  canRemoveGroup: boolean;
  onRemoveGroup: () => void;
}

function ConditionGroup({
  group,
  fields,
  onUpdateCondition,
  onAddCondition,
  onRemoveCondition,
  onToggleLogic,
  canRemoveGroup,
  onRemoveGroup,
}: ConditionGroupProps) {
  return (
    <div className="glass-card-inset rounded-2xl p-4 space-y-2">
      {group.conditions.map((condition, index) => (
        <div key={condition.id}>
          {/* Logic connector between conditions */}
          {index > 0 && (
            <div className="flex items-center gap-2 py-1.5 pl-4">
              <button
                onClick={onToggleLogic}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors',
                  group.logic === 'and'
                    ? 'bg-mint/15 text-mint hover:bg-mint/25'
                    : 'bg-vista-blue/15 text-vista-blue hover:bg-vista-blue/25'
                )}
              >
                {group.logic.toUpperCase()}
              </button>
              <div
                className="flex-1 h-px"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgb(156 163 175 / 0.3) 1px, transparent 1px)',
                  backgroundSize: '6px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />
            </div>
          )}

          <ConditionRow
            condition={condition}
            fields={fields}
            onUpdate={(updates) => onUpdateCondition(condition.id, updates)}
            onRemove={() => onRemoveCondition(condition.id)}
            canRemove={group.conditions.length > 1 || canRemoveGroup}
          />
        </div>
      ))}

      {/* Add condition button */}
      <button
        onClick={onAddCondition}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 text-xs',
          'text-text-muted hover:text-mint',
          'transition-colors'
        )}
      >
        <Plus className="w-3 h-3" />
        Add Condition
      </button>
    </div>
  );
}

// ============================================
// Condition Row Component
// ============================================

interface ConditionRowProps {
  condition: QualificationCondition;
  fields: FieldConfig[];
  onUpdate: (updates: Partial<QualificationCondition>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function ConditionRow({ condition, fields, onUpdate, onRemove, canRemove }: ConditionRowProps) {
  const selectedField = fields.find((f) => f.id === condition.fieldId);
  const operators = selectedField
    ? getOperatorsForFieldType(selectedField.type)
    : ['equals', 'not_equals'] as ConditionOperator[];
  const showValueInput = operatorRequiresValue(condition.operator);

  return (
    <div className="flex items-center gap-2">
      {/* Field Selector */}
      <div className="flex-1 min-w-[180px]">
        <FieldSelector
          fields={fields}
          selectedFieldId={condition.fieldId}
          onSelect={(fieldId) => {
            const field = fields.find((f) => f.id === fieldId);
            if (field) {
              const fieldOperators = getOperatorsForFieldType(field.type);
              onUpdate({
                fieldId,
                operator: fieldOperators[0] || 'equals',
                value: '',
              });
            }
          }}
        />
      </div>

      {/* Operator Selector */}
      <div className="w-[160px]">
        <OperatorSelector
          operators={operators}
          selectedOperator={condition.operator}
          onSelect={(operator) => onUpdate({ operator })}
        />
      </div>

      {/* Value Input */}
      {showValueInput && selectedField && (
        <div className="flex-1 min-w-[140px]">
          <ValueInput
            field={selectedField}
            value={condition.value}
            onChange={(value) => onUpdate({ value })}
          />
        </div>
      )}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        disabled={!canRemove}
        className={cn(
          'p-1.5 rounded-lg transition-colors shrink-0',
          canRemove
            ? 'hover:bg-error/10 text-text-muted hover:text-error'
            : 'text-text-muted/30 cursor-not-allowed'
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============================================
// Field Selector Component
// ============================================

interface FieldSelectorProps {
  fields: FieldConfig[];
  selectedFieldId: string;
  onSelect: (fieldId: string) => void;
}

function FieldSelector({ fields, selectedFieldId, onSelect }: FieldSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedField = fields.find((f) => f.id === selectedFieldId);
  const filteredFields = fields.filter((f) =>
    f.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm',
          'bg-white/60 dark:bg-white/10 rounded-xl',
          'border border-white/50 dark:border-white/10',
          'hover:bg-white/80 dark:hover:bg-white/15',
          'transition-colors text-left',
          !selectedField && 'text-text-muted'
        )}
      >
        <span className="truncate">{selectedField?.label || 'Select question...'}</span>
        <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 glass-dropdown overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={cn(
                    'w-full pl-8 pr-3 py-1.5 text-xs',
                    'bg-white/50 dark:bg-white/5 rounded-lg',
                    'border border-white/30 dark:border-white/10',
                    'placeholder:text-text-muted text-text-primary',
                    'focus:outline-none focus:ring-1 focus:ring-mint/50'
                  )}
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredFields.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-text-muted">
                  No questions found
                </div>
              ) : (
                filteredFields.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => {
                      onSelect(field.id);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg',
                      'transition-colors text-left',
                      field.id === selectedFieldId
                        ? 'bg-mint/10 text-mint'
                        : 'hover:bg-white/50 dark:hover:bg-white/10 text-text-primary'
                    )}
                  >
                    <span className="truncate">{field.label}</span>
                    {field.id === selectedFieldId && <Check className="w-3.5 h-3.5 shrink-0" />}
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

// ============================================
// Operator Selector Component
// ============================================

interface OperatorSelectorProps {
  operators: ConditionOperator[];
  selectedOperator: ConditionOperator;
  onSelect: (operator: ConditionOperator) => void;
}

function OperatorSelector({ operators, selectedOperator, onSelect }: OperatorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm',
          'bg-white/60 dark:bg-white/10 rounded-xl',
          'border border-white/50 dark:border-white/10',
          'hover:bg-white/80 dark:hover:bg-white/15',
          'transition-colors text-left text-text-primary'
        )}
      >
        <span className="truncate">{getOperatorLabel(selectedOperator)}</span>
        <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 glass-dropdown overflow-hidden p-1"
          >
            {operators.map((op) => (
              <button
                key={op}
                onClick={() => {
                  onSelect(op);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg',
                  'transition-colors text-left',
                  op === selectedOperator
                    ? 'bg-mint/10 text-mint'
                    : 'hover:bg-white/50 dark:hover:bg-white/10 text-text-primary'
                )}
              >
                <span>{getOperatorLabel(op)}</span>
                {op === selectedOperator && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Value Input Component
// ============================================

interface ValueInputProps {
  field: FieldConfig;
  value: string | string[] | number | boolean;
  onChange: (value: string | string[] | number | boolean) => void;
}

function ValueInput({ field, value, onChange }: ValueInputProps) {
  // Multiple choice - multi-select
  if (field.type === 'multiple_choice' && field.options) {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <MultiSelectInput
        options={field.options}
        selectedValues={selectedValues}
        onChange={(values) => onChange(values)}
      />
    );
  }

  // Single choice fields with options
  if (['single_choice', 'best_time_to_call', 'site_selector'].includes(field.type) && field.options) {
    return (
      <SelectInput
        options={field.options}
        selectedValue={typeof value === 'string' ? value : ''}
        onChange={(v) => onChange(v)}
      />
    );
  }

  // Number input
  if (['number_entry', 'bmi_calculator'].includes(field.type)) {
    return (
      <input
        type="number"
        value={typeof value === 'number' ? value : ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        placeholder="Enter number..."
        className={cn(
          'w-full px-3 py-2 text-sm',
          'bg-white/60 dark:bg-white/10 rounded-xl',
          'border border-white/50 dark:border-white/10',
          'placeholder:text-text-muted text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-mint/50'
        )}
      />
    );
  }

  // Date input
  if (field.type === 'date_of_birth') {
    return (
      <input
        type="date"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 text-sm',
          'bg-white/60 dark:bg-white/10 rounded-xl',
          'border border-white/50 dark:border-white/10',
          'text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-mint/50'
        )}
      />
    );
  }

  // Default text input
  return (
    <input
      type="text"
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter value..."
      className={cn(
        'w-full px-3 py-2 text-sm',
        'bg-white/60 dark:bg-white/10 rounded-xl',
        'border border-white/50 dark:border-white/10',
        'placeholder:text-text-muted text-text-primary',
        'focus:outline-none focus:ring-2 focus:ring-mint/50'
      )}
    />
  );
}

// ============================================
// Select Input Component
// ============================================

interface SelectInputProps {
  options: { id: string; label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

function SelectInput({ options, selectedValue, onChange }: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm',
          'bg-white/60 dark:bg-white/10 rounded-xl',
          'border border-white/50 dark:border-white/10',
          'hover:bg-white/80 dark:hover:bg-white/15',
          'transition-colors text-left',
          !selectedOption && 'text-text-muted'
        )}
      >
        <span className="truncate">{selectedOption?.label || 'Select...'}</span>
        <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 glass-dropdown overflow-hidden max-h-48 overflow-y-auto p-1"
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg',
                  'transition-colors text-left',
                  option.value === selectedValue
                    ? 'bg-mint/10 text-mint'
                    : 'hover:bg-white/50 dark:hover:bg-white/10 text-text-primary'
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === selectedValue && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Multi-Select Input Component
// ============================================

interface MultiSelectInputProps {
  options: { id: string; label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

function MultiSelectInput({ options, selectedValues, onChange }: MultiSelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm',
          'bg-white/60 dark:bg-white/10 rounded-xl',
          'border border-white/50 dark:border-white/10',
          'hover:bg-white/80 dark:hover:bg-white/15',
          'transition-colors text-left',
          selectedValues.length === 0 && 'text-text-muted'
        )}
      >
        <span className="truncate">
          {selectedValues.length === 0
            ? 'Select options...'
            : `${selectedValues.length} selected`}
        </span>
        <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 glass-dropdown overflow-hidden max-h-48 overflow-y-auto p-1"
          >
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleValue(option.value)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg',
                    'transition-colors text-left',
                    isSelected
                      ? 'bg-mint/10 text-mint'
                      : 'hover:bg-white/50 dark:hover:bg-white/10 text-text-primary'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                      isSelected
                        ? 'bg-mint border-mint'
                        : 'border-white/50 dark:border-white/20'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
