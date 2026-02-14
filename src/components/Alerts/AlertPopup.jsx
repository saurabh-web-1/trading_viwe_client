// src/components/Alerts/AlertPopup.jsx

export default function AlertPopup({ alert }) {
  if (!alert) return null;

  return (
    <div className="fixed top-20 right-6 px-4 py-3 rounded-xl bg-green-600/20 border border-green-400 text-sm shadow-xl">
      <b>ALERT TRIGGERED 🚨</b>
      <p>{alert.message}</p>
    </div>
  );
}
