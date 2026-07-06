"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Passer au thème sombre" : "Passer au thème clair"}
      title={isLight ? "Thème sombre" : "Thème clair"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        border: "1px solid var(--line)",
        background: "transparent",
        color: "var(--gold)",
      }}
    >
      {isLight ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}
