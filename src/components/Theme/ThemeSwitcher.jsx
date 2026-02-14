
// src/components/ThemeSwitcher.jsx

import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Heart } from "lucide-react";

const OPTIONS = [
  { id: "light", label: "White", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "pink", label: "Pink", icon: Heart },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const active = OPTIONS.find(t => t.id === theme);

  return (
    <div className="relative">
      {/* Button (current theme) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
      >
        <active.icon size={16} />
        <span className="text-sm font-semibold">
          {active.label}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
  <div
    className="absolute mt-2 right-0 w-44 bg-[#0b0b0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50
    animate-[fadeIn_0.25s_ease]"
  >
    {OPTIONS.map(opt => (
      <button
        key={opt.id}
        onClick={() => {
          setTheme(opt.id);
          setOpen(false);
        }}
        className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition
        hover:bg-white/10 ${
          theme === opt.id ? "font-semibold text-purple-400" : "text-gray-300"
        }`}
      >
        <opt.icon size={16} />
        {opt.label}
      </button>
    ))}
  </div>
)}

    </div>
  );
}
