import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className="border-t border-white/10 mt-20"
      style={{ background: "var(--card)", color: "var(--text)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold">
            Chart<span className="text-purple-500">ink</span>
          </h2>
          <p className="mt-3 text-sm opacity-70">
            Advanced stock charts, scanners & alerts for smarter trading
            decisions.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <h3 className="font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/charts" className="hover:text-purple-500">Charts</Link></li>
            <li><Link to="/scanners" className="hover:text-purple-500">Scanners</Link></li>
            <li><Link to="/alerts" className="hover:text-purple-500">Alerts</Link></li>
            <li><Link to="/pricing" className="hover:text-purple-500">Pricing</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#" className="hover:text-purple-500">About</a></li>
            <li><a href="#" className="hover:text-purple-500">Blog</a></li>
            <li><a href="#" className="hover:text-purple-500">Careers</a></li>
            <li><a href="#" className="hover:text-purple-500">Contact</a></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h3 className="font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#" className="hover:text-purple-500">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-500">Terms of Service</a></li>
            <li><a href="#" className="hover:text-purple-500">Refund Policy</a></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Chartink-style Trading Platform. All rights reserved.
      </div>
    </footer>
  );
}
