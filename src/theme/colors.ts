export const colors = {
  background: '#0e1117',
  foreground: '#e8ecf1',

  card: '#161b22',
  cardForeground: '#e8ecf1',

  primary: '#10b981',
  primaryForeground: '#ffffff',

  secondary: '#2563eb',
  secondaryForeground: '#ffffff',

  muted: '#1e2430',
  mutedForeground: '#7c8494',

  accent: '#f59e0b',
  accentForeground: '#0e1117',

  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  border: '#252d38',
  input: '#2a3241',
  ring: '#10b981',

  live: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',

  glass: 'rgba(22,27,34,0.7)',
  glassBorder: 'rgba(37,45,56,0.5)',

  green500: '#22c55e',
  orange500: '#f97316',
  yellow500: '#eab308',
  yellow400: '#facc15',
  blue500: '#3b82f6',
  purple500: '#a855f7',
  teal500: '#14b8a6',
  pink500: '#ec4899',
  cyan500: '#06b6d4',
  violet400: '#a78bfa',
  red500: '#ef4444',

  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
