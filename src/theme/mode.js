"use client";

// Theme state lives on <html data-theme>, not in React, so the boot script in
// the root layout can paint the right colours before hydration. This module is
// the small external store that components read that attribute through.

export const THEME_STORAGE_KEY = "fp-theme";

const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener());
};

// The four themes are really a 2x2: a surface style crossed with a
// brightness. `data-theme` stays a single attribute because the stylesheet
// and the boot script both want one value, but nothing outside this file
// should have to know which of the four names encodes which pair.
export const THEMES = ["light", "dark", "phormism", "phormism-dark"];

const THEME_BY_AXES = {
  "normal:light": "light",
  "normal:dark": "dark",
  "morphism:light": "phormism",
  "morphism:dark": "phormism-dark",
};

const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const getTheme = () => {
  const current = document.documentElement.dataset.theme;

  return THEMES.includes(current) ? current : "light";
};

// Rendered on the server, where no attribute exists yet. Light matches the
// stylesheet default; the store corrects it on the first client render.
export const getServerTheme = () => "light";

export const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just won't outlive the tab.
  }

  notify();
};

// --- The two axes -------------------------------------------------------
// Read off the theme name rather than stored separately, so there is still
// one source of truth and no way for the two to disagree.

// Pure, so a component can pass the value it already subscribed to instead
// of reading the DOM again — which it must not do during a server render.
export const styleOf = (theme) =>
  String(theme).startsWith("phormism") ? "morphism" : "normal";

export const brightnessOf = (theme) =>
  String(theme).endsWith("dark") ? "dark" : "light";

export const getStyle = () => styleOf(getTheme());

export const getBrightness = () => brightnessOf(getTheme());

// Flipping one axis leaves the other where it was — which is the whole point
// of splitting them: switching to dark should not also drop you out of
// morphism, and vice versa.
export const toggleStyle = () => {
  const next = getStyle() === "morphism" ? "normal" : "morphism";

  setTheme(THEME_BY_AXES[`${next}:${getBrightness()}`]);
};

export const toggleBrightness = () => {
  const next = getBrightness() === "dark" ? "light" : "dark";

  setTheme(THEME_BY_AXES[`${getStyle()}:${next}`]);
};

export const subscribe = (listener) => {
  listeners.add(listener);

  // Another tab changed the preference.
  const onStorage = (event) => {
    if (event.key !== THEME_STORAGE_KEY || !event.newValue) return;

    document.documentElement.dataset.theme = event.newValue;

    notify();
  };

  // The OS flipped and the user has never picked a theme by hand.
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onSystemChange = () => {
    let stored = null;

    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (stored) return;

    document.documentElement.dataset.theme = systemTheme();

    notify();
  };

  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystemChange);

  return () => {
    listeners.delete(listener);

    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemChange);
  };
};

// Runs as a blocking inline script before first paint, so there is no flash of
// the wrong theme. Kept as a string because it must not wait for hydration.
export const THEME_BOOT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("${THEME_STORAGE_KEY}");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    var known = ["light", "dark", "phormism", "phormism-dark"];

    document.documentElement.dataset.theme =
      known.indexOf(stored) !== -1 ? stored : system;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;
