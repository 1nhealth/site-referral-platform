'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useQualificationBuilder } from '@/lib/context/QualificationBuilderContext';
import { cn } from '@/lib/utils';

export function SituationPriorityPanel() {
  const { state, reorderSituations, setDragging } = useQualificationBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!state.config) return null;

  const situationIds = state.config.situations.map((s) => s.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDragging(false);

    if (over && active.id !== over.id) {
      const oldIndex = situationIds.indexOf(active.id as string);
      const newIndex = situationIds.indexOf(over.id as string);
      const newOrder = arrayMove(situationIds, oldIndex, newIndex);
      reorderSituations(newOrder);
    }
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  return (
    <div className="glass-card-elevated rounded-[32px] h-fit sticky top-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 dark:border-white/5">
        <h3 className="text-sm font-semibold text-text-primary">Situation Priority</h3>
        <p className="text-xs text-text-muted mt-1">
          Drag to reorder. First matching situation determines the redirect URL.
        </p>
      </div>

      {/* Sortable List */}
      <div className="p-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={situationIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {state.config.situations.map((situation, index) => (
                <SortableSituationItem
                  key={situation.id}
                  id={situation.id}
                  name={situation.name}
                  priority={index + 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

// ============================================
// Sortable Item Component
// ============================================

interface SortableSituationItemProps {
  id: string;
  name: string;
  priority: number;
}

function SortableSituationItem({ id, name, priority }: SortableSituationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'bg-white/40 dark:bg-white/5',
        'border border-white/50 dark:border-white/10',
        'transition-all duration-150',
        isDragging
          ? 'shadow-lg scale-[1.02] bg-white/60 dark:bg-white/10 z-50'
          : 'hover:bg-white/50 dark:hover:bg-white/10'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          'p-1 rounded cursor-grab active:cursor-grabbing',
          'text-text-muted hover:text-text-primary',
          'transition-colors'
        )}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Priority Badge */}
      <div className="w-6 h-6 rounded-md bg-mint/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-semibold text-mint">{priority}</span>
      </div>

      {/* Name */}
      <span className="text-sm font-medium text-text-primary truncate flex-1">
        {name}
      </span>
    </div>
  );
}
