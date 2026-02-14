// src/pages/Dashboard.jsx
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";

const isAuthenticated = () =>
  localStorage.getItem("user_logged_in") === "true";

export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("scanners");
  const [scanners, setScanners] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!token) return;

    fetch("https://trading-viwe-server.vercel.app/api/scanner/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setScanners)
      .catch(() => {});

    fetch("https://trading-viwe-server.vercel.app/api/alerts/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setAlerts)
      .catch(() => {});

    // demo watchlist (backend later)
    setWatchlist(["RELIANCE", "TCS", "INFY"]);
  }, []);

  const TAB_CONFIG = {
    scanners: {
      label: "Scanners",
      route: "/scanners",
      buttonText: "+ Create a new scanner",
    },
    alerts: {
      label: "Alerts",
      route: "/alerts",
      buttonText: "+ Create a new alert",
    },
    watchlist: {
      label: "Watchlist",
      route: "/charts",
      buttonText: "+ Create Watchlist",
    },
  };

  const current = TAB_CONFIG[activeTab];

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      <div className="px-6 py-6">
        {/* INFO BANNERS */}
        <div className="max-w-7xl mx-auto mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-sm px-4 py-2 rounded-xl text-white">
            Premium Subscription allows for 1/2/3 minute Scans & Charts in realtime
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-4 py-3 rounded-xl mb-6 text-sm border border-white/10"
          style={{ background: "var(--card)" }}
        >
          Custom indicators allow you to create new indicators using existing ones.
          You can reuse them in scans & widgets.
        </div>

        {/* SEARCH + ACTION */}
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 opacity-60" size={18} />
            <input
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 rounded-xl outline-none text-sm border border-white/20"
              style={{ background: "var(--card)" }}
            />
          </div>

          <button
            onClick={() => navigate(current.route)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500"
          >
            <Plus size={18} /> {current.buttonText}
          </button>
        </div>

        {/* MAIN BOX */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-7xl mx-auto rounded-2xl border border-white/10"
          style={{ background: "var(--card)" }}
        >
          {/* TABS */}
          <div className="flex gap-6 px-6 py-4 border-b border-white/10">
            {Object.entries(TAB_CONFIG).map(([k, t]) => (
              <button
                key={k}
                onClick={() => setActiveTab(k)}
                className={`text-sm font-medium ${
                  activeTab === k
                    ? "text-purple-500 border-b-2 border-purple-500"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[320px]">

            {/* SCANNERS */}
            {activeTab === "scanners" &&
              (scanners.length ? scanners.map((s) => (
                <div
                  key={s._id}
                  onClick={() => navigate("/scanners")}
                  className="cursor-pointer p-4 rounded-xl border border-white/10 hover:border-purple-500 hover:bg-white/5 transition"
                >
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs opacity-70 mt-1">
                    {s.conditions.length} conditions • {s.logic}
                  </p>
                </div>
              )) : <p className="opacity-60">No saved scanners</p>)}

            {/* ALERTS */}
            {activeTab === "alerts" &&
              (alerts.length ? alerts.map((a) => {
                const status = a.triggered
                  ? "Expired"
                  : a.paused
                  ? "Paused"
                  : "Active";

                return (
                  <div
                    key={a._id}
                    onClick={() => navigate("/alerts")}
                    className="cursor-pointer p-4 rounded-xl border border-white/10 hover:border-orange-500 hover:bg-white/5 transition"
                  >
                    <h3 className="font-semibold">{a.name}</h3>
                    <p className="text-xs opacity-70 mt-1">
                      {a.symbol} • {status}
                    </p>
                  </div>
                );
              }) : <p className="opacity-60">No alerts created</p>)}

            {/* WATCHLIST (🔥 FIXED) */}
            {activeTab === "watchlist" &&
              (watchlist.length ? watchlist.map((s, i) => (
                <div
                  key={i}
                  onClick={() =>
                    navigate("/charts", {
                      state: { symbol: `${s}.NS` },
                    })
                  }
                  className="cursor-pointer p-4 rounded-xl border border-white/10 hover:border-cyan-500 hover:bg-white/5 transition"
                >
                  <h3 className="font-semibold">{s}</h3>
                </div>
              )) : <p className="opacity-60">Watchlist empty</p>)}
          </div>
        </motion.div>
      </div>
      <Footer />

    </div>
  );
}
