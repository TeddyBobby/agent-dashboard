'use client';

import { useSyncExternalStore, useCallback } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage unavailable (e.g. private browsing in some browsers)
  }
  return null;
}

// Module-level cache of the current theme. This is the "external store" that
// useSyncExternalStore subscribes to, so the value must stay stable between
// renders until it actually changes.
let currentTheme: Theme | null = null;

const listeners = new Set<() => void>();

function readTheme(): Theme {
  return getStoredTheme() || getSystemTheme();
}

function getSnapshot(): Theme {
  if (currentTheme === null) {
    currentTheme = readTheme();
  }
  return currentTheme;
}

// The server always renders 'light' because it can't know the client's
// localStorage or system preference. Providing a matching server snapshot is
// what lets useSyncExternalStore hydrate without a mismatch, then switch to
// the real theme immediately after hydration.
function getServerSnapshot(): Theme {
  return 'light';
}

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

function setTheme(theme: Theme, persist: boolean) {
  currentTheme = theme;
  applyThemeClass(theme);
  if (persist) persistTheme(theme);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Follow system theme changes only while the user hasn't set an explicit
  // preference (explicit choices are persisted to localStorage and win).
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = (e: MediaQueryListEvent) => {
    if (getStoredTheme()) return;
    setTheme(e.matches ? 'dark' : 'light', false);
  };
  mql.addEventListener('change', onSystemChange);

  return () => {
    mql.removeEventListener('change', onSystemChange);
    listeners.delete(listener);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark', true);
  }, [theme]);

  return { theme, toggle };
}
