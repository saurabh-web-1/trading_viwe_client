// src/components/Alerts/AlertList.jsx
export default function AlertList({ alerts = [] }) {
  return (
    <div
      className="border border-white/10 rounded-2xl p-6 mt-6"
      style={{ background: "var(--card)" }}
    >
      <h2 className="font-semibold mb-3">Alerts</h2>

      {!alerts.length && (
        <p className="text-sm opacity-70">
          No alerts yet — create one.
        </p>
      )}

      {alerts.map((a, i) => (
        <div
          key={i}
          className="border border-white/10 rounded-xl px-4 py-2 mb-2"
        >
          <b>{a.name}</b>
          <p className="text-xs opacity-70">
            checking every {a.interval} min
          </p>
        </div>
      ))}
    </div>
  );
}
