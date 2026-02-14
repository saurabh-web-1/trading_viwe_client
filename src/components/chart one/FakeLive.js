export default class FakeLive {
  constructor(engine) {
    this.e = engine;
    this.start();
  }

  start() {
    this.timer = setInterval(() => {
      const last = this.e.candles.at(-1);
      if (!last) return;

      const delta = (Math.random() - 0.5) * last.close * 0.002;

      // 🔒 NO direct mutation
      this.e.candles[this.e.candles.length - 1] = {
        ...last,
        close: last.close + delta,
        high: Math.max(last.high, last.close + delta),
        low: Math.min(last.low, last.close + delta),
        volume: last.volume ?? Math.random() * 1_000_000
      };
    }, 700);
  }

  stop() {
    clearInterval(this.timer);
  }
}
