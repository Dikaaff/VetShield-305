"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "vetshield-theme-v2";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const preferred = getPreferredTheme();
    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan light mode" : "Aktifkan night mode"}
      title={isDark ? "Light mode" : "Night mode"}
      className="group inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-paper text-forest transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-orange/40 hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <span className="sr-only">{isDark ? "Light mode" : "Night mode"}</span>
      {isDark ? (
        <Sun className="h-[17px] w-[17px] transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="h-[17px] w-[17px] transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
