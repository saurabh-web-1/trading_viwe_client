// src/services/api.js

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.error("❌ VITE_API_URL missing in .env");
}

/* ---------------- CORE FETCH ---------------- */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw data || { message: "API Error" };
  }

  return data;
}

/* ================= AUTH ================= */
export const authAPI = {
  login: (body) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  signup: (body) =>
    apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

/* ================= SCANNER ================= */
export const scannerAPI = {
  run: (body) =>
    apiFetch("/api/scanner/run", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  save: (body) =>
    apiFetch("/api/scanner/save", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  list: () => apiFetch("/api/scanner/list"),

  backtest: (body) =>
    apiFetch("/api/scanner/backtest", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

/* ================= ALERTS ================= */
export const alertsAPI = {
  list: () => apiFetch("/api/alerts/list"),

  create: (body) =>
    apiFetch("/api/alerts/create", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  toggle: (id) =>
    apiFetch(`/api/alerts/toggle/${id}`, {
      method: "PATCH",
    }),

  remove: (id) =>
    apiFetch(`/api/alerts/delete/${id}`, {
      method: "DELETE",
    }),
};

/* ================= STOCK ================= */
export const stockAPI = {
  fetchCandles: (symbol, interval, range) =>
    apiFetch(
      `/api/stock/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`
    ),
};
