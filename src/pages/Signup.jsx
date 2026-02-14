// src/pages/Signup.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";


export default function Signup() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password)
      return alert("Fill all fields");

    try {
      setLoading(true);

      const res = await fetch("https://trading-viwe-server.vercel.app/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.msg || "Signup failed");

      // save & redirect
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

      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl p-8 shadow-xl border border-white/10"
          style={{ background: "var(--card)" }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-xl border border-white/20 outline-none"
              style={{ background: "var(--bg)" }}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-xl border border-white/20 outline-none"
              style={{ background: "var(--bg)" }}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-xl border border-white/20 outline-none"
              style={{ background: "var(--bg)" }}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition disabled:opacity-70"
            >
              {loading ? "Creating…" : "Sign Up"}
            </motion.button>
          </form>

          <p className="mt-4 text-sm text-center opacity-80">
            Already have an account?{" "}
            <span
              className="text-purple-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </motion.div>


      </div>
             <Footer />

    </>
  );
}
