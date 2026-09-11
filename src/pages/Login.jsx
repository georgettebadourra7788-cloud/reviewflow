import { useState } from "react";
import { loginClinic } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginClinic(email, password);
    } catch (err) {
      setError("Couldn't sign in — check your email and password.");
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-7 max-w-sm w-full border border-slate-100 shadow-xl shadow-slate-200/60">
        <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold mb-4">+</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">ReviewFlow</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to your clinic dashboard</p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-600"
            required
          />
        </div>

        {error && <p className="text-xs text-red-600 mt-3">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full h-12 rounded-xl bg-brand-600 text-white text-sm font-semibold"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
