// src/components/scanner/SavedScans.jsx
export default function SavedScans({ saved, setLogic, setConditions }) {
  return (
    <div
      className="border border-white/10 rounded-2xl p-6 mt-6"
      style={{ background: "var(--card)" }}
    >
      <h2 className="font-semibold mb-3">Saved Scans</h2>

      {!saved.length && (
        <p className="text-sm opacity-70">No saved scans yet.</p>
      )}

      <div className="space-y-2">
        {saved.map((s) => (
          <div
            key={s._id}
            className="flex justify-between border border-white/10 rounded-xl px-4 py-2"
          >
            <span className="text-sm">{s.name || "My Scan"}</span>

            <button
              onClick={() => {
                setLogic(s.logic);
                setConditions(s.conditions);
              }}
              className="text-cyan-400 text-sm"
            >
              Load
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
