'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  LayoutGrid,
  List,
  Mail,
  Bell,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Dropdown } from '@/components/ui/Dropdown';
import { useTheme } from '@/lib/context/ThemeContext';
import { useToast } from '@/components/ui/Toast';

type ThemeOption = 'light' | 'dark';
type ViewOption = 'grid' | 'list';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
  icon: React.ReactNode;
}

function Toggle({ enabled, onChange, label, description, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-bg-tertiary/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-bg-secondary text-text-muted">
          {icon}
        </div>
        <div>
          <p className="font-medium text-text-primary">{label}</p>
          {description && (
            <p className="text-sm text-text-muted">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-mint' : 'bg-bg-secondary'
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: enabled ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

const viewOptions = [
  { value: 'grid', label: 'Grid View' },
  { value: 'list', label: 'List View' },
];

const digestTimeOptions = [
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
];

export function PreferencesSettings() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [defaultView, setDefaultView] = useState<ViewOption>('grid');
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [digestTime, setDigestTime] = useState('08:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    addToast({
      type: 'success',
      title: 'Theme Updated',
      message: `Theme set to ${newTheme}.`,
    });
  };

  return (
    <GlassCard padding="lg">
      <h2 className="text-lg font-semibold text-text-primary mb-6">Preferences</h2>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Appearance</h3>
          <div className="grid grid-cols-2 gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value as ThemeOption)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-mint/10 ring-2 ring-mint text-mint'
                      : 'bg-bg-tertiary/50 text-text-secondary hover:bg-bg-tertiary'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Default View */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Default Referral View</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => setDefaultView('grid')}
              className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                defaultView === 'grid'
                  ? 'bg-mint/10 ring-2 ring-mint text-mint'
                  : 'bg-bg-tertiary/50 text-text-secondary hover:bg-bg-tertiary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="font-medium">Grid</span>
            </motion.button>
            <motion.button
              onClick={() => setDefaultView('list')}
              className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                defaultView === 'list'
                  ? 'bg-mint/10 ring-2 ring-mint text-mint'
                  : 'bg-bg-tertiary/50 text-text-secondary hover:bg-bg-tertiary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <List className="w-5 h-5" />
              <span className="font-medium">List</span>
            </motion.button>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-6 border-t border-glass-border">
          <h3 className="text-sm font-medium text-text-primary mb-3">Notifications</h3>
          <div className="space-y-3">
            <Toggle
              enabled={notificationsEnabled}
              onChange={setNotificationsEnabled}
              label="Push Notifications"
              description="Get notified about new referrals and updates"
              icon={<Bell className="w-5 h-5" />}
            />
            <Toggle
              enabled={emailNotifications}
              onChange={setEmailNotifications}
              label="Email Notifications"
              description="Receive updates via email"
              icon={<Mail className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Daily Digest */}
        <div className="pt-6 border-t border-glass-border">
          <h3 className="text-sm font-medium text-text-primary mb-3">Daily Digest</h3>
          <div className="space-y-3">
            <Toggle
              enabled={digestEnabled}
              onChange={setDigestEnabled}
              label="Daily Digest Email"
              description="Receive a summary of your day each morning"
              icon={<Mail className="w-5 h-5" />}
            />
            {digestEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="ml-12"
              >
                <Dropdown
                  label="Delivery Time"
                  options={digestTimeOptions}
                  value={digestTime}
                  onChange={(v) => setDigestTime(v as string)}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
