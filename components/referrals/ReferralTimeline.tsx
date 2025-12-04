'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw,
  StickyNote,
  MessageSquare,
  Calendar,
  Phone,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import type { ActivityItem, Note, Message, Appointment } from '@/lib/types';
import { statusConfigs } from '@/lib/types';

type TimelineEventType = 'status_change' | 'note_added' | 'sms_sent' | 'sms_received' | 'appointment_scheduled' | 'call';

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, unknown>;
}

interface ReferralTimelineProps {
  events: TimelineEvent[];
  maxItems?: number;
}

const eventConfig: Record<
  TimelineEventType,
  { icon: typeof RefreshCcw; color: string; bgColor: string }
> = {
  status_change: {
    icon: RefreshCcw,
    color: 'text-vista-blue',
    bgColor: 'bg-vista-blue/10',
  },
  note_added: {
    icon: StickyNote,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  sms_sent: {
    icon: MessageSquare,
    color: 'text-mint',
    bgColor: 'bg-mint/10',
  },
  sms_received: {
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  appointment_scheduled: {
    icon: Calendar,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  call: {
    icon: Phone,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
};

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ReferralTimeline({
  events,
  maxItems = 20,
}: ReferralTimelineProps) {
  const [filter, setFilter] = useState<TimelineEventType | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const filterOptions: { value: TimelineEventType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'status_change', label: 'Status' },
    { value: 'note_added', label: 'Notes' },
    { value: 'sms_sent', label: 'SMS' },
    { value: 'appointment_scheduled', label: 'Appts' },
    { value: 'call', label: 'Calls' },
  ];

  const filteredEvents = events
    .filter((e) => filter === 'all' || e.type === filter || (filter === 'sms_sent' && e.type === 'sms_received'))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, showAll ? undefined : maxItems);

  return (
    <GlassCard padding="lg" animate={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Timeline</h3>
        <div className="flex items-center gap-1">
          <Filter className="w-4 h-4 text-text-muted mr-1" />
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                filter === option.value
                  ? 'bg-mint text-white'
                  : 'text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary">No activity yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-glass-border" />

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => {
                const config = eventConfig[event.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className="relative flex gap-4 pl-10"
                  >
                    {/* Icon */}
                    <div
                      className={`absolute left-0 p-2 rounded-xl ${config.bgColor} ring-4 ring-bg-primary`}
                    >
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-text-primary text-sm">
                            {event.title}
                          </p>
                          {event.description && (
                            <p className="text-sm text-text-secondary mt-0.5">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-text-muted whitespace-nowrap">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>

                      {/* User attribution */}
                      {event.userName && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar
                            firstName={event.userName.split(' ')[0]}
                            lastName={event.userName.split(' ')[1]}
                            size="xs"
                          />
                          <span className="text-xs text-text-muted">
                            {event.userName}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Show More */}
      {events.length > maxItems && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1"
        >
          Show {events.length - maxItems} more
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </GlassCard>
  );
}

// Helper function to convert activities, notes, messages, appointments to timeline events
export function buildTimelineEvents(
  activities: ActivityItem[],
  notes: Note[],
  messages: Message[],
  appointments: Appointment[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Add activities
  activities.forEach((activity) => {
    events.push({
      id: `activity-${activity.id}`,
      type: activity.type,
      title: activity.description,
      timestamp: activity.timestamp,
      userId: activity.userId,
    });
  });

  // Add notes
  notes.forEach((note) => {
    events.push({
      id: `note-${note.id}`,
      type: 'note_added',
      title: 'Note added',
      description: note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content,
      timestamp: note.createdAt,
      userName: note.authorName,
    });
  });

  // Add messages
  messages.forEach((message) => {
    events.push({
      id: `message-${message.id}`,
      type: message.direction === 'outbound' ? 'sms_sent' : 'sms_received',
      title: message.direction === 'outbound' ? 'SMS sent' : 'SMS received',
      description: message.content.length > 80 ? `${message.content.slice(0, 80)}...` : message.content,
      timestamp: message.sentAt,
    });
  });

  // Add appointments
  appointments.forEach((appointment) => {
    events.push({
      id: `appointment-${appointment.id}`,
      type: 'appointment_scheduled',
      title: 'Appointment scheduled',
      description: `${appointment.type.replace(/_/g, ' ')} - ${new Date(appointment.scheduledFor).toLocaleDateString()}`,
      timestamp: appointment.createdAt,
    });
  });

  return events;
}
