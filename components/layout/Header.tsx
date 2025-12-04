'use client';

import { ThemeToggle } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserInitials } from '@/lib/mock-data/users';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-bg-secondary/80 backdrop-blur-md border-b border-glass-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Page Title */}
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <GlobalSearch />

        {/* Notifications */}
        <NotificationsPanel />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <button
          className="w-9 h-9 rounded-full bg-mint/20 flex items-center justify-center text-mint font-semibold text-sm hover:bg-mint/30 transition-colors"
          aria-label="User menu"
        >
          {user ? getUserInitials(user) : 'U'}
        </button>
      </div>
    </header>
  );
}
