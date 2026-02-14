export default function drawVolume(
  ctx,
  candles,
  engine,
  panel
) {
  const { padding, theme } = engine;

  if (!candles.length) return;

  const maxVol = Math.max(...candles.map(c => c.volume || 0));
  if (!maxVol) return;

  const candleWidth = 8 * engine.zoomX;

  candles.forEach((c, i) => {
    const x =
      padding.left +
      i * candleWidth +
      engine.offsetX;

    if (
      x < padding.left ||
      x > engine.canvas.clientWidth - padding.right
    )
      return;

    const h = (c.volume / maxVol) * panel.height;

    const color =
      c.close >= c.open ? theme.bullish : theme.bearish;

    ctx.fillStyle = color;
    ctx.fillRect(
      x - candleWidth * 0.35,
      panel.top + panel.height - h,
      candleWidth * 0.7,
      h
    );
  });
}
