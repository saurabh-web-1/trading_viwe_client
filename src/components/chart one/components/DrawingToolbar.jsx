import {
  PenTool,
  MousePointer,
  Trash2,
  X,
  Palette,
  Minus,
  Plus,
} from "lucide-react";

export default function DrawingToolbar({ engine }) {
  if (!engine) return null;

  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-12 flex flex-col gap-3 p-2 border-r border-white/10 z-30"
      style={{
        background: "var(--card)",
        marginTop: "48px",
      }}
    >
      {/* 🎨 COLOR */}
      <label className="flex justify-center cursor-pointer">
        <Palette size={16} className="opacity-70" />
        <input
          type="color"
          onChange={e => (engine.drawing.color = e.target.value)}
          className="absolute opacity-0 w-0 h-0"
        />
      </label>

      {/* 📏 THICKNESS */}
      <div className="flex flex-col items-center gap-1">
        <Minus
          size={14}
          className="cursor-pointer opacity-70 hover:opacity-100"
          onClick={() =>
            (engine.drawing.width = Math.max(1, engine.drawing.width - 1))
          }
        />
        <span className="text-xs opacity-60">
          {engine.drawing.width}
        </span>
        <Plus
          size={14}
          className="cursor-pointer opacity-70 hover:opacity-100"
          onClick={() =>
            (engine.drawing.width = Math.min(6, engine.drawing.width + 1))
          }
        />
      </div>

      {/* ✏️ PEN */}
      <button
        onClick={() => engine.toggleDrawMode()}
        title="Pen"
        className={`p-1 rounded ${
          engine.isDrawingMode
            ? "bg-green-500/20 text-green-400"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        <PenTool size={16} />
      </button>

      {/* 🖱️ SELECT / UNSELECT */}
      <button
        onClick={() => {
          engine.isDrawingMode = false;
          engine.drawing.mode = null;
        }}
        title="Select"
        className="p-1 rounded opacity-70 hover:opacity-100"
      >
        <MousePointer size={16} />
      </button>

      {/* 🧹 CLEAR ALL */}
      <button
        onClick={() => engine.drawing.clear()}
        title="Clear all drawings"
        className="p-1 rounded opacity-70 hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>

      {/* ❌ DELETE SELECTED */}
      <button
        onClick={() => engine.drawing.eraseSelected()}
        title="Delete selected"
        className="p-1 rounded text-red-400 opacity-70 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}
