"use client";

import { useSyncExternalStore } from "react";
import { FiCircle, FiGrid, FiMoon, FiSquare, FiSun } from "react-icons/fi";

import {
  brightnessOf,
  getServerTheme,
  getTheme,
  nextStyleOf,
  subscribe,
  toggleBrightness,
  toggleStyle,
} from "@/theme/mode";

// Icon and name for each surface style, shown for the style the switch
// will move to next.
const STYLE_META = {
  normal: { Icon: FiSquare, label: "Normal" },
  morphism: { Icon: FiCircle, label: "Morphism" },
  brutal: { Icon: FiGrid, label: "Brutal" },
};

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme);
}

const BUTTON_CLASS =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink active:scale-95";

/**
 * Two independent switches: surface style on the left (stepping through
 * normal, morphism and brutal), brightness on the right. They are separate
 * because they are separate choices — wanting dark should not cost you your
 * style, and one cycle through all six themes would be a guessing game.
 *
 * Each icon shows the state the button will move *to*, which is how the
 * original single toggle read.
 */
export default function ThemeToggle({ className = "" }) {
  // Both axes come off the one subscribed value: a single store read drives
  // both buttons, and nothing here touches the DOM, so this still renders on
  // the server.
  const theme = useTheme();

  const nextStyle = STYLE_META[nextStyleOf(theme)];
  const dark = brightnessOf(theme) === "dark";

  const StyleIcon = nextStyle.Icon;
  const BrightnessIcon = dark ? FiSun : FiMoon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleStyle}
        aria-label={`Switch to ${nextStyle.label.toLowerCase()} style`}
        title={`${nextStyle.label} style`}
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
