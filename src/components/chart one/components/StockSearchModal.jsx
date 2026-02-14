import { useEffect, useState } from "react";

const POPULAR_STOCKS = [
  // 🔥 INDEX
  "NIFTY",
  "BANKNIFTY",

  // 🔥 LARGE CAPS
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
  "AXISBANK",
  "KOTAKBANK",

  // 🔥 IT
  "WIPRO",
  "HCLTECH",
  "TECHM",

  // 🔥 FMCG
  "HINDUNILVR",
  "ITC",
  "NESTLEIND",

  // 🔥 AUTO
  "TATAMOTORS",
  "MARUTI",
  "M&M",
  "BAJAJ-AUTO",

  // 🔥 METAL / ENERGY
  "ONGC",
  "COALINDIA",
  "TATASTEEL",
  "JSWSTEEL",

  // 🔥 PSU / DEFENCE
  "HAL",
  "BEL",
  "IRCTC",
  "POWERGRID",
  "NTPC",
];

export default function StockSearchModal({
  open,
  onClose,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/symbols/search?q=${query}`
        );
        const data = await res.json();
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        className="w-[420px] rounded-xl border border-white/10 shadow-xl"
        style={{ background: "var(--card)", color: "var(--text)" }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="font-semibold">Select Stock</span>
          <button onClick={onClose} className="opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-4">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stock (e.g. RELIANCE)"
            className="w-full px-3 py-2 rounded bg-white/5 outline-none"
          />
        </div>

        {/* POPULAR */}
        {!query && (
          <div className="px-4 pb-3">
            <div className="text-xs opacity-60 mb-2">POPULAR</div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
              {POPULAR_STOCKS.map(s => (
                <button
                  key={s}
                  onClick={() => onSelect(s)}
                  className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {query && (
          <div className="max-h-64 overflow-auto border-t border-white/10">
            {loading && (
              <div className="p-3 text-sm opacity-60">Searching…</div>
            )}

            {!loading && results.map(sym => (
              <div
                key={sym}
                onClick={() => onSelect(sym.replace(".NS", ""))}
                className="px-4 py-2 cursor-pointer hover:bg-white/10 text-sm"
              >
                {sym}
              </div>
            ))}

            {!loading && !results.length && (
              <div className="p-3 text-sm opacity-60">
                No results
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
