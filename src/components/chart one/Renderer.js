import Scale from "./Scale";
import drawVolume from "./VolumeRenderer";
import { EMA, SMA, RSI  } from "./indicators";

export default class Renderer {
  constructor(engine) {
    this.e = engine;

    // 👇 expose panels for Interaction if needed later
    this.pricePanel = null;
    this.volumePanel = null;
  }

  draw() {
    const { ctx, canvas, candles, theme } = this.e;
    if (!candles?.length) return;

    const padding = this.e.padding;

    /* ---------- CLEAR + BG ---------- */
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    /* =====================================================
       🔥 PANEL LAYOUT (UNCHANGED)
    ===================================================== */

    const totalHeight =
      canvas.clientHeight - padding.top - padding.bottom;

    const pricePanel = {
      top: padding.top,
      height: totalHeight * 0.75,
    };

    const volumePanel = {
      top: pricePanel.top + pricePanel.height,
      height: totalHeight * 0.25,
    };

    this.pricePanel = pricePanel;
    this.volumePanel = volumePanel;

    const chartWidth =
      canvas.clientWidth - padding.left - padding.right;

    const chartHeight = pricePanel.height;


    

    /* ---------- PRICE SCALE ---------- */
    const prices = candles.flatMap(c => [c.high, c.low]);
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);

    const mid = (rawMin + rawMax) / 2;
    const range = (rawMax - rawMin) / this.e.zoomY;

    const minPrice = mid - range / 2;
    const maxPrice = mid + range / 2;

    const priceScale = new Scale(minPrice, maxPrice, chartHeight);


    

    /* ---------- GRID ---------- */
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y =
        pricePanel.top +
        (chartHeight / 5) * i +
        this.e.offsetY;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(canvas.clientWidth - padding.right, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 5; i++) {
      const x =
        padding.left +
        (chartWidth / 5) * i +
        this.e.offsetX;

      ctx.beginPath();
      ctx.moveTo(x, pricePanel.top);
      ctx.lineTo(x, pricePanel.top + chartHeight);
      ctx.stroke();
    }





    /* =====================================================
       🔥 MULTI CHART TYPE (ADD – NO DELETE)
    ===================================================== */

    const candleWidth = 8 * this.e.zoomX;

    const toY = v =>
      pricePanel.top +
      chartHeight -
      priceScale.toPixel(v) +
      this.e.offsetY;

    switch (this.e.chartType) {
      case "bars":
        this.drawBars(candles, candleWidth, toY);
        break;

      case "line":
        this.drawLine(candles, candleWidth, toY);
        break;

      case "step":
        this.drawStepLine(candles, candleWidth, toY);
        break;

      case "hollow":
        this.drawHollowCandles(candles, candleWidth, toY);
        break;

      case "highlow":
        this.drawHighLow(candles, candleWidth, toY);
        break;

      case "baseline":
        this.drawBaseline(candles, candleWidth, toY);
        break;

      case "columns":
        this.drawColumns(candles, candleWidth, toY);
        break;

      default:
        // 👇 EXISTING CANDLE LOGIC (UNCHANGED)
        candles.forEach((c, i) => {
          const x =
            padding.left +
            i * candleWidth +
            this.e.offsetX;

          const color =
            c.close >= c.open ? theme.bullish : theme.bearish;

          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(x, toY(c.high));
          ctx.lineTo(x, toY(c.low));
          ctx.stroke();

          ctx.fillStyle = color;
          ctx.fillRect(
            x - candleWidth / 2,
            Math.min(toY(c.open), toY(c.close)),
            candleWidth * 0.7,
            Math.abs(toY(c.open) - toY(c.close)) || 1
          );
        });
    }

   

    /* ---------- INDICATORS (UNCHANGED) ---------- */
    const closes = candles.map(c => c.close);

    this.e.indicators?.forEach(ind => {
      let values = [];
      if (ind.name === "EMA") values = EMA(closes, ind.period);
      if (ind.name === "SMA") values = SMA(closes, ind.period);
      if (ind.name === "RSI") values = RSI(closes, ind.period);

      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;

      values.forEach((v, i) => {
        if (v == null) return;

        const x =
          padding.left +
          i * candleWidth +
          this.e.offsetX;

        ctx.lineTo(x, toY(v));
      });

      ctx.stroke();
    });

    /* ---------- VOLUME (UNCHANGED) ---------- */
    if (this.e.showVolume) {
      drawVolume(ctx, candles, this.e, volumePanel);
    }
        /* =====================================================
 /* =====================================================
   🔥 RIGHT PRICE SCALE (PRICE + VOLUME – FIXED)
===================================================== */

ctx.save();
ctx.fillStyle = theme.scaleText;
ctx.font = "11px sans-serif";
ctx.textAlign = "right";

const pixelsPerStep = 60;

const startY = padding.top;
const endY = canvas.height - padding.bottom;

for (let y = startY; y <= endY; y += pixelsPerStep) {
  let price;

  if (y <= pricePanel.top + pricePanel.height) {
    // 🔥 normal price calculation (price panel)
    price =
      maxPrice -
      ((y - pricePanel.top) / pricePanel.height) *
        (maxPrice - minPrice);
  } else {
    // 🔥 volume panel area → last visible price
    price = minPrice;
  }

  // grid line (optional)
  ctx.strokeStyle = theme.grid;
  ctx.beginPath();
  ctx.moveTo(padding.left, y);
  ctx.lineTo(canvas.width - padding.right, y);
  ctx.stroke();

  // price label (ALWAYS visible)
  ctx.fillStyle = theme.scaleText;
  ctx.fillText(
    price.toFixed(2),
    canvas.width - 6,
    y + 4
  );
}

ctx.restore();

/* ================= END RIGHT PRICE SCALE ================= */
/* ---------- CURRENT PRICE (SCAN HIGHLIGHT + GLOW) ---------- */
const last = candles[candles.length - 1];
const lastColor =
  last.close >= last.open ? theme.bullish : theme.bearish;

const priceY =
  pricePanel.top +
  chartHeight -
  priceScale.toPixel(last.close) +
  this.e.offsetY;

// 🔥 GLOW EFFECT (2 sec)
if (this.e.highlightGlow) {
  ctx.shadowColor = lastColor;
  ctx.shadowBlur = 14;
}

// 🔥 DASH vs SOLID
ctx.setLineDash(this.e.highlight ? [] : [6, 4]);
ctx.lineWidth = this.e.highlight ? 2.5 : 1;

ctx.strokeStyle = lastColor;
ctx.beginPath();
ctx.moveTo(padding.left, priceY);
ctx.lineTo(canvas.clientWidth - padding.right, priceY);
ctx.stroke();

// 🔥 RESET DASH + GLOW
ctx.setLineDash([]);
ctx.shadowBlur = 0;

// 🔥 PRICE LABEL (bold when highlighted)
ctx.fillStyle = lastColor;
ctx.fillRect(
  canvas.clientWidth - padding.right + 6,
  priceY - 10,
  padding.right - 12,
  20
);

ctx.fillStyle = "#000";
ctx.font = this.e.highlight
  ? "bold 12px sans-serif"
  : "11px sans-serif";

ctx.fillText(
  last.close.toFixed(2),
  canvas.clientWidth - padding.right + 12,
  priceY + 5
);



    

    /* ---------- DRAWINGS (UNCHANGED) ---------- */
    this.e.drawing.draw(ctx);

    /* ---------- TIME SCALE (BOTTOM – IMPROVED) ---------- */
ctx.save();
ctx.fillStyle = theme.scaleText;
ctx.font = "11px sans-serif";
ctx.textAlign = "center";

const pixelsPerLabel = 120; // 🔥 control density here
const startX = padding.left;
const endX = canvas.width - padding.right;

for (let x = startX; x <= endX; x += pixelsPerLabel) {
  // candle index at this x position
  const index =
    Math.floor(
      (x - padding.left - this.e.offsetX) / candleWidth
    );

  if (index < 0) continue;

  // 🔥 candle ke baad future time generate karo
  const baseCandle =
    candles[Math.min(index, candles.length - 1)];

  if (!baseCandle?.time) continue;

  const time =
    baseCandle.time +
    (index - (candles.length - 1)) * this.e.intervalSec;

  const date = new Date(time * 1000);

  const label =
    this.e.intervalSec < 3600
      ? date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : date.toLocaleDateString();

  ctx.fillText(label, x, canvas.height - 8);
}

ctx.restore();
/* ---------- END TIME SCALE ---------- */

  }

  /* =====================================================
     🔥 ADDITIONAL DRAW METHODS (NEW)
  ===================================================== */

  drawBars(candles, w, toY) {
    const { ctx, padding, theme } = this.e;

    candles.forEach((c, i) => {
      const x = padding.left + i * w + this.e.offsetX;
      const color = c.close >= c.open ? theme.bullish : theme.bearish;

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.moveTo(x - 4, toY(c.open));
      ctx.lineTo(x, toY(c.open));
      ctx.moveTo(x, toY(c.close));
      ctx.lineTo(x + 4, toY(c.close));
      ctx.stroke();
    });
  }

  drawLine(candles, w, toY) {
    const { ctx, padding } = this.e;
    ctx.beginPath();

    candles.forEach((c, i) => {
      const x = padding.left + i * w + this.e.offsetX;
      i ? ctx.lineTo(x, toY(c.close)) : ctx.moveTo(x, toY(c.close));
    });

    ctx.stroke();
  }

  drawStepLine(candles, w, toY) {
    const { ctx, padding } = this.e;
    ctx.beginPath();
    let prevY = null;

    candles.forEach((c, i) => {
      const x = padding.left + i * w + this.e.offsetX;
      const y = toY(c.close);

      if (i === 0) ctx.moveTo(x, y);
      else {
        ctx.lineTo(x, prevY);
        ctx.lineTo(x, y);
      }
      prevY = y;
    });

    ctx.stroke();
  }

  drawHollowCandles(candles, w, toY) {
    const { ctx, padding, theme } = this.e;

    candles.forEach((c, i) => {
      const x = padding.left + i * w + this.e.offsetX;
      const bullish = c.close >= c.open;
      const color = bullish ? theme.bullish : theme.bearish;

      ctx.strokeStyle = color;
      ctx.strokeRect(
        x - w / 2,
        Math.min(toY(c.open), toY(c.close)),
        w * 0.7,
        Math.abs(toY(c.open) - toY(c.close)) || 1
      );

      if (!bullish) {
        ctx.fillStyle = color;
        ctx.fillRect(
          x - w / 2,
          Math.min(toY(c.open), toY(c.close)),
          w * 0.7,
          Math.abs(toY(c.open) - toY(c.close)) || 1
        );
      }
    });
  }

  drawHighLow(candles, w, toY) {
    const { ctx, padding } = this.e;

    candles.forEach((c, i) => {
      const x = padding.left + i * w + this.e.offsetX;
      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.stroke();
    });
  }

  drawBaseline(candles, w, toY) {
    const { ctx, padding, theme } = this.e;
    const base = candles[0].close;

    ctx.beginPath();
    candles.forEach((c, i) => {
      ctx.strokeStyle =
        c.close >= base ? theme.bullish : theme.bearish;

      const x = padding.left + i * w + this.e.offsetX;
      ctx.lineTo(x, toY(c.close));
    });
    ctx.stroke();
  }

  drawColumns(candles, w, toY) {
    const { ctx, padding, theme } = this.e;

    candles.forEach((c, i) => {
      const x = padding.left + i * w + this.e.offsetX;
      const color = c.close >= c.open ? theme.bullish : theme.bearish;

      ctx.fillStyle = color;
      ctx.fillRect(
        x - w / 2,
        toY(c.open),
        w * 0.7,
        toY(c.close) - toY(c.open)
      );
    });
  }
}
