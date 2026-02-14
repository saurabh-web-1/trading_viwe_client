// src/context/ThemeContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

 useEffect(() => {
  document.documentElement.className = "";
  document.documentElement.classList.add(theme);

  localStorage.setItem("theme", theme);

  // 🔥 notify chart engine (LIVE)
  window.dispatchEvent(
    new CustomEvent("theme-change", { detail: theme })
  );
}, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
