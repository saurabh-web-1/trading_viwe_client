import { useState } from "react";
import StockSearchModal from "./StockSearchModal";

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "1d"];
const INDICATORS = ["EMA", "SMA", "RSI", "VWAP"];
const TEMPLATES = [
  { name: "Scalping", indicators: ["EMA", "VWAP"] },
  { name: "Swing", indicators: ["EMA", "RSI"] },
];

export default function ChartTopBar({
  symbol,
  setSymbol,
  timeframe,
  setTimeframe,
  onReset,
  onAddIndicator,
  onApplyTemplate,
  onToggleVolume,
  indicators,
  onRemoveIndicator,
  onChartTypeChange,
  chartType,
}) {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <div
        className="relative z-40 flex items-center gap-3 px-4 h-12 border-b border-white/10"
        style={{ background: "var(--card)" }}
      >
        {/* 🔍 STOCK BUTTON (opens modal) */}
        <button
          onClick={() => setOpenSearch(true)}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm"
        >
          {symbol?.replace(".NS", "") || "Select Stock"}
        </button>

        {/* TIMEFRAME */}
        <select
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          className="bg-transparent text-sm"
        >
          {TIMEFRAMES.map(tf => (
            <option key={tf}>{tf}</option>
          ))}
        </select>

        {/* CHART TYPE */}
        <select
          value={chartType}
          onChange={e => onChartTypeChange(e.target.value)}
          className="bg-transparent text-sm"
        >
          <option value="candles">Candles</option>
          <option value="bars">Bars</option>
          <option value="hollow">Hollow</option>
          <option value="line">Line</option>
          <option value="step">Step</option>
          <option value="baseline">Baseline</option>
          <option value="highlow">High-Low</option>
        </select>

        {/* INDICATORS */}
        <select
          onChange={e => onAddIndicator(e.target.value)}
          className="bg-transparent text-sm"
        >
          <option>Indicators</option>
          {INDICATORS.map(i => (
            <option key={i}>{i}</option>
          ))}
        </select>

        {/* ACTIVE INDICATORS */}
        {indicators?.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            {indicators.map((ind, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/10"
              >
                <span>{ind.name}</span>
                <button
                  onClick={() => onRemoveIndicator(i)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TEMPLATE */}
        <select
          onChange={e => onApplyTemplate(e.target.value)}
          className="bg-transparent text-sm"
        >
          <option>Templates</option>
          {TEMPLATES.map(t => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        {/* VOLUME */}
        <button
          onClick={onToggleVolume}
          className="px-3 py-1 text-sm rounded bg-blue-500/20 text-blue-400"
        >
          Volume
        </button>

        {/* RESET */}
        <button
          onClick={onReset}
          className="ml-auto px-3 py-1 text-sm rounded bg-red-500/20 text-red-400"
        >
          Reset
        </button>
      </div>

      {/* 🔥 STOCK SEARCH MODAL */}
      <StockSearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSelect={sym => {
          setSymbol(sym);      // e.g. RELIANCE / TCS / TCS.NS
          setOpenSearch(false);
        }}
      />
    </>
  );
}
