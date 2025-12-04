'use client';

import { motion } from 'framer-motion';
import { Mail, Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export function EmailDigestPreview() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Email Digest Preview</h2>
          <p className="text-sm text-text-muted mt-1">
            Preview of your daily digest email
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Mail className="w-4 h-4" />
          Sent daily at 8:00 AM
        </div>
      </div>

      {/* Email Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-bg-secondary rounded-xl border border-glass-border overflow-hidden"
      >
        {/* Email Header */}
        <div className="bg-gradient-to-r from-mint to-vista-blue p-6 text-white">
          <p className="text-sm opacity-80">{today}</p>
          <h3 className="text-2xl font-bold mt-1">Good Morning, Sarah!</h3>
          <p className="text-sm opacity-80 mt-2">
            Here's your daily summary from Metro Clinical Research Center
          </p>
        </div>

        {/* Email Body */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-mint/5 dark:bg-mint/10">
              <Users className="w-6 h-6 text-mint mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">5</p>
              <p className="text-xs text-text-muted">New Referrals</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-vista-blue/5 dark:bg-vista-blue/10">
              <Calendar className="w-6 h-6 text-vista-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">3</p>
              <p className="text-xs text-text-muted">Appointments Today</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10">
              <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">8</p>
              <p className="text-xs text-text-muted">Follow-ups Due</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-purple-500/5 dark:bg-purple-500/10">
              <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">24%</p>
              <p className="text-xs text-text-muted">Conversion Rate</p>
            </div>
          </div>

          {/* Today's Appointments */}
          <div>
            <h4 className="font-semibold text-text-primary mb-3">Today's Appointments</h4>
            <div className="space-y-2">
              {[
                { time: '9:00 AM', name: 'Robert Garcia', study: 'Diabetes Prevention' },
                { time: '11:30 AM', name: 'Emily Watson', study: 'Hypertension Study' },
                { time: '2:00 PM', name: 'Michael Chen', study: 'Sleep Apnea Trial' },
              ].map((apt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-mint">{apt.time}</span>
                    <span className="text-text-primary">{apt.name}</span>
                  </div>
                  <span className="text-sm text-text-muted">{apt.study}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Follow-ups */}
          <div>
            <h4 className="font-semibold text-text-primary mb-3">Overdue Follow-ups</h4>
            <div className="space-y-2">
              {[
                { name: 'Jessica Brown', days: 3, status: 'Left Voicemail' },
                { name: 'David Miller', days: 2, status: 'No Answer' },
              ].map((followup, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-error/5 dark:bg-error/10"
                >
                  <span className="text-text-primary">{followup.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-muted">{followup.status}</span>
                    <span className="text-sm text-error font-medium">
                      {followup.days} days overdue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-4">
            <button className="px-6 py-3 bg-mint text-white font-medium rounded-xl hover:bg-mint-dark transition-colors">
              Open Dashboard
            </button>
          </div>
        </div>

        {/* Email Footer */}
        <div className="px-6 py-4 bg-bg-tertiary/30 border-t border-glass-border text-center text-xs text-text-muted">
          <p>Metro Clinical Research Center</p>
          <p className="mt-1">123 Medical Plaza Dr, Suite 400, Austin, TX 78701</p>
          <p className="mt-2">
            <a href="#" className="text-mint hover:underline">Unsubscribe</a>
            {' • '}
            <a href="#" className="text-mint hover:underline">Manage Preferences</a>
          </p>
        </div>
      </motion.div>
    </GlassCard>
  );
}
