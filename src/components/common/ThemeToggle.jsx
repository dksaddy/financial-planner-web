"use client";

import { useSyncExternalStore } from "react";
import { FiCircle, FiMoon, FiSquare, FiSun } from "react-icons/fi";

import {
  brightnessOf,
  getServerTheme,
  getTheme,
  styleOf,
  subscribe,
  toggleBrightness,
  toggleStyle,
} from "@/theme/mode";

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme);
}

const BUTTON_CLASS =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink active:scale-95";

/**
 * Two independent switches, not one cycle: surface style on the left,
 * brightness on the right. They are separate because they are separate
 * choices — wanting dark should not cost you morphism, and a cycle made
 * reaching three of the four combinations a guessing game.
 *
 * Each icon shows the state the button will move *to*, which is how the
 * original single toggle read.
 */
export default function ThemeToggle({ className = "" }) {
  // Both axes come off the one subscribed value: a single store read drives
  // both buttons, and nothing here touches the DOM, so this still renders on
  // the server.
  const theme = useTheme();

  const morphism = styleOf(theme) === "morphism";
  const dark = brightnessOf(theme) === "dark";

  const StyleIcon = morphism ? FiSquare : FiCircle;
  const BrightnessIcon = dark ? FiSun : FiMoon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleStyle}
        aria-pressed={morphism}
        aria-label={`Switch to ${morphism ? "normal" : "morphism"} style`}
        title={morphism ? "Normal style" : "Morphism style"}
        className={BUTTON_CLASS}
      >
        <StyleIcon size={16} />
      </button>

      <button
        type="button"
        onClick={toggleBrightness}
        aria-pressed={dark}
        aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
        title={dark ? "Light mode" : "Dark mode"}
        className={BUTTON_CLASS}
      >
        <BrightnessIcon size={16} />
      </button>
    </div>
  );
}
