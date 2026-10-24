// CCFLA Brand Color Palette & Action Theming
// Authentic color definitions derived from the CCFLA Brand Identity

import type React from 'react';

export interface ActionTheme {
  id: number;
  hex: string;
  rgb: string;
  darkHex: string; // High-contrast text variant for WCAG AA compliance
  bgSubtle: string; // ~4% opacity
  bgLight: string; // ~8% opacity
  bgMedium: string; // ~14% opacity
  borderSubtle: string; // ~20% opacity
  borderMedium: string; // ~40% opacity
  borderHover: string; // ~60% opacity
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const CCFLA_PALETTE = {
  blue: '#207B6A',       // RGB: 32, 123, 106
  teal: '#5d8d8b',       // RGB: 93, 141, 139
  orange: '#F56E28',     // RGB: 245, 110, 40
  olive: '#9aba75',      // RGB: 154, 186, 117
  plum: '#993e69',       // RGB: 153, 62, 105
  gold: '#f0c763',       // RGB: 240, 199, 99
  steelBlue: '#467d9d',  // RGB: 70, 125, 157
  coral: '#e0514c',      // RGB: 224, 81, 76
};

// Action colours: each action page and card is themed with its own colour
const ACTION_COLORS: Record<number, string> = {
  1: '#268842', // Green
  2: '#F56E28', // Orange
  3: '#3F7596', // Blue
  4: '#94436E', // Purple
  5: '#263A6A', // Indigo
};

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Mix the colour towards black (amount < 0) or white (amount > 0)
function shade(hex: string, amount: number): string {
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  return '#' + hexToRgb(hex)
    .map((c) => Math.round(c + (target - c) * t).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function buildTheme(id: number, hex: string): ActionTheme {
  const rgb = hexToRgb(hex).join(', ');
  const darkHex = shade(hex, -0.2);
  return {
    id,
    hex,
    rgb,
    darkHex,
    bgSubtle: `rgba(${rgb}, 0.04)`,
    bgLight: `rgba(${rgb}, 0.08)`,
    bgMedium: `rgba(${rgb}, 0.15)`,
    borderSubtle: `rgba(${rgb}, 0.20)`,
    borderMedium: `rgba(${rgb}, 0.40)`,
    borderHover: `rgba(${rgb}, 0.70)`,
    badgeBg: `rgba(${rgb}, 0.08)`,
    badgeBorder: `rgba(${rgb}, 0.25)`,
    badgeText: darkHex,
  };
}

export const ACTION_THEMES: Record<number, ActionTheme> = Object.fromEntries(
  Object.entries(ACTION_COLORS).map(([id, hex]) => [Number(id), buildTheme(Number(id), hex)])
);

export function getActionTheme(actionId: number | string): ActionTheme {
  const num = typeof actionId === 'string' ? parseInt(actionId, 10) : actionId;
  return ACTION_THEMES[num] || ACTION_THEMES[1];
}

// Inline style that re-points the site accent colour (text-accent, bg-accent, border-accent, ...)
// at an action's colour for everything inside the element it is applied to.
export function actionAccentStyle(actionId: number | string): React.CSSProperties {
  const theme = getActionTheme(actionId);
  return {
    '--color-accent': theme.hex,
    '--color-accent-light': shade(theme.hex, 0.9),
  } as React.CSSProperties;
}
