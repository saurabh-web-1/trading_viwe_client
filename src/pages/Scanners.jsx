// src/pages/Scanners.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

import MagicFilters from "../components/scanner/MagicFilters";
import ConditionBuilder from "../components/scanner/ConditionBuilder";
import ResultsTable from "../components/scanner/ResultsTable";
import SavedScans from "../components/scanner/SavedScans";
import BacktestResults from "../components/scanner/BacktestResults";

import AlertForm from "../components/Alerts/AlertForm";
import AlertList from "../components/Alerts/AlertList";

import SaveScanModal from "../components/scanner/SaveScanModal";

import { Play, Save, Lock } from "lucide-react";
import Footer from "../components/Footer";


export default function Scanners() {
  const token = localStorage.getItem("token");

  // ---------- BACKTEST ----------
  const [backtest, setBacktest] = useState(null);
  const [btLoading, setBtLoading] = useState(false);

  // ---------- ALERTS ----------
  const [alerts, setAlerts] = useState([]);
  const [showAlertForm, setShowAlertForm] = useState(false);

  // 🔔 bell counter (navbar)
  const [bellCount, setBellCount] = useState(0);

  // ---------- UI ----------
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState([
    "stocks at 52 week high",
    "Inverted hammer",
    "5-min volume > 2x SMA",
    "SMA50 uptrend 20 days",
  ]);

  const [logic, setLogic] = useState("AND");
  const [conditions, setConditions] = useState([
    { field: "Close", operator: ">", value: "100" },
  ]);

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);

  // save popup
  const [showSaveModal, setShowSaveModal] = useState(false);

  const FIELDS = ["Close", "Volume", "RSI", "SMA50", "SMA200"];
  const OPERATORS = [">", "<", ">=", "<=", "crosses above", "crosses below"];

  // ---------- TAGS ----------
  const generateTags = () => {
    if (!query) return;
    setTags([...tags, query]);
    setQuery("");
  };

  // ---------- CONDITIONS ----------
  const addCondition = () =>
    setConditions([
      ...conditions,
      { field: "Close", operator: ">", value: "" },
    ]);

  const updateCondition = (i, key, value) => {
    const copy = [...conditions];
    copy[i][key] = value;
    setConditions(copy);
  };

  const removeCondition = (i) =>
    setConditions(conditions.filter((_, idx) => idx !== i));

  // ---------- SAVE SCAN ----------
  const saveScan = async (scanName) => {
    try {
      await fetch("https://trading-viwe-server.vercel.app/api/scanner/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: scanName,
          logic,
          conditions,
        }),
      });

      setShowSaveModal(false);
      loadSaved();
    } catch {
      alert("Save failed");
    }
  };

  // ---------- LOAD SAVED SCANS ----------
  const loadSaved = async () => {
    try {
      const res = await fetch("https://trading-viwe-server.vercel.app/api/scanner/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSaved(data || []);
    } catch {}
  };

  // ---------- LOAD ALERTS (🔥 NEW – IMPORTANT) ----------
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await fetch("https://trading-viwe-server.vercel.app/api/alerts/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setAlerts(data || []);
        setBellCount((data || []).length);
      } catch (e) {
        console.log("ALERT LOAD ERROR", e);
      }
    };

    if (token) loadAlerts();
  }, []);

  // ---------- RUN SCAN ----------
  const runScan = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://trading-viwe-server.vercel.app/api/scanner/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ logic, conditions }),
      });

      const data = await res.json();
      setStocks(data);
    } finally {
      setLoading(false);
    }
  };

  // ---------- BACKTEST ----------
  const runBacktest = async () => {
    try {
      setBtLoading(true);

      const res = await fetch(
        "https://trading-viwe-server.vercel.app/api/scanner/backtest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logic, conditions }),
        }
      );

      const data = await res.json();
      setBacktest(data);
    } finally {
      setBtLoading(false);
    }
  };

  // ---------- ALERT CREATE ----------
  const createAlert = (a) => {
    setAlerts((prev) => [a, ...prev]);
    setBellCount((c) => c + 1);
    setShowAlertForm(false);
  };

  useEffect(() => {
    if (token) loadSaved();
  }, []);

  return (
    <>
      <Navbar bellCount={bellCount} />

      <div
        className="min-h-screen px-6 py-6 pt-20"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <div className="rounded-xl px-6 py-3 mb-6 text-sm border border-white/10 bg-[var(--card)]">
          New <b>LIVE Alerts</b> now available!
        </div>

        <h1 className="text-xl font-semibold mb-4">STOCK SCREENER</h1>

        <MagicFilters
          query={query}
          setQuery={setQuery}
          tags={tags}
          setTags={setTags}
          onGenerate={generateTags}
        />

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={runScan}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/20 border border-green-500 text-sm"
          >
            <Play size={16} /> Run Scan
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500 text-sm"
          >
            <Save size={16} /> Save Scan
          </button>

          <button
            onClick={runBacktest}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500 text-sm"
          >
            Backtest
          </button>

          <button
            onClick={() => setShowAlertForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600/20 border border-orange-500 text-sm"
          >
            Create Alert
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm">
            <Lock size={16} /> Premium
          </button>
        </div>

        <ConditionBuilder
          logic={logic}
          setLogic={setLogic}
          conditions={conditions}
          addCondition={addCondition}
          updateCondition={updateCondition}
          removeCondition={removeCondition}
          FIELDS={FIELDS}
          OPERATORS={OPERATORS}
        />

        <ResultsTable
          stocks={stocks}
          loading={loading}
          conditions={conditions}
        />

        <BacktestResults data={backtest} />

        <AlertList alerts={alerts} />

        <SavedScans
          saved={saved}
          setLogic={setLogic}
          setConditions={setConditions}
        />

        {showAlertForm && (
          <AlertForm
            savedScans={saved}
            currentConditions={conditions}
            onClose={() => setShowAlertForm(false)}
            onCreate={createAlert}
          />
        )}

        {showSaveModal && (
          <SaveScanModal
            onClose={() => setShowSaveModal(false)}
            onSave={(name) => saveScan(name)}
          />
        )}
        <Footer />

      </div>
    </>
  );
}
