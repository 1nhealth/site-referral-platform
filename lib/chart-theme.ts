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
  new: '#53CA97',                 // mint
  attempt_1: '#F59E0B',           // amber
  attempt_2: '#F59E0B',           // amber
  attempt_3: '#EA580C',           // orange
  attempt_4: '#EA580C',           // orange
  attempt_5: '#EF4444',           // red
  sent_sms: '#7B9FE0',            // vista-blue
  appointment_scheduled: '#A855F7', // purple
  phone_screen_failed: '#6B7280',  // gray
  not_interested: '#6B7280',       // gray
  signed_icf: '#10B981',          // green
  other: '#8B5CF6',               // violet
};

export const funnelColors = [
  '#53CA97',  // New
  '#7B9FE0',  // Contact Attempted
  '#A855F7',  // SMS Sent
  '#06B6D4',  // Scheduled
  '#10B981',  // Signed
];
