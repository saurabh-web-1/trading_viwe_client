import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Bell } from "lucide-react";
import Navbar from "../components/Navbar";
import AlertForm from "../components/Alerts/AlertForm";
import Footer from "../components/Footer";


export default function Alerts() {
  const token = localStorage.getItem("token");

  const [alerts, setAlerts] = useState([]);
  const [savedScans, setSavedScans] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  /* ---------------- LOAD ALERTS ---------------- */
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await fetch("https://trading-viwe-server.vercel.app/api/alerts/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAlerts(data || []);
      } catch (e) {
        console.log("ALERT LOAD ERROR", e);
      }
    };

    loadAlerts();
  }, []);

  /* ---------------- LOAD SAVED SCANS ---------------- */
  useEffect(() => {
    const loadScans = async () => {
      try {
        const res = await fetch("https://trading-viwe-server.vercel.app/api/scanner/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSavedScans(data || []);
      } catch (e) {
        console.log("SCAN LOAD ERROR", e);
      }
    };

    loadScans();
  }, []);

  /* ---------------- DELETE ALERT ---------------- */
  const deleteAlert = async (id) => {
    if (!window.confirm("Delete this alert?")) return;

    try {
      await fetch(`https://trading-viwe-server.vercel.app/api/alerts/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Could not delete alert");
    }
  };

  /* ---------------- PAUSE / RESUME ---------------- */
  const togglePause = async (id) => {
    try {
      const res = await fetch(
        `https://trading-viwe-server.vercel.app/api/alerts/toggle/${id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = await res.json();

      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? updated : a))
      );
    } catch {
      alert("Could not toggle alert");
    }
  };

  /* ---------------- FILTERING ---------------- */
  const filteredAlerts = alerts.filter((a) => {
    const matchSearch =
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol?.toLowerCase().includes(search.toLowerCase());

    const status = a.triggered
      ? "Expired"
      : a.paused
      ? "Paused"
      : "Active";

    const matchStatus = statusFilter ? status === statusFilter : true;

    return matchSearch && matchStatus;
  });

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-500/90";
    if (status === "Paused") return "bg-gray-500/80";
    if (status === "Expired") return "bg-red-500/90";
  };

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">ALERTS</h1>
            <p className="text-sm opacity-70">
              Manage all your stock alerts
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
          >
            <Plus size={18} /> Create Alert
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or symbol"
            className="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-[var(--card)]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-white/20 bg-[var(--card)]"
          >
            <option value="">All Status</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Expired</option>
          </select>
        </div>

        {/* Alerts Table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-[var(--card)]">
          <table className="w-full text-sm">
            <thead className="bg-black/20">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th>Symbol</th>
                <th>Condition</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAlerts.map((a) => {
                const status = a.triggered
                  ? "Expired"
                  : a.paused
                  ? "Paused"
                  : "Active";

                return (
                  <tr key={a._id} className="hover:bg-white/10">
                    <td className="px-4 py-3">{a.name}</td>
                    <td className="text-center">{a.symbol}</td>
                    <td className="text-center">
                      {a.field} {a.operator} {a.value}
                    </td>
                    <td className="text-center">{a.interval} min</td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="flex justify-center gap-3 py-3">
                      <Edit size={18} className="opacity-40" />

                      <Trash2
                        size={18}
                        onClick={() => deleteAlert(a._id)}
                        className="cursor-pointer hover:text-red-400"
                      />

                      <Bell
                        size={18}
                        onClick={() => togglePause(a._id)}
                        className={`cursor-pointer ${
                          a.paused
                            ? "text-gray-400"
                            : "text-yellow-400"
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}

              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 opacity-70">
                    No alerts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showModal && (
        <AlertForm
          currentConditions={[]}
          savedScans={savedScans}
          onClose={() => setShowModal(false)}
          onCreate={(a) => setAlerts((prev) => [a, ...prev])}
        />
      )}

      <Footer />

    </div>
  );
}
