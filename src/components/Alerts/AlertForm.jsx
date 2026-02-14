import { useState, useEffect } from "react";
import CreateFilter from "../Alerts/CreateFilter";
import CreateGroup from "../Alerts/CreateGroup";
import { Monitor, Smartphone } from "lucide-react";

export default function AlertForm({
  currentConditions,
  savedScans,
  onClose,
  onCreate,
}) {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("RELIANCE.NS");

  // 🔹 filters local state
  const [filters, setFilters] = useState(savedScans || []);

  // 🔹 rule display
  const [rule, setRule] = useState(currentConditions?.[0] || {});
  const [selectedFilter, setSelectedFilter] = useState("current");

  // 🔹 target
  const [targetType, setTargetType] = useState("single");
  const [selectedStock, setSelectedStock] = useState("");

  // 🔹 groups
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState("");

  // 🔹 settings
  const [interval, setInterval] = useState("5");
  const [notifyDesktop, setNotifyDesktop] = useState(true);
  const [notifyPhone, setNotifyPhone] = useState(false);

  // popups
  const [openFilterCreate, setOpenFilterCreate] = useState(false);
  const [openGroupCreate, setOpenGroupCreate] = useState(false);

  const STOCK_LIST = [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS",
    "HDFCBANK.NS",
    "SBIN.NS",
  ];

  /* ---------------- LOAD GROUPS ---------------- */
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await fetch("https://trading-viwe-server.vercel.app/api/groups/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setGroups(data || []);
      } catch (e) {
        console.log("GROUP LOAD ERROR", e);
      }
    };
    loadGroups();
  }, []);

  /* ---------------- FILTER CHANGE ---------------- */
  useEffect(() => {
    if (selectedFilter === "current") {
      setRule(currentConditions?.[0] || {});
      return;
    }

    const f = filters.find((x) => x._id === selectedFilter);
    if (f?.conditions?.length) setRule(f.conditions[0]);
  }, [selectedFilter, filters]);

  /* ---------------- RESET GROUP SAFELY ---------------- */
  useEffect(() => {
    if (targetType !== "group") {
      setGroup("");
    }
  }, [targetType]);

  /* ---------------- CREATE ALERT ---------------- */
  const create = async () => {
    try {
      // 🔐 FINAL SYMBOL RESOLUTION (MOST IMPORTANT FIX)
      let finalSymbol = symbol;

      if (targetType === "single") {
        finalSymbol = selectedStock || symbol;
      }

      if (!finalSymbol) {
        alert("Symbol missing");
        return;
      }

      if (!rule?.field || !rule?.operator || !rule?.value) {
        alert("Invalid rule");
        return;
      }

      const payload = {
        name,
        symbol: finalSymbol,
        field: rule.field,
        operator: rule.operator,
        value: rule.value,
        targetType,
        interval: Number(interval),
        notifyDesktop,
        notifyPhone,
      };

      // ✅ send group only when valid
      if (targetType === "group" && group) {
        payload.group = group;
      }

      const res = await fetch("https://trading-viwe-server.vercel.app/api/alerts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("ALERT CREATE FAILED:", data);
        alert("Create alert failed");
        return;
      }

      onCreate(data);
      onClose();
    } catch (e) {
      console.log("CREATE ALERT FRONTEND ERROR:", e);
      alert("Could not create alert");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-[460px] rounded-2xl p-5 border border-white/10 bg-[var(--card)]">
        <h2 className="font-semibold mb-3">Create Alert</h2>

        {/* NAME */}
        <input
          placeholder="Alert name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-black/30 border border-white/10"
        />

        {/* FILTER */}
        <h4 className="font-semibold mb-1">Filter</h4>

        <select
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="current">Current Filter</option>
          {filters.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <p
          className="text-blue-400 text-sm mt-1 cursor-pointer"
          onClick={() => setOpenFilterCreate(true)}
        >
          Create Filter
        </p>

        {/* CONDITION */}
        <div className="text-sm border border-white/10 rounded-lg p-3 my-3">
          {rule?.field} {rule?.operator} {rule?.value}
        </div>

        {/* APPLY TO */}
        <h4 className="font-semibold mt-3 mb-1">Apply To</h4>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={targetType === "single"}
              onChange={() => setTargetType("single")}
            />
            Single Stock
          </label>

          {targetType === "single" && (
            <select
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
            >
              <option value="">Select Stock</option>
              {STOCK_LIST.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={targetType === "all"}
              onChange={() => setTargetType("all")}
            />
            All Stocks
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={targetType === "group"}
              onChange={() => setTargetType("group")}
            />
            Group
          </label>

          {targetType === "group" && (
            <>
              <select
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                <option value="">Select Group</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <p
                className="text-blue-400 text-sm mt-1 cursor-pointer"
                onClick={() => setOpenGroupCreate(true)}
              >
                Create Group
              </p>
            </>
          )}
        </div>

        {/* INTERVAL */}
        <h4 className="font-semibold mt-4 mb-1">Check Every</h4>

        <select
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        >
          <option value="1">1 min</option>
          <option value="5">5 min</option>
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="1440">1 day</option>
        </select>

        {/* NOTIFY */}
        <h4 className="font-semibold mt-4 mb-1">Notify On</h4>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifyDesktop}
              onChange={() => setNotifyDesktop((v) => !v)}
            />
            <Monitor size={16} /> Desktop
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifyPhone}
              onChange={() => setNotifyPhone((v) => !v)}
            />
            <Smartphone size={16} /> Phone
          </label>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={create}
            className="px-4 py-2 rounded-xl bg-orange-600/30 border border-orange-500"
          >
            Create Alert
          </button>
        </div>
      </div>

      {openFilterCreate && (
        <CreateFilter
          onClose={() => setOpenFilterCreate(false)}
          onSave={(f) => setFilters((prev) => [f, ...prev])}
        />
      )}

      {openGroupCreate && (
        <CreateGroup
          onClose={() => setOpenGroupCreate(false)}
          onSave={(g) => setGroups((prev) => [g, ...prev])}
        />
      )}
    </div>
  );
}
