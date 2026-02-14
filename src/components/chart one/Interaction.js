export default class Interaction {
  constructor(engine) {
    this.e = engine;

    this.isPanning = false;
    this.isYZooming = false;

    this.lastX = 0;
    this.lastY = 0;

    this.bind();
  }

  bind() {
    const canvas = this.e.canvas;

    canvas.addEventListener("wheel", this.onWheel, { passive: false });
    canvas.addEventListener("mousedown", this.onDown);
    canvas.addEventListener("mousemove", this.onHover);
    canvas.addEventListener("mouseleave", this.onLeave);

    window.addEventListener("mousemove", this.onMove);
    window.addEventListener("mouseup", this.onUp);
  }

  /* ---------------- WHEEL ZOOM (UNCHANGED) ---------------- */
  onWheel = (e) => {
    e.preventDefault();
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    const speed = 0.0015;
    const factor = 1 - e.deltaY * speed;

    const prevX = this.e.zoomX;
    const nextX = Math.min(Math.max(prevX * factor, 0.5), 8);

    const rect = this.e.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const anchor =
      (mouseX - this.e.padding.left - this.e.offsetX) / prevX;

    this.e.zoomX = nextX;
    this.e.offsetX =
      mouseX - this.e.padding.left - anchor * nextX;

    this.e.zoomY = Math.min(Math.max(this.e.zoomY * factor, 0.5), 6);
  };

  /* ---------------- MOUSE DOWN ---------------- */
  onDown = (e) => {
    if (this.e.isDrawingMode) return; // ✅ PAN BLOCK
    if (e.button !== 0) return;

    const rect = this.e.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const rightScaleStart = rect.width - this.e.padding.right;

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (x >= rightScaleStart) {
      this.isYZooming = true;
      this.e.canvas.style.cursor = "ns-resize";
    } else {
      this.isPanning = true;
      this.e.canvas.style.cursor = "grabbing";
    }
  };

  /* ---------------- MOUSE MOVE ---------------- */
  onMove = (e) => {
    if (this.e.isDrawingMode) return; // ✅ PAN BLOCK ONLY

    if (this.isYZooming) {
      const dy = e.clientY - this.lastY;
      this.lastY = e.clientY;

      const factor = 1 + dy * 0.01;
      this.e.zoomY = Math.min(Math.max(this.e.zoomY * factor, 0.5), 6);
      return;
    }

    if (this.isPanning) {
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;

      this.lastX = e.clientX;
      this.lastY = e.clientY;

      this.e.offsetX += dx;
      this.e.offsetY += dy;
    }
  };

  onUp = () => {
    this.isPanning = false;
    this.isYZooming = false;
    this.e.canvas.style.cursor = "grab";
  };

  /* ---------------- CROSSHAIR ---------------- */
  onHover = (e) => {
    const rect = this.e.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      x < this.e.padding.left ||
      x > rect.width - this.e.padding.right ||
      y < this.e.padding.top ||
      y > rect.height - this.e.padding.bottom
    ) {
      this.e.crosshair.visible = false;
      return;
    }

    this.e.crosshair.x = x;
    this.e.crosshair.y = y;
    this.e.crosshair.visible = true;
  };

  onLeave = () => {
    this.e.crosshair.visible = false;
  };

  destroy() {
  const canvas = this.e.canvas;
  canvas.removeEventListener("wheel", this.onWheel);
  canvas.removeEventListener("mousedown", this.onDown);
  canvas.removeEventListener("mousemove", this.onHover);
  canvas.removeEventListener("mouseleave", this.onLeave);

  window.removeEventListener("mousemove", this.onMove);
  window.removeEventListener("mouseup", this.onUp);
}

}
