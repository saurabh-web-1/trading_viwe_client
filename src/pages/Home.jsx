// src/pages/Home.jsx

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-500/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Finance analysis tools
          </h1>

          <p className="mt-6 text-lg opacity-80">
            Customizing stock charts, scanners & alerts so you get the insights
            you need to improve your trades.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/scanners">
              <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">
                Scan. Chart. Trade
              </button>
            </Link>

            <Link to="/charts">
              <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10">
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CHARTS */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold">Charts</h2>
          <p className="mt-4 opacity-80">
            Advanced interactive charts with indicators and drawing tools.
          </p>
          <button className="mt-6 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700">
            Explore Charts
          </button>
        </div>

        <video autoPlay loop muted playsInline className="rounded-2xl shadow-lg">
          <source
            src="https://chartink.com/build/assets/charts-hero-8f84db9d.webm"
            type="video/webm"
          />
        </video>
      </section>

      {/* SCANNER */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <video autoPlay loop muted playsInline className="rounded-2xl shadow-lg">
          <source
            src="https://chartink.com/build/assets/scans-hero-3c8527a6.webm"
            type="video/webm"
          />
        </video>

        <div>
          <h2 className="text-3xl font-bold">Scanner</h2>
          <p className="mt-4 opacity-80">
            Powerful scanners to identify breakout and momentum stocks.
          </p>
        </div>
      </section>

      {/* KEYWORDS */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold">Keywords</h2>
          <p className="mt-4 opacity-80">
            Build scanners faster using predefined smart keywords.
          </p>
        </div>

        <img
          src="https://chartink.com/build/assets/landing_page_keywords-ae2c6dd6.webp"
          className="rounded-2xl"
        />
      </section>

      {/* WIDGETS */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <video autoPlay loop muted playsInline className="rounded-2xl shadow-lg">
          <source
            src="https://chartink.com/build/assets/widgets-hero-af42681c.webm"
            type="video/webm"
          />
        </video>

        <div>
          <h2 className="text-3xl font-bold">Widgets</h2>
          <p className="mt-4 opacity-80">
            Embed live market widgets anywhere with ease.
          </p>
        </div>
      </section>

      {/* USER-CENTRIC */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold">User-centric</h2>
          <p className="mt-4 opacity-80">
            Built for traders with speed, clarity and simplicity.
          </p>
        </div>

        <img
          src="https://chartink.com/build/assets/landing_page_user_centric-1c41bd04.webp"
          className="rounded-2xl"
        />
      </section>

      {/* MAGIC FILTERS */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <img
          src="https://chartink.com/build/assets/landing_page_artificial_intelligence-92e4b611.webp"
          className="rounded-2xl"
        />

        <div>
          <h2 className="text-3xl font-bold">Magic Filters</h2>
          <p className="mt-4 opacity-80">
            AI-powered filters to find high-probability trade setups.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Traders Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ background: "var(--card)" }}
          >
            <p className="opacity-80">
              Best stock scanning tool I have ever used.
            </p>
            <p className="mt-4 font-semibold">— Trader A</p>
          </div>

          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ background: "var(--card)" }}
          >
            <p className="opacity-80">
              Saves me hours every trading day.
            </p>
            <p className="mt-4 font-semibold">— Trader B</p>
          </div>

          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ background: "var(--card)" }}
          >
            <p className="opacity-80">
              Clean UI and very powerful scanners.
            </p>
            <p className="mt-4 font-semibold">— Trader C</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
