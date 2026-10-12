export const gradients = {
  primary: {
    colors: ['#1687FF', '#0755E8', '#0036C7'] as const,
    locations: [0, 0.55, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    css: 'linear-gradient(135deg, #1687FF 0%, #0755E8 55%, #0036C7 100%)',
  },
};

export const colors = {
  // Brand Primary & Gradient stops
  primaryLight: '#1687FF', // Gradient 0%
  primary: '#0755E8',      // Gradient 55%
  primaryDark: '#0036C7',  // Gradient 100%
  primarySoft: '#eaf2ff',

  // Secondary & Accents
  secondary: '#10b981',
  secondaryLight: '#d1fae5',
  accent: '#f59e0b',
  accentLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',

  // Surfaces & Backgrounds
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',

  // Typography
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',

  // Borders & Shadows
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  shadow: '#000000',

  // Gradient definitions
  gradient: gradients,
};

export type Colors = typeof colors;
export type Gradients = typeof gradients;
