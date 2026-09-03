"use client";

import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import {
  getServerTheme,
  getTheme,
  subscribe,
  toggleTheme,
} from "@/theme/mode";

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme);
}

export default function ThemeToggle({ className = "" }) {
  const theme = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink active:scale-95 ${className}`}
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  );
}
