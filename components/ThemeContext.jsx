"use client";

import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "mgallery_theme";

export function ThemeProvider({ children }) {
  // The inline script in RootLayout already sets data-theme on <html>
  // before hydration, so read it back here to avoid a mismatch/flash.
  const [theme, setThemeState] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.getAttribute("data-theme") || "dark";
    }
    return "dark";
  });

  function setTheme(next) {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      console.error("Could not save theme preference:", err);
    }
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
