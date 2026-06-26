import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const THEMES = [
  { id: 'ai-future', name: 'AI Future', desc: '다크 네온', swatch: ['#070B1E', '#00E5FF', '#7C5CFF'] },
  { id: 'heritage', name: 'Heritage', desc: '부산대 정통', swatch: ['#F5F7FA', '#0057B8', '#00256B'] },
  { id: 'warm', name: 'Warm', desc: '휴먼 이노베이션', swatch: ['#FFF8F0', '#F4502C', '#F59E00'] },
  { id: 'teal', name: 'Industrial', desc: 'ESG 틸', swatch: ['#EAF7F4', '#009E89', '#4FAF3F'] },
];

const THEME_COLORS = {
  'ai-future': '#070B1E',
  heritage: '#F5F7FA',
  warm: '#FFF8F0',
  teal: '#EAF7F4',
};

const ThemeContext = createContext(null);
const STORAGE_KEY = 'axpbl-theme';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'ai-future';
    // allow deep-linking a palette via ?theme=<id> (used by the concepts gallery)
    const param = new URLSearchParams(window.location.search).get('theme');
    if (THEMES.some((t) => t.id === param)) return param;
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.some((t) => t.id === saved) ? saved : 'ai-future';
  });

  // apply on mount + change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || '#070B1E');
  }, [theme]);

  const setTheme = useCallback((next) => {
    const root = document.documentElement;
    // enable a brief crossfade only during explicit switches
    root.classList.add('theme-anim');
    setThemeState(next);
    window.clearTimeout(setTheme._t);
    setTheme._t = window.setTimeout(() => root.classList.remove('theme-anim'), 700);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
