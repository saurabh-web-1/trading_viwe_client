// src/components/scanner/BacktestResults.jsx

import React from "react";

export default function BacktestResults({ data }) {
  if (!data) return null;

  const { trades = [], totalTrades = 0, totalProfit = 0 } = data;

  return (
    <div
      className="border border-white/10 rounded-2xl p-6 mt-6"
      style={{ background: "var(--card)" }}
    >
      <h2 className="font-semibold mb-4">Backtest Results</h2>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div className="p-3 rounded-lg border border-white/10">
          <b>Total Trades:</b> {totalTrades}
        </div>

        <div className="p-3 rounded-lg border border-white/10">
          <b>Total Profit:</b> ₹{totalProfit.toFixed(2)}
        </div>

        <div className="p-3 rounded-lg border border-white/10">
          <b>Status:</b> {totalProfit >= 0 ? "Profitable 👍" : "Loss ❌"}
        </div>
      </div>

      {/* TRADES TABLE */}
      <table className="w-full text-sm">
        <thead className="border-b border-white/10">
          <tr>
            <th className="text-left py-2">Type</th>
            <th className="text-center">Date</th>
            <th className="text-center">Price</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((t, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="py-2">
                {t.type === "BUY" ? "🟢 BUY" : "🔴 SELL"}
              </td>

              <td className="text-center">
                {new Date(t.date).toLocaleDateString()}
              </td>

              <td className="text-center">₹{t.price}</td>
            </tr>
          ))}

          {!trades.length && (
            <tr>
              <td colSpan={3} className="text-center py-4 opacity-60">
                No trades generated
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
