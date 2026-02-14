//src/components/Alerts/CreateFilter.jsx
import { useState } from "react";

export default function CreateFilter({ onClose, onSave }) {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");

  // ⭐ multiple conditions
  const [conditions, setConditions] = useState([
    { field: "Close", operator: ">", value: "" },
  ]);

  const FIELDS = ["Close", "Volume", "RSI", "SMA50", "SMA200"];
  const OPERATORS = [">", "<", ">=", "<="];

  const addCondition = () =>
    setConditions([...conditions, { field: "Close", operator: ">", value: "" }]);

  const update = (i, key, value) => {
    const copy = [...conditions];
    copy[i][key] = value;
    setConditions(copy);
  };

  const remove = (i) =>
    setConditions(conditions.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!name) return alert("Enter filter name");

    try {
      const res = await fetch("https://trading-viwe-server.vercel.app/api/scanner/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          logic: "AND",
          conditions,
        }),
      });

      const data = await res.json();

      onSave?.(data);
      onClose();
    } catch {
      alert("Could not save filter");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[480px] p-5 rounded-2xl border border-white/10 bg-[var(--card)]">
        <h3 className="font-semibold mb-3">Create Filter</h3>

        <input
          placeholder="Filter name"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* CONDITIONS */}
        <div className="space-y-2">
          {conditions.map((c, i) => (
            <div
              key={i}
              className="flex gap-2 items-center border border-white/10 rounded-xl p-2"
            >
              <select
                value={c.field}
                onChange={(e) => update(i, "field", e.target.value)}
                className="px-2 py-1 rounded bg-black/30 border border-white/20 text-sm"
              >
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>

              <select
                value={c.operator}
                onChange={(e) => update(i, "operator", e.target.value)}
                className="px-2 py-1 rounded bg-black/30 border border-white/20 text-sm"
              >
                {OPERATORS.map((op) => (
                  <option key={op}>{op}</option>
                ))}
              </select>

              <input
                value={c.value}
                onChange={(e) => update(i, "value", e.target.value)}
                placeholder="Value"
                className="px-2 py-1 rounded bg-black/30 border border-white/20 text-sm w-24"
              />

              <button
                onClick={() => remove(i)}
                className="text-red-400 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addCondition}
          className="text-cyan-400 text-sm mt-2"
        >
          + Add condition
        </button>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-blue-600"
          >
            Save Filter
          </button>
        </div>
      </div>
    </div>
  );
}
