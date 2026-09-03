"use client";

// Theme state lives on <html data-theme>, not in React, so the boot script in
// the root layout can paint the right colours before hydration. This module is
// the small external store that components read that attribute through.

export const THEME_STORAGE_KEY = "fp-theme";

const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const getTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

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

export const toggleTheme = () => {
  setTheme(getTheme() === "dark" ? "light" : "dark");
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
    document.documentElement.dataset.theme =
      stored === "dark" || stored === "light" ? stored : system;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;
