//src/components/Alerts/CreateGroup.jsx
import { useState } from "react";

export default function CreateGroup({ onClose, onSave }) {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [stocks, setStocks] = useState([]);

  const ALL_STOCKS = [
    "RELIANCE.NS",
    "TCS.NS",
    "HDFCBANK.NS",
    "INFY.NS",
    "SBIN.NS",
  ];

  const toggle = (s) => {
    if (stocks.includes(s))
      setStocks(stocks.filter((x) => x !== s));
    else setStocks([...stocks, s]);
  };

  const save = async () => {
    if (!name) return alert("Enter group name");

    try {
      const res = await fetch("https://trading-viwe-server.vercel.app/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, stocks }),
      });

      const data = await res.json();

      onSave?.(data);
      onClose();
    } catch {
      alert("Could not save group");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[480px] p-5 rounded-2xl border border-white/10 bg-[var(--card)]">
        <h3 className="font-semibold mb-3">Create Group</h3>

        <input
          placeholder="Group name"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <p className="text-sm mb-2 opacity-70">
          Select stocks
        </p>

        <div className="space-y-1">
          {ALL_STOCKS.map((s) => (
            <label
              key={s}
              className="flex gap-2 items-center text-sm border border-white/10 rounded-lg px-3 py-1"
            >
              <input
                type="checkbox"
                checked={stocks.includes(s)}
                onChange={() => toggle(s)}
              />
              {s}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-blue-600"
          >
            Save Group
          </button>
        </div>
      </div>
    </div>
  );
}
