import { useEffect, useMemo, useState } from "react";
import { watchReviews, logoutClinic } from "../firebase";
import LinkGenerator from "../components/LinkGenerator";

export default function Dashboard({ user, clinicId }) {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState(0); // 0 = all
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (!clinicId) return;
    const unsub = watchReviews(clinicId, setReviews);
    return unsub;
  }, [clinicId]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const filtered = filter ? reviews.filter((r) => r.stars === filter) : reviews;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">+</div>
          <span className="font-semibold text-slate-900">ReviewFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">{user?.email}</span>
          <button
            onClick={logoutClinic}
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Patient Reviews</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {reviews.length} review{reviews.length === 1 ? "" : "s"} &middot; avg{" "}
              <span className="font-semibold text-amber-500">★ {avg || "—"}</span>
            </p>
          </div>
          <button
            onClick={() => setShowGenerator(true)}
            className="h-11 px-5 rounded-xl bg-brand-600 text-white text-sm font-semibold"
          >
            + New review link
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          {[0, 5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              onClick={() => setFilter(n)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                filter === n
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {n === 0 ? "All" : `${n}★`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">
              No reviews yet — generate a link and send it to a patient.
            </p>
          )}
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-amber-500 font-semibold text-sm">
                  {"★".repeat(r.stars)}
                  <span className="text-slate-200">{"★".repeat(5 - r.stars)}</span>
                </span>
                {r.routedPublic && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    Routed public
                  </span>
                )}
              </div>
              {r.comment && <p className="text-sm text-slate-700">{r.comment}</p>}
            </div>
          ))}
        </div>
      </main>

      {showGenerator && (
        <LinkGenerator clinicId={clinicId} onClose={() => setShowGenerator(false)} />
      )}
    </div>
  );
}
