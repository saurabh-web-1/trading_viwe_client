export function EMA(values, period) {
  const k = 2 / (period + 1);
  let ema = values[0];
  return values.map(v => {
    ema = v * k + ema * (1 - k);
    return ema;
  });
}

export function RSI(values, period = 14) {
  let gains = 0, losses = 0;
  const rsi = [];

  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains += diff > 0 ? diff : 0;
    losses += diff < 0 ? -diff : 0;

    if (i >= period) {
      const rs = gains / losses || 0;
      rsi.push(100 - 100 / (1 + rs));
    } else {
      rsi.push(null);
    }
  }
  return [null, ...rsi];
}

/* ✅ ADD */
export function SMA(values, period = 14) {
  return values.map((_, i, arr) => {
    if (i < period) return null;
    const slice = arr.slice(i - period, i);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}
