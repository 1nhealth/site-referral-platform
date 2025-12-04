'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Sliders, Upload, Mail } from 'lucide-react';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SiteSettings } from '@/components/settings/SiteSettings';
import { PreferencesSettings } from '@/components/settings/PreferencesSettings';
import { CSVUpload } from '@/components/settings/CSVUpload';
import { EmailDigestPreview } from '@/components/settings/EmailDigestPreview';

type SettingsTab = 'profile' | 'site' | 'preferences' | 'import' | 'digest';

const tabs = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'site' as const, label: 'Site', icon: Building2 },
  { id: 'preferences' as const, label: 'Preferences', icon: Sliders },
  { id: 'import' as const, label: 'Import', icon: Upload },
  { id: 'digest' as const, label: 'Email Digest', icon: Mail },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Configure your profile and site preferences.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-bg-tertiary/50 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-mint'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-bg-primary rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'site' && <SiteSettings />}
        {activeTab === 'preferences' && <PreferencesSettings />}
        {activeTab === 'import' && <CSVUpload />}
        {activeTab === 'digest' && <EmailDigestPreview />}
      </motion.div>
    </div>
  );
}
