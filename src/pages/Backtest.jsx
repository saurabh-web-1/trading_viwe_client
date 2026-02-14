// src/pages/Backtest.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function Backtest() {
  const [symbol, setSymbol] = useState("RELIANCE.NS");

  const [logic, setLogic] = useState("AND");
  const [conditions, setConditions] = useState([
    { field: "Close", operator: ">", value: "1000" },
  ]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runBacktest = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://trading-viwe-server.vercel.app/api/scanner/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, logic, conditions }),
      });

      const data = await res.json();
      setResult(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Backtest failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-24 px-6">
        <h1 className="text-xl mb-4">Backtest Builder</h1>

        {/* SYMBOL */}
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border px-3 py-2 rounded mb-4"
        >
          <option value="RELIANCE.NS">Reliance</option>
          <option value="TCS.NS">TCS</option>
          <option value="SBIN.NS">SBI</option>
          <option value="HDFCBANK.NS">HDFC Bank</option>
        </select>

        {/* RUN BTN */}
        <button
          onClick={runBacktest}
          className="ml-3 px 4 py-2 rounded bg-green-600"
        >
          Run Backtest
        </button>

        {/* RESULTS */}
        {loading && <p className="mt-4">Running...</p>}

        {result && (
          <div className="mt-6 border rounded p-4">
            <p>Total Trades: {result.trades.length}</p>
            <p>Total Profit: ₹{result.totalProfit.toFixed(2)}</p>
            <p>Final Balance: ₹{result.finalBalance.toFixed(2)}</p>
          </div>
        )}
        <Footer />

      </div>
    </>
  );
}
