// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "./Theme/ThemeSwitcher";
import { logout } from "../utils/auth";
import { useState } from "react";
import { User } from "lucide-react";

import NotificationBell from "./Alerts/NotificationBell";

export default function Navbar({ bellCount = 0 }) {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem("user_logged_in");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold"
          style={{ color: "var(--text)" }}
        >
          Chart<span className="text-purple-500">ink</span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm opacity-90">
          <Link to="/charts" className="hover:opacity-100">Charts</Link>
          <Link to="/scanners" className="hover:opacity-100">Scanners</Link>
          <Link to="/alerts" className="hover:opacity-100">Alerts</Link>
          <Link to="/dashboard" className="hover:opacity-100">Dashboard</Link>
          <Link to="/pricing" className="hover:opacity-100">Pricing</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Bell */}
          <NotificationBell count={bellCount} />

          {/* NOT LOGGED IN */}
          {!loggedIn && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm opacity-90 hover:opacity-100"
              >
                Login
              </button>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white"
              >
                Try Free
              </Link>
            </>
          )}

          {/* LOGGED IN */}
          {loggedIn && (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20"
                style={{ background: "var(--card)" }}
              >
                <User size={16} />
                <span>{user?.name || "User"}</span>
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 shadow-xl"
                  style={{ background: "var(--card)" }}
                >
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
