import { useEffect, useState } from "react";

type Theme = "unified" | "recovery" | "wealth";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("app-theme");
    return (stored as Theme) || "unified";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.removeAttribute("data-theme");
    
    // Set new theme
    if (theme !== "unified") {
      root.setAttribute("data-theme", theme);
    }
    
    // Persist to localStorage
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return { theme, setTheme };
};
