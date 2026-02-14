export default class DrawingManager {
  constructor(engine) {
    this.e = engine;

    this.lines = [];
    this.current = null;

    this.color = "#22c55e";
    this.width = 2;
    this.mode = null;

    /* 🔥 NEW */
    this.selectedIndex = null;
    this.dragging = false;
    this.dragStart = null;

    this.undoStack = [];
    this.redoStack = [];

    engine.canvas.addEventListener("mousedown", this.onDown);
    engine.canvas.addEventListener("mousemove", this.onMove);
    engine.canvas.addEventListener("mouseup", this.onUp);
    window.addEventListener("keydown", this.onKey);
  }

  /* ---------------- COORD CONVERT ---------------- */
  toChartPoint = (e) => {
    const panel = this.e.renderer.pricePanel;
    if (!panel) return null;

    const x =
      (e.offsetX - this.e.padding.left - this.e.offsetX) /
      this.e.zoomX;

    const y =
      e.offsetY - panel.top - this.e.offsetY;

    return { x, y };
  };

  /* ---------------- HIT TEST ---------------- */
  hitTest = (p) => {
    const threshold = 6;

    for (let i = this.lines.length - 1; i >= 0; i--) {
      const line = this.lines[i];
      for (let pt of line.points) {
        const dx = pt.x - p.x;
        const dy = pt.y - p.y;
        if (Math.sqrt(dx * dx + dy * dy) < threshold) {
          return i;
        }
      }
    }
    return null;
  };

  /* ---------------- MOUSE DOWN ---------------- */
  onDown = (e) => {
    const p = this.toChartPoint(e);
    if (!p) return;

    /* ✏️ DRAW MODE */
    if (this.mode === "pen") {
      this.saveUndo();
      this.current = {
        color: this.color,
        width: this.width,
        points: [p],
      };
      return;
    }

    /* 🖱️ SELECT MODE */
    const hit = this.hitTest(p);
    if (hit !== null) {
      this.selectedIndex = hit;
      this.dragging = true;
      this.dragStart = p;
    } else {
      this.selectedIndex = null;
    }
  };

  /* ---------------- MOUSE MOVE ---------------- */
  onMove = (e) => {
    const p = this.toChartPoint(e);
    if (!p) return;

    if (this.current) {
      this.current.points.push(p);
      return;
    }

    if (this.dragging && this.selectedIndex != null) {
      const dx = p.x - this.dragStart.x;
      const dy = p.y - this.dragStart.y;

      const line = this.lines[this.selectedIndex];
      line.points.forEach(pt => {
        pt.x += dx;
        pt.y += dy;
      });

      this.dragStart = p;
    }
  };

  /* ---------------- MOUSE UP ---------------- */
  onUp = () => {
    if (this.current) {
      this.lines.push(this.current);
      this.current = null;
    }

    this.dragging = false;
    this.dragStart = null;
  };

  /* ---------------- KEYBOARD ---------------- */
  onKey = (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      this.eraseSelected();
    }

    if (e.ctrlKey && e.key === "z") {
      this.undo();
    }

    if (
      e.ctrlKey &&
      (e.key === "y" || (e.shiftKey && e.key === "Z"))
    ) {
      this.redo();
    }
  };

  /* ---------------- ERASE ---------------- */
  eraseSelected() {
    if (this.selectedIndex == null) return;
    this.saveUndo();
    this.lines.splice(this.selectedIndex, 1);
    this.selectedIndex = null;
  }

  /* ---------------- UNDO / REDO ---------------- */
  saveUndo() {
    this.undoStack.push(
      JSON.parse(JSON.stringify(this.lines))
    );
    this.redoStack = [];
  }

  undo() {
    if (!this.undoStack.length) return;
    this.redoStack.push(
      JSON.parse(JSON.stringify(this.lines))
    );
    this.lines = this.undoStack.pop();
  }

  redo() {
    if (!this.redoStack.length) return;
    this.undoStack.push(
      JSON.parse(JSON.stringify(this.lines))
    );
    this.lines = this.redoStack.pop();
  }

  /* ---------------- CLEAR ---------------- */
  clear() {
    this.saveUndo();
    this.lines = [];
  }

  /* ---------------- DRAW ---------------- */
  draw(ctx) {
    const panel = this.e.renderer.pricePanel;
    if (!panel) return;

    ctx.save();

    ctx.beginPath();
    ctx.rect(
      this.e.padding.left,
      panel.top - 200,
      this.e.canvas.clientWidth -
        this.e.padding.left -
        this.e.padding.right,
      panel.height + 400
    );
    ctx.clip();

    [...this.lines, this.current].forEach((line, i) => {
      if (!line) return;

      ctx.strokeStyle =
        i === this.selectedIndex
          ? "#facc15" // 🔥 selected = yellow
          : line.color;

      ctx.lineWidth = line.width;
      ctx.beginPath();

      line.points.forEach((p, idx) => {
        const sx =
          this.e.padding.left +
          p.x * this.e.zoomX +
          this.e.offsetX;

        const sy =
          panel.top + p.y + this.e.offsetY;

        idx ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
      });

      ctx.stroke();
    });

    ctx.restore();
  }
}
