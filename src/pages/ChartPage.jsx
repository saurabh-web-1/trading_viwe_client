import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import ChartCanvas from "../components/chart one/ChartCanvas";
import ChartTopBar from "../components/chart one/components/ChartTopBar";
import DrawingToolbar from "../components/chart one/components/DrawingToolbar";
import { useLocation } from "react-router-dom";



/* 🔥 UI → BACKEND SYMBOL MAP */



/* 🔥 SAFE RANGE BY TIMEFRAME */
const RANGE_BY_INTERVAL = {
  "1m": "5d",
  "5m": "5d",
  "15m": "1mo",
  "1h": "3mo",
  "1d": "6mo",
};

export default function ChartPage() {
  const [candles, setCandles] = useState([]);
  const [symbol, setSymbol] = useState("RELIANCE");
  const [timeframe, setTimeframe] = useState("1m");

  const engineRef = useRef(null);
  const [engineReady, setEngineReady] = useState(false);

  const [chartType, setChartType] = useState("candles");

  const location = useLocation();

useEffect(() => {
  if (location.state?.symbol) {
    setSymbol(location.state.symbol); // already Yahoo symbol
  }
}, [location.state]);



const highlightFromScan = location.state?.highlight === true;


  // 🔥 canvas remount
  const [chartKey, setChartKey] = useState(0);

  // 🔥 FORCE UI RERENDER (IMPORTANT)
  const [uiTick, setUiTick] = useState(0);
  const forceUI = () => setUiTick(t => t + 1);

  const loadData = async () => {
    try {
      const apiSymbol =
     symbol.startsWith("^") || symbol.includes(".")
      ? symbol
      : `${symbol}.NS`;

      const range = RANGE_BY_INTERVAL[timeframe] || "6mo";

      const res = await fetch(
        `https://trading-viwe-server.vercel.app/api/stock/${encodeURIComponent(
          apiSymbol
        )}?interval=${timeframe}&range=${range}`
      );

      const data = await res.json();

      const cleanCandles = (data.candles || [])
        .filter(
          c =>
            c &&
            c.open != null &&
            c.high != null &&
            c.low != null &&
            c.close != null
        )
        .map(c => ({
          ...c,
          volume: c.volume ?? Math.random() * 1_000_000,
          time: c.time > 1e12 ? Math.floor(c.time / 1000) : c.time,
        }))
        .sort((a, b) => a.time - b.time);

      setEngineReady(false);
      setCandles([]);
      setChartKey(k => k + 1);

      requestAnimationFrame(() => {
        setCandles(cleanCandles);
      });
    } catch (e) {
      console.error("DATA FETCH ERROR:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [symbol, timeframe]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <Navbar />

      <div className="pt-[72px] flex flex-col flex-1 overflow-hidden">
        {/* 🔥 FORCE RERENDER VIA KEY */}
       <ChartTopBar
  key={uiTick}
  symbol={symbol}
  setSymbol={setSymbol}
  timeframe={timeframe}
  setTimeframe={setTimeframe}
  onReset={() => engineRef.current?.reset?.()}

  onAddIndicator={i => {
    engineRef.current?.addIndicator?.(i);
    forceUI();
  }}

  onRemoveIndicator={i => {
    engineRef.current?.removeIndicator?.(i);
    forceUI();
  }}

  onToggleVolume={() => {
    engineRef.current?.toggleVolume?.();
    forceUI(); // ✅ REQUIRED
  }}

  onApplyTemplate={t => engineRef.current?.applyTemplate?.(t)}
  indicators={engineRef.current?.indicators || []}
  chartType={chartType}   // ✅ MUST BE PASSED
   onChartTypeChange={type => {
  setChartType(type);               // 🔥 persist
  engineRef.current?.setChartType(type);
}}


  
/>

        <div className="relative flex-1 overflow-hidden">
          {engineReady && (
            <DrawingToolbar engine={engineRef.current} />
          )}

          <div className="absolute inset-0 pl-12">
            <ChartCanvas
              key={chartKey}
              candles={candles}
              engineRef={engineRef}
               chartType={chartType}     // ✅ ADD THIS
                 highlight={highlightFromScan}   // 🔥 ADD THIS

              onReady={() => setEngineReady(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
