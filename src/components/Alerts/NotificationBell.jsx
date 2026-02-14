// src/components/Alerts/NotificationBell.jsx
import { Bell } from "lucide-react";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button onClick={onClick} className="relative">
      <Bell size={18} />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded">
          {count}
        </span>
      )}
    </button>
  );
}
