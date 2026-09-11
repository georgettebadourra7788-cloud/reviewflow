import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RatingPage from "./pages/RatingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { watchAuth } from "./firebase";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out

  useEffect(() => watchAuth(setUser), []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/r/:token" element={<RatingPage />} />
        <Route
          path="/dashboard"
          element={
            user === undefined ? (
              <FullScreenLoading />
            ) : user ? (
              // TODO: replace with real clinicId lookup (e.g. from a clinicStaff/{uid} doc)
              <Dashboard user={user} clinicId="demo-clinic" />
            ) : (
              <Login />
            )
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function FullScreenLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-sm text-slate-400">Loading…</p>
    </div>
  );
}
