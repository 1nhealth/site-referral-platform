'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Upload, Users, CheckCircle2 } from 'lucide-react';
import type { ReconTab } from '@/lib/types/reconciliation';

interface Tab {
  id: ReconTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface ReconTabBarProps {
  activeTab: ReconTab;
  onTabChange: (tab: ReconTab) => void;
  pendingApprovalsCount?: number;
}

export function ReconTabBar({
  activeTab,
  onTabChange,
  pendingApprovalsCount = 0,
}: ReconTabBarProps) {
  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'imports', label: 'Imports', icon: <Upload className="w-4 h-4" /> },
    { id: 'matching', label: 'Matching', icon: <Users className="w-4 h-4" /> },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/50 dark:border-white/10">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              transition-colors duration-200
              ${
                isActive
                  ? 'text-mint'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/40 dark:hover:bg-white/10'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active background */}
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-mint/10 dark:bg-mint/20 border border-mint/30 rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] font-semibold bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
