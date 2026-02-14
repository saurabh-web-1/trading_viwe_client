// src/components/scanner/MagicFilters.jsx

import { Sparkles } from "lucide-react";

export default function MagicFilters({ query, setQuery, tags, setTags, onGenerate }) {

  return (
    <div
      className="border border-white/10 rounded-2xl p-6 mb-6"
      style={{ background: "var(--card)" }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold mb-3 text-cyan-400">
        <Sparkles size={16} /> MAGIC FILTERS
      </div>

      <div className="flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Scan stocks using simple language…"
          className="flex-1 border border-white/20 rounded-lg px-4 py-2 text-sm"
          style={{ background: "var(--bg)" }}
        />

        <button
          onClick={onGenerate}
          className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold text-white"
        >
          Generate
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-xs border border-white/10"
            style={{ background: "var(--bg)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
