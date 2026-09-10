"use client";

import { useSyncExternalStore } from "react";
import { FiCircle, FiMoon, FiSun } from "react-icons/fi";

import {
  cycleTheme,
  getServerTheme,
  getTheme,
  subscribe,
} from "@/theme/mode";

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme);
}

// Each entry describes the theme the button will move to next, so the icon
// is a preview of the result rather than a label for the current state —
// which is how the two-theme version read, and worth keeping at three.
const NEXT = {
  light: { theme: "dark", icon: FiMoon, label: "dark" },
  dark: { theme: "phormism", icon: FiCircle, label: "phormism" },
  phormism: { theme: "light", icon: FiSun, label: "light" },
};

export default function ThemeToggle({ className = "" }) {
  const theme = useTheme();

  const next = NEXT[theme] ?? NEXT.light;

  const Icon = next.icon;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Switch to ${next.label} theme`}
      title={`${next.label.charAt(0).toUpperCase()}${next.label.slice(1)} mode`}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink active:scale-95 ${className}`}
    >
      <Icon size={16} />
    </button>
  );
}
