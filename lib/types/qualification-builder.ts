// ========================================
// Qualification Builder - TypeScript Types
// ========================================

import type { ConditionOperator } from './form-builder';

// Qualification condition for a single field/question
export interface QualificationCondition {
  id: string;
  fieldId: string; // References a field from the selected form
  operator: ConditionOperator;
  value: string | string[] | number | boolean;
}

// Condition group with AND/OR logic
export interface QualificationConditionGroup {
  id: string;
  logic: 'and' | 'or';
  conditions: QualificationCondition[];
}

// A Situation (aka Bucket) - represents one qualification rule
export interface Situation {
  id: string;
  name: string;
  language: string; // e.g., 'en', 'es', 'fr'
  qualifiedUrl?: string; // Optional redirect URL when matched
  conditionGroups: QualificationConditionGroup[];
  groupLogic: 'and' | 'or'; // Logic between groups
  priority: number; // Order for evaluation (lower = higher priority)
  isExpanded: boolean; // UI state for collapse/expand
  createdAt: string;
  updatedAt: string;
}

// Complete qualification configuration for a form
export interface QualificationConfig {
  id: string;
  formId: string; // The form this configuration applies to
  situations: Situation[];
  createdAt: string;
  updatedAt: string;
}

// Available languages
export const AVAILABLE_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
] as const;

// Field types that can be used in qualification conditions
export const ANSWERABLE_FIELD_TYPES = [
  'short_text',
  'long_text',
  'email',
  'phone_number',
  'first_name',
  'last_name',
  'zip_code',
  'single_choice',
  'multiple_choice',
  'number_entry',
  'date_of_birth',
  'accept_terms',
  'best_time_to_call',
  'bmi_calculator',
  'site_selector',
] as const;

// Helper functions
export function createEmptySituation(priority: number): Situation {
  return {
    id: `situation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `Situation ${priority + 1}`,
    language: 'en',
    qualifiedUrl: '',
    conditionGroups: [createEmptyConditionGroup()],
    groupLogic: 'and',
    priority,
    isExpanded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createEmptyConditionGroup(): QualificationConditionGroup {
  return {
    id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    logic: 'and',
    conditions: [createEmptyCondition()],
  };
}

export function createEmptyCondition(): QualificationCondition {
  return {
    id: `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fieldId: '',
    operator: 'equals',
    value: '',
  };
}

export function createEmptyConfig(formId: string): QualificationConfig {
  return {
    id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    formId,
    situations: [createEmptySituation(0)],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
