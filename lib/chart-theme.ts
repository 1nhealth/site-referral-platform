// Chart theme configuration matching the design system

export const chartColors = {
  mint: '#53CA97',
  vistaBlue: '#7B9FE0',
  purple: '#A855F7',
  warning: '#F59E0B',
  error: '#EF4444',
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
  },
  grid: 'rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)',
};

export const chartGradients = {
  mint: {
    id: 'mintGradient',
    colors: [
      { offset: '0%', color: '#53CA97', opacity: 0.8 },
      { offset: '100%', color: '#53CA97', opacity: 0.1 },
    ],
  },
  vistaBlue: {
    id: 'vistaBlueGradient',
    colors: [
      { offset: '0%', color: '#7B9FE0', opacity: 0.8 },
      { offset: '100%', color: '#7B9FE0', opacity: 0.1 },
    ],
  },
  purple: {
    id: 'purpleGradient',
    colors: [
      { offset: '0%', color: '#A855F7', opacity: 0.8 },
      { offset: '100%', color: '#A855F7', opacity: 0.1 },
    ],
  },
};

export const statusColors: Record<string, string> = {
  new: '#53CA97',           // mint
  contact_attempted: '#7B9FE0', // vista-blue
  sms_sent: '#A855F7',      // purple
  scheduled: '#06B6D4',     // cyan
  signed: '#10B981',        // green
  not_qualified: '#6B7280', // gray
  declined: '#EF4444',      // red
  no_show: '#F59E0B',       // warning
  other: '#8B5CF6',         // violet
};

export const funnelColors = [
  '#53CA97',  // New
  '#7B9FE0',  // Contact Attempted
  '#A855F7',  // SMS Sent
  '#06B6D4',  // Scheduled
  '#10B981',  // Signed
];
