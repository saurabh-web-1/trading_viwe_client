import Renderer from "./Renderer";
import Interaction from "./Interaction";
import DrawingManager from "./DrawingManager";
import FakeLive from "./FakeLive";

export default class ChartEngine {
  constructor(canvas, candles) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.candles = candles;
    this.highlight = false;
     this.highlightGlow = false;



    this.padding = { left: 60, right: 80, top: 20, bottom: 40 };

    /* ---------------- ZOOM & PAN ---------------- */
    this.zoomX = 1;
    this.zoomY = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    /* ---------------- DRAW MODE ---------------- */
    this.isDrawingMode = false;

    /* ---------------- 🔥 CHART TYPE (NEW) ---------------- */
    this.chartType = "candles"; // default

    /* ---------------- CROSSHAIR ---------------- */
    this.crosshair = { x: null, y: null, visible: false };

    /* ---------------- THEME ---------------- */
    this.theme = this.getThemeColors();
    this.onThemeChange = () => {
      this.theme = this.getThemeColors();
    };
    window.addEventListener("theme-change", this.onThemeChange);

    /* ---------------- VOLUME & INDICATORS ---------------- */
    this.showVolume = true;
    this.indicators = [];

    this.futureBars = 30;
    this.intervalSec =
      candles.length > 1 ? candles[1].time - candles[0].time : 60;

    this.running = true;

    this.resize();

    this.interaction = new Interaction(this);
    this.drawing = new DrawingManager(this);
    this.renderer = new Renderer(this);
    this.fakeLive = new FakeLive(this);

    this.loop();
    window.addEventListener("resize", this.resize);
  }

  /* =====================================================
     🔥 PUBLIC METHODS
  ===================================================== */

  toggleDrawMode() {
    this.isDrawingMode = !this.isDrawingMode;
    this.drawing.mode = this.isDrawingMode ? "pen" : null;
  }




 centerOnLastCandle() {
  if (!this.candles?.length) return;

  const candleWidth = 8 * this.zoomX;

  const chartWidth =
    this.canvas.clientWidth -
    this.padding.left -
    this.padding.right;

  const visibleBars = Math.floor(chartWidth / candleWidth);
  const totalBars = this.candles.length;

  // 🔥 keep some future space
  this.offsetX =
    -((totalBars - visibleBars + 5) * candleWidth);
}

  /* ===================================================== */

  /* ---------- 🔥 CHART TYPE CONTROL (NEW) ---------- */

  setChartType(type) {
    this.chartType = type;
  }

  getChartType() {
    return this.chartType;
  }

  toggleVolume() {
    this.showVolume = !this.showVolume;
  }

  addIndicator(name, period = 14) {
    this.indicators.push({ name, period });
  }

  removeIndicator(index) {
    this.indicators.splice(index, 1);
  }

  clearIndicators() {
    this.indicators = [];
  }
  
  applyTemplate(name) {
  this.clearIndicators();

  if (name === "Scalping") {
    this.addIndicator("EMA", 9);
    this.addIndicator("VWAP", 14);
  }

  if (name === "Swing") {
    this.addIndicator("EMA", 21);
    this.addIndicator("RSI", 14);
  }
}

  reset() {
    this.zoomX = 1;
    this.zoomY = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    // 🔥 chartType intentionally NOT reset
    this.drawing.clear();
  }

  /* ---------------- THEME COLORS ---------------- */
  getThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    const bg = styles.getPropertyValue("--bg").trim();
    const accent = styles.getPropertyValue("--accent").trim();

    return {
      bg: bg || "#0b0b0f",
      text: styles.getPropertyValue("--text").trim() || "#ffffff",
      card: styles.getPropertyValue("--card").trim() || "#11162a",
      bullish: accent || "#22c55e",
      bearish: "#ef4444",
      scaleText: "#9ca3af",
      crosshair: "rgba(156,163,175,0.8)",
      grid:
        bg === "#ffffff"
          ? "rgba(0,0,0,0.08)"
          : "rgba(255,255,255,0.06)",
    };
  }

  resize = () => {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.clientWidth * dpr;
    this.canvas.height = this.canvas.clientHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  loop = () => {
    if (!this.running) return;
    this.renderer.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.fakeLive.stop();
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("theme-change", this.onThemeChange);
  }
}
