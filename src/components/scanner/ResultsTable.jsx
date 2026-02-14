// src/components/scanner/ResultsTable.jsx


import { useNavigate } from "react-router-dom";

export default function ResultsTable({ stocks, loading, conditions }) {
  const navigate = useNavigate();

  return (
    <div
      className="border border-white/10 rounded-2xl p-6 mt-6"
      style={{ background: "var(--card)" }}
    >
      <h2 className="font-semibold mb-3">
        {loading ? "Running scan…" : "STOCKS"}
      </h2>

      <table className="w-full text-sm">
        <thead className="border-b border-white/10 opacity-80">
          <tr>
            <th className="text-left py-2">Symbol</th>
            <th className="text-center">Open</th>
            <th className="text-center">Close</th>
            <th className="text-center">Price</th>

          </tr>
        </thead>

        <tbody>
          {stocks.map((s) => (
            <tr
              key={s.symbol}
              onClick={() =>
                navigate("/charts", {
                  state: { symbol: s.symbol, conditions , highlight: true}
                  
                })
              }
              className="cursor-pointer hover:bg-white/10"
            >
              <td className="py-3 font-medium">{s.symbol}</td>

                <td className="text-center">
                ₹{Number(s.open).toFixed(2)}
               </td>

             <td className="text-center">
                 ₹{Number(s.close).toFixed(2)}
               </td>

                <td className="text-center font-semibold text-cyan-400">
                   ₹{Number(s.price).toFixed(2)}
                 </td>

            </tr>
          ))}

          {!stocks.length && !loading && (
            <tr>
              <td colSpan={2} className="text-center py-4 opacity-60">
                No results yet — run a scan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
