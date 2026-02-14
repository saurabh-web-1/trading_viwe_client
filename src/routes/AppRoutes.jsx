// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Charts from "../pages/ChartPage";
import Dashboard, { ProtectedRoute } from "../pages/Dashboard";
import Pricing from "../pages/Pricing";
import Scanners from "../pages/Scanners";
import Alerts from "../pages/Alerts";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Backtest from "../pages/Backtest";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/backtest" element={<Backtest />} />
        <Route path="/watchlist" element={<Charts />} />


        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scanners"
          element={
            <ProtectedRoute>
              <Scanners />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
