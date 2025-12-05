'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', status: 'w-2 h-2' },
  sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-3 h-3' },
  lg: { container: 'w-12 h-12', text: 'text-base', status: 'w-3.5 h-3.5' },
  xl: { container: 'w-16 h-16', text: 'text-xl', status: 'w-4 h-4' },
};

const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

// Generate consistent color from name
function getColorFromName(name: string): string {
  const colors = [
    'bg-mint/20 text-mint',
    'bg-vista-blue/20 text-vista-blue',
    'bg-purple-500/20 text-purple-500',
    'bg-amber-500/20 text-amber-500',
    'bg-rose-500/20 text-rose-500',
    'bg-cyan-500/20 text-cyan-500',
    'bg-emerald-500/20 text-emerald-500',
    'bg-indigo-500/20 text-indigo-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  src,
  alt,
  firstName,
  lastName,
  size = 'md',
  status,
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const sizeConfig = sizeClasses[size];

  const initials = [firstName?.[0], lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || '?';

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'User';
  const colorClass = getColorFromName(fullName);

  const showImage = src && !imageError;

  return (
    <div className={`relative inline-flex ${className}`}>
      <motion.div
        className={`
          ${sizeConfig.container}
          rounded-full
          flex items-center justify-center
          overflow-hidden
          ${!showImage ? colorClass : ''}
          font-semibold
        `}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || fullName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={sizeConfig.text}>{initials}</span>
        )}
      </motion.div>

      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${sizeConfig.status}
            ${statusColors[status]}
            rounded-full
          `}
        />
      )}
    </div>
  );
}

// Avatar Group component for showing multiple avatars
interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    firstName?: string;
    lastName?: string;
  }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
  className = '',
}: AvatarGroupProps) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const sizeConfig = sizeClasses[size];

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayed.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          firstName={avatar.firstName}
          lastName={avatar.lastName}
          size={size}
        />
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${sizeConfig.container}
            rounded-full
            flex items-center justify-center
            bg-bg-tertiary text-text-secondary
            ${sizeConfig.text}
            font-medium
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
