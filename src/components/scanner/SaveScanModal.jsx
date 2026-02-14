import { useState } from "react";

export default function SaveScanModal({ onClose, onSave }) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[420px] p-5 rounded-2xl border border-white/10 bg-[var(--card)]">
        <h3 className="font-semibold mb-3">Save Scan</h3>

        <input
          placeholder="Enter scan name"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => onSave(name)}
            className="px-4 py-2 rounded-lg bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
