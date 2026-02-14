// src/components/scanner/ConditionBuilder.jsx

export default function ConditionBuilder({
  logic,
  setLogic,
  conditions,
  addCondition,
  updateCondition,
  removeCondition,
  FIELDS,
  OPERATORS
}) {
  return (
    <div
      className="mt-6 border border-white/10 rounded-2xl p-5"
      style={{ background: "var(--card)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm opacity-80">
          Stock passes all of the below conditions
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setLogic("AND")}
            className={`px-3 py-1 rounded-lg text-xs ${
              logic === "AND"
                ? "bg-cyan-600 text-white"
                : "border border-white/10"
            }`}
          >
            AND
          </button>

          <button
            onClick={() => setLogic("OR")}
            className={`px-3 py-1 rounded-lg text-xs ${
              logic === "OR"
                ? "bg-cyan-600 text-white"
                : "border border-white/10"
            }`}
          >
            OR
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {conditions.map((c, i) => (
          <div
            key={i}
            className="flex gap-3 items-center border border-white/10 rounded-xl p-3"
            style={{ background: "var(--bg)" }}
          >
            <select
              value={c.field}
              onChange={(e) => updateCondition(i, "field", e.target.value)}
              className="border border-white/20 rounded px-2 py-1 text-sm"
              style={{ background: "var(--bg)" }}
            >
              {FIELDS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>

            <select
              value={c.operator}
              onChange={(e) => updateCondition(i, "operator", e.target.value)}
              className="border border-white/20 rounded px-2 py-1 text-sm"
              style={{ background: "var(--bg)" }}
            >
              {OPERATORS.map((op) => (
                <option key={op}>{op}</option>
              ))}
            </select>

            <input
              value={c.value}
              onChange={(e) => updateCondition(i, "value", e.target.value)}
              placeholder="Value"
              className="border border-white/20 rounded px-3 py-1 text-sm w-28"
              style={{ background: "var(--bg)" }}
            />

            <button
              onClick={() => removeCondition(i)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addCondition}
        className="mt-4 text-cyan-400 text-sm flex items-center gap-1"
      >
        + Add condition
      </button>
    </div>
  );
}
