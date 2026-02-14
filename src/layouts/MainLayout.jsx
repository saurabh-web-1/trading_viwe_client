// src/layout/MainLayout.jsx

import { Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-extrabold">
            Scanner<span className="text-purple-500">Demo</span>
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex gap-6 text-sm opacity-90">
            <Link to="/" className="hover:opacity-100">Home</Link>
            <Link to="/login" className="hover:opacity-100">Login</Link>
            <Link to="/signup" className="hover:opacity-100">Signup</Link>
          </nav>

          {/* Theme + CTA */}
          <div className="flex items-center gap-4">
            <ThemeSwitcher />

            <Link
              to="/login"
              className="text-sm opacity-90 hover:opacity-100"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
