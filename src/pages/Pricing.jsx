// src/pages/Pricing.jsx
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";

export default function PricingPage() {
  const { theme } = useTheme();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const buttonHover = { scale: 1.05, transition: { duration: 0.2 } };

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen px-6 py-6 pt-24"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10"
        >
          <div className="flex-1 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold"
            >
              Alltime data Alerts & Dashboards
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="opacity-80"
            >
              Premium Subscription allows 1/2/3 minute scans, charts & alerts,
              enabling you to make informed decisions faster.
            </motion.p>

            <motion.button
              whileHover={buttonHover}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold transition text-white"
            >
              Subscribe Now
            </motion.button>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              {[
                "Markets at all time highs!",
                "Uptrend & Downtrend stocks",
                "Supertrend breakouts",
                "Watchlist movements",
                "RSI overbought",
              ].map((t, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-lg text-sm border border-white/10"
                  style={{ background: "var(--card)" }}
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1"
          >
            <img
              src="https://chartink.com/images/premium-large-screen-dark.png"
              alt="Premium Dashboard"
              className="rounded-3xl shadow-xl"
            />
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mt-16 grid lg:grid-cols-2 gap-8"
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="p-6 rounded-2xl shadow-md border border-white/10"
            style={{ background: "var(--card)" }}
          >
            <h2 className="text-2xl font-semibold mb-4">Premium Benefits</h2>

            <ul className="space-y-3 opacity-80">
              <li>Create alerts every 1/2/3/5/10/15/30 minutes, daily, weekly, monthly</li>
              <li>Realtime data for scans & charts, millions of data points</li>
              <li>Notifications via Desktop/Mobile/SMS/Email</li>
              <li>Customize scan result columns & views</li>
              <li>No coding required!</li>
              <li>Run screeners across multiple watchlists simultaneously</li>
              <li>Auto refresh for scans, charts & dashboards</li>
            </ul>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="p-6 rounded-2xl shadow-md border border-white/10"
            style={{ background: "var(--card)" }}
          >
            <h2 className="text-2xl font-semibold mb-4">Alerts can help you:</h2>

            <ul className="space-y-3 opacity-80">
              <li>Track movements in your watchlist</li>
              <li>Find stocks near strong support/resistance levels</li>
              <li>Track breakouts from 50+ indicators</li>
              <li>Find uptrend/downtrend stocks</li>
              <li>Monitor millions of scans or create custom screeners</li>
            </ul>

            <div className="mt-6 p-4 rounded-lg text-white bg-purple-700">
              <p className="font-semibold">Sapna Uttamchandani</p>
              <p className="text-sm opacity-90">
                The timely scanners provided by Chartink help me set alerts in minutes...
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Plans</h2>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            {/* Monthly */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="p-6 rounded-2xl shadow-md flex-1 border border-white/10"
              style={{ background: "var(--card)" }}
            >
              <h3 className="text-xl font-semibold mb-2">Monthly</h3>
              <p className="opacity-70 mb-4">Flexible monthly plan, pay as you go</p>
              <p className="text-3xl font-bold mb-4">780 ₹</p>

              <motion.button
                whileHover={buttonHover}
                className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 font-semibold transition text-white"
              >
                Subscribe NOW!
              </motion.button>
            </motion.div>

            {/* Yearly */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="p-6 rounded-2xl shadow-md flex-1 border-2 border-purple-600 relative"
              style={{ background: "var(--card)" }}
            >
              <span className="absolute top-3 right-3 px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold">
                Best Value
              </span>

              <h3 className="text-xl font-semibold mb-2">Yearly</h3>
              <p className="opacity-70 mb-4">Save over 10% with yearly plan</p>
              <p className="text-3xl font-bold mb-4">8500 ₹</p>

              <motion.button
                whileHover={buttonHover}
                className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold transition text-white"
              >
                Subscribe NOW!
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mt-16 text-sm text-center opacity-70"
        >
          Doubts? Read our{" "}
          <span className="text-purple-500 hover:underline cursor-pointer">FAQ</span>{" "}
          or{" "}
          <span className="text-purple-500 hover:underline cursor-pointer">Contact us</span>
        </motion.div>
        <Footer />

      </div>
    </>
  );
}
