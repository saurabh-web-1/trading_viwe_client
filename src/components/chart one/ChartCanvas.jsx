import { useEffect, useRef } from "react";
import ChartEngine from "./ChartEngine";

export default function ChartCanvas({ candles, engineRef, chartType, highlight,  onReady }) {
  const canvasRef = useRef(null);

  /* ---------------- CREATE / DESTROY ENGINE ---------------- */
  useEffect(() => {
    if (!canvasRef.current || !candles?.length) return;

    // 🔥 DESTROY OLD ENGINE
    engineRef.current?.destroy();

    // 🔥 CREATE NEW ENGINE
    engineRef.current = new ChartEngine(
      canvasRef.current,
      candles
    );


    // 🔥 RE-APPLY CHART TYPE
     engineRef.current.setChartType(chartType);

    // 🔥 ALWAYS RESET STATE
    engineRef.current.zoomX = 1;
    engineRef.current.zoomY = 1;
    engineRef.current.offsetX = 0;
    engineRef.current.offsetY = 0;


        // 🔥 AUTO CENTER LAST CANDLE
engineRef.current.centerOnLastCandle();
    // 🔥 PASS HIGHLIGHT FLAG
     engineRef.current.highlight = highlight;

if (highlight) {
  engineRef.current.highlightGlow = true;

  setTimeout(() => {
    if (engineRef.current) {
      engineRef.current.highlightGlow = false;
    }
  }, 2000);

  setTimeout(() => {
    if (engineRef.current) {
      engineRef.current.highlight = false;
    }
  }, 3000);
}


    // 🔥 notify parent
    onReady?.();

    return () => {
      engineRef.current?.destroy();
      // ❌ DO NOT set engineRef.current = null
    };
  }, [candles ]);

  /* ---------------- RESIZE OBSERVER ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      engineRef.current?.resize();
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  /* ---------------- MOBILE TOUCH SCROLL BLOCK ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const block = e => e.preventDefault();
    canvas.addEventListener("touchmove", block, { passive: false });

    return () => {
      canvas.removeEventListener("touchmove", block);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        position: "relative",
        zIndex: 1,
        background: "var(--bg)",
        outline: "none",
        touchAction: "none",
        cursor: "grab",
      }}
    />
  );
}
