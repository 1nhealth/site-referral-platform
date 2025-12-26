'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { FormDefinition, FieldConfig } from '@/lib/types/form-builder';
import {
  type QualificationConfig,
  type Situation,
  type QualificationConditionGroup,
  createEmptySituation,
  createEmptyConditionGroup,
  createEmptyConfig,
  ANSWERABLE_FIELD_TYPES,
} from '@/lib/types/qualification-builder';

// State interface
interface QualificationBuilderState {
  selectedFormId: string | null;
  selectedForm: FormDefinition | null;
  config: QualificationConfig | null;
  hasUnsavedChanges: boolean;
  isDraggingPriority: boolean;
}

// Action types
type QualificationBuilderAction =
  | { type: 'SELECT_FORM'; payload: { formId: string; form: FormDefinition } }
  | { type: 'LOAD_CONFIG'; payload: QualificationConfig }
  | { type: 'ADD_SITUATION' }
  | { type: 'REMOVE_SITUATION'; payload: string }
  | { type: 'UPDATE_SITUATION'; payload: { situationId: string; updates: Partial<Situation> } }
  | { type: 'DUPLICATE_SITUATION'; payload: string }
  | { type: 'ADD_CONDITION_GROUP'; payload: string }
  | { type: 'REMOVE_CONDITION_GROUP'; payload: { situationId: string; groupId: string } }
  | { type: 'UPDATE_CONDITION_GROUP'; payload: { situationId: string; group: QualificationConditionGroup } }
  | { type: 'REORDER_SITUATIONS'; payload: string[] }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'MARK_SAVED' }
  | { type: 'RESET' };

// Initial state
function createInitialState(): QualificationBuilderState {
  return {
    selectedFormId: null,
    selectedForm: null,
    config: null,
    hasUnsavedChanges: false,
    isDraggingPriority: false,
  };
}

// Reducer
function qualificationBuilderReducer(
  state: QualificationBuilderState,
  action: QualificationBuilderAction
): QualificationBuilderState {
  switch (action.type) {
    case 'SELECT_FORM': {
      const { formId, form } = action.payload;
      // Try to load existing config from localStorage
      const savedConfig = localStorage.getItem(`qualification-config-${formId}`);
      let config: QualificationConfig;

      if (savedConfig) {
        try {
          config = JSON.parse(savedConfig);
        } catch {
          config = createEmptyConfig(formId);
        }
      } else {
        config = createEmptyConfig(formId);
      }

      return {
        ...state,
        selectedFormId: formId,
        selectedForm: form,
        config,
        hasUnsavedChanges: false,
      };
    }

    case 'LOAD_CONFIG':
      return {
        ...state,
        config: action.payload,
        hasUnsavedChanges: false,
      };

    case 'ADD_SITUATION': {
      if (!state.config) return state;

      const newPriority = state.config.situations.length;
      const newSituation = createEmptySituation(newPriority);

      return {
        ...state,
        config: {
          ...state.config,
          situations: [...state.config.situations, newSituation],
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'REMOVE_SITUATION': {
      if (!state.config) return state;

      const filteredSituations = state.config.situations
        .filter((s) => s.id !== action.payload)
        .map((s, index) => ({ ...s, priority: index })); // Re-index priorities

      return {
        ...state,
        config: {
          ...state.config,
          situations: filteredSituations,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_SITUATION': {
      if (!state.config) return state;

      const { situationId, updates } = action.payload;
      const updatedSituations = state.config.situations.map((s) =>
        s.id === situationId
          ? { ...s, ...updates, updatedAt: new Date().toISOString() }
          : s
      );

      return {
        ...state,
        config: {
          ...state.config,
          situations: updatedSituations,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'DUPLICATE_SITUATION': {
      if (!state.config) return state;

      const sourceSituation = state.config.situations.find((s) => s.id === action.payload);
      if (!sourceSituation) return state;

      const newSituation: Situation = {
        ...sourceSituation,
        id: `situation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${sourceSituation.name} (Copy)`,
        priority: state.config.situations.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        conditionGroups: sourceSituation.conditionGroups.map((group) => ({
          ...group,
          id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          conditions: group.conditions.map((cond) => ({
            ...cond,
            id: `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })),
        })),
      };

      return {
        ...state,
        config: {
          ...state.config,
          situations: [...state.config.situations, newSituation],
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'ADD_CONDITION_GROUP': {
      if (!state.config) return state;

      const situationId = action.payload;
      const newGroup = createEmptyConditionGroup();

      const updatedSituations = state.config.situations.map((s) =>
        s.id === situationId
          ? {
              ...s,
              conditionGroups: [...s.conditionGroups, newGroup],
              updatedAt: new Date().toISOString(),
            }
          : s
      );

      return {
        ...state,
        config: {
          ...state.config,
          situations: updatedSituations,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'REMOVE_CONDITION_GROUP': {
      if (!state.config) return state;

      const { situationId, groupId } = action.payload;
      const updatedSituations = state.config.situations.map((s) =>
        s.id === situationId
          ? {
              ...s,
              conditionGroups: s.conditionGroups.filter((g) => g.id !== groupId),
              updatedAt: new Date().toISOString(),
            }
          : s
      );

      return {
        ...state,
        config: {
          ...state.config,
          situations: updatedSituations,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_CONDITION_GROUP': {
      if (!state.config) return state;

      const { situationId, group } = action.payload;
      const updatedSituations = state.config.situations.map((s) =>
        s.id === situationId
          ? {
              ...s,
              conditionGroups: s.conditionGroups.map((g) =>
                g.id === group.id ? group : g
              ),
              updatedAt: new Date().toISOString(),
            }
          : s
      );

      return {
        ...state,
        config: {
          ...state.config,
          situations: updatedSituations,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'REORDER_SITUATIONS': {
      if (!state.config) return state;

      const situationIds = action.payload;
      const situationMap = new Map(state.config.situations.map((s) => [s.id, s]));
      const reorderedSituations = situationIds
        .map((id, index) => {
          const situation = situationMap.get(id);
          return situation ? { ...situation, priority: index } : null;
        })
        .filter((s): s is Situation => s !== null);

      return {
        ...state,
        config: {
          ...state.config,
          situations: reorderedSituations,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'SET_DRAGGING':
      return {
        ...state,
        isDraggingPriority: action.payload,
      };

    case 'MARK_SAVED':
      return {
        ...state,
        hasUnsavedChanges: false,
      };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

// Context type
interface QualificationBuilderContextValue {
  state: QualificationBuilderState;
  dispatch: React.Dispatch<QualificationBuilderAction>;

  // Form selection
  selectForm: (formId: string, form: FormDefinition) => void;

  // Situation methods
  addSituation: () => void;
  removeSituation: (situationId: string) => void;
  updateSituation: (situationId: string, updates: Partial<Situation>) => void;
  duplicateSituation: (situationId: string) => void;
  reorderSituations: (situationIds: string[]) => void;

  // Condition group methods
  addConditionGroup: (situationId: string) => void;
  removeConditionGroup: (situationId: string, groupId: string) => void;
  updateConditionGroup: (situationId: string, group: QualificationConditionGroup) => void;

  // Drag state
  setDragging: (isDragging: boolean) => void;

  // Save/Reset
  save: () => void;
  reset: () => void;

  // Computed values
  availableFields: FieldConfig[];
  hasUnsavedChanges: boolean;
}

const QualificationBuilderContext = createContext<QualificationBuilderContextValue | null>(null);

export function useQualificationBuilder() {
  const context = useContext(QualificationBuilderContext);
  if (!context) {
    throw new Error('useQualificationBuilder must be used within a QualificationBuilderProvider');
  }
  return context;
}

interface QualificationBuilderProviderProps {
  children: ReactNode;
}

export function QualificationBuilderProvider({ children }: QualificationBuilderProviderProps) {
  const [state, dispatch] = useReducer(qualificationBuilderReducer, createInitialState());

  // Form selection
  const selectForm = useCallback((formId: string, form: FormDefinition) => {
    dispatch({ type: 'SELECT_FORM', payload: { formId, form } });
  }, []);

  // Situation methods
  const addSituation = useCallback(() => {
    dispatch({ type: 'ADD_SITUATION' });
  }, []);

  const removeSituation = useCallback((situationId: string) => {
    dispatch({ type: 'REMOVE_SITUATION', payload: situationId });
  }, []);

  const updateSituation = useCallback((situationId: string, updates: Partial<Situation>) => {
    dispatch({ type: 'UPDATE_SITUATION', payload: { situationId, updates } });
  }, []);

  const duplicateSituation = useCallback((situationId: string) => {
    dispatch({ type: 'DUPLICATE_SITUATION', payload: situationId });
  }, []);

  const reorderSituations = useCallback((situationIds: string[]) => {
    dispatch({ type: 'REORDER_SITUATIONS', payload: situationIds });
  }, []);

  // Condition group methods
  const addConditionGroup = useCallback((situationId: string) => {
    dispatch({ type: 'ADD_CONDITION_GROUP', payload: situationId });
  }, []);

  const removeConditionGroup = useCallback((situationId: string, groupId: string) => {
    dispatch({ type: 'REMOVE_CONDITION_GROUP', payload: { situationId, groupId } });
  }, []);

  const updateConditionGroup = useCallback(
    (situationId: string, group: QualificationConditionGroup) => {
      dispatch({ type: 'UPDATE_CONDITION_GROUP', payload: { situationId, group } });
    },
    []
  );

  // Drag state
  const setDragging = useCallback((isDragging: boolean) => {
    dispatch({ type: 'SET_DRAGGING', payload: isDragging });
  }, []);

  // Save config to localStorage
  const save = useCallback(() => {
    if (state.config && state.selectedFormId) {
      localStorage.setItem(
        `qualification-config-${state.selectedFormId}`,
        JSON.stringify(state.config)
      );
      dispatch({ type: 'MARK_SAVED' });
    }
  }, [state.config, state.selectedFormId]);

  // Reset
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Computed: Get available fields from selected form (answerable types only)
  const availableFields = state.selectedForm
    ? Object.values(state.selectedForm.fields).filter((field) =>
        ANSWERABLE_FIELD_TYPES.includes(field.type as typeof ANSWERABLE_FIELD_TYPES[number])
      )
    : [];

  return (
    <QualificationBuilderContext.Provider
      value={{
        state,
        dispatch,
        selectForm,
        addSituation,
        removeSituation,
        updateSituation,
        duplicateSituation,
        reorderSituations,
        addConditionGroup,
        removeConditionGroup,
        updateConditionGroup,
        setDragging,
        save,
        reset,
        availableFields,
        hasUnsavedChanges: state.hasUnsavedChanges,
      }}
    >
      {children}
    </QualificationBuilderContext.Provider>
  );
}
