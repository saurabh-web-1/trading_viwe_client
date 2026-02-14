// src/pages/Signin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { authAPI } from "../services/api";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) return alert("Enter email & password");

    try {
      setLoading(true);

      const res = await fetch("https://trading-viwe-server.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.msg || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_logged_in", "true");

      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      alert("Server error");
    }
  };

  return (
    <>
      <Navbar />

      {/* PAGE WRAPPER */}
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* CENTER CONTENT */}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md rounded-2xl p-8 shadow-lg border border-white/10"
            style={{ background: "var(--card)" }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/20 outline-none"
                style={{ background: "var(--bg)" }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/20 outline-none"
                style={{ background: "var(--bg)" }}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition disabled:opacity-70"
              >
                {loading ? "Logging in…" : "Sign In"}
              </motion.button>
            </form>

            <p className="mt-4 text-sm text-center opacity-80">
              Don’t have an account?{" "}
              <span
                className="text-purple-500 cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </motion.div>
        </div>

        {/* FOOTER (NO DELETE, ONLY MOVED) */}
        <Footer />
      </div>
    </>
  );
}
