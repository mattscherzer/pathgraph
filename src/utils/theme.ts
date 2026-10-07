export interface GroupStyle {
  border: string;
  text: string;
  bg: string;
  badgeBg: string;
  dot: string;
  accentHex: string;
}

export const GROUP_THEMES: Record<string, GroupStyle> = {
  Auth: {
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    accentHex: '#f59e0b',
  },
  Onboarding: {
    border: 'border-sky-500/50',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    badgeBg: 'bg-sky-950/70 text-sky-300 border-sky-500/30',
    dot: 'bg-sky-400',
    accentHex: '#0ea5e9',
  },
  Core: {
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    accentHex: '#10b981',
  },
  Monetization: {
    border: 'border-violet-500/50',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    badgeBg: 'bg-violet-950/70 text-violet-300 border-violet-500/30',
    dot: 'bg-violet-400',
    accentHex: '#8b5cf6',
  },
  Settings: {
    border: 'border-zinc-500/50',
    text: 'text-zinc-300',
    bg: 'bg-zinc-500/10',
    badgeBg: 'bg-zinc-900/80 text-zinc-300 border-zinc-500/30',
    dot: 'bg-zinc-400',
    accentHex: '#71717a',
  },
};

export const getGroupStyle = (group: string): GroupStyle => {
  if (GROUP_THEMES[group]) {
    return GROUP_THEMES[group];
  }
  return {
    border: 'border-indigo-500/50',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    badgeBg: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/30',
    dot: 'bg-indigo-400',
    accentHex: '#6366f1',
  };
};
