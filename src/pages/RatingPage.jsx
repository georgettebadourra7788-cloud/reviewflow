import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { getVisitByToken, submitReview, getClinic } from "../firebase";

export default function RatingPage() {
  const { token } = useParams();
  const [loadState, setLoadState] = useState("loading"); // loading | ready | notfound
  const [visit, setVisit] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState("rating"); // rating | positive | critical

  useEffect(() => {
    (async () => {
      const v = await getVisitByToken(token);
      if (!v) {
        setLoadState("notfound");
        return;
      }
      setVisit(v);
      if (v.clinicId) {
        const c = await getClinic(v.clinicId);
        setClinic(c);
      }
      setLoadState("ready");
    })();
  }, [token]);

  async function handleSubmit() {
    if (!stars || submitting) return;
    setSubmitting(true);
    const { routedPublic } = await submitReview({
      visitId: visit.id,
      clinicId: visit.clinicId,
      stars,
      comment,
    });
    setView(routedPublic ? "positive" : "critical");
    setSubmitting(false);
  }

  if (loadState === "loading") {
    return <CenteredMessage>Loading your feedback form…</CenteredMessage>;
  }
  if (loadState === "notfound") {
    return (
      <CenteredMessage>
        This review link isn't valid or has already been used.
      </CenteredMessage>
    );
  }

  const clinicName = clinic?.name || "Your Clinic";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <header className="w-full pt-8 pb-4 px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
            +
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-700">
            {clinicName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Verified Patient Visit</span>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto px-5 flex-1 flex flex-col justify-center pb-6">
        {view === "rating" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/60 rating-bounce">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-center text-slate-900 mb-1">
              How was your visit{visit.doctorName ? ` with ${visit.doctorName}` : ""}?
            </h1>
            <p className="text-sm text-center text-slate-500 mb-6">
              {clinicName} &middot; {visit.visitType}
            </p>

            <StarRating value={stars} onChange={setStars} />

            <div className="mt-6">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-1.5">
                Tell us more
                <span className="text-xs font-normal text-slate-400">Optional</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Was there anything noteworthy about your check-in, treatment, or care?"
                className="w-full min-h-[100px] rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 focus:border-brand-600 focus:ring-4 focus:ring-brand-100 outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!stars || submitting}
              className="mt-5 w-full h-14 rounded-2xl bg-brand-600 disabled:bg-slate-300 text-white font-semibold text-sm transition-colors"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              🔒 Encrypted &amp; confidential feedback
            </p>
          </div>
        )}

        {view === "positive" && (
          <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-xl shadow-slate-200/60 text-center rating-bounce">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
              ✓
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Thank you!</h1>
            <p className="text-sm text-slate-500 mb-6">
              We're so glad you had a great experience. Would you mind sharing this on Google too? It helps other patients find us.
            </p>
            {clinic?.publicReviewUrl ? (
              <a
                href={clinic.publicReviewUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full h-14 leading-[56px] rounded-2xl bg-brand-600 text-white font-semibold text-sm"
              >
                Leave a Google Review
              </a>
            ) : (
              <p className="text-xs text-slate-400">(Public review link not set up yet)</p>
            )}
          </div>
        )}

        {view === "critical" && (
          <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-xl shadow-slate-200/60 text-center rating-bounce">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              ✓
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              Thank you, we've received your feedback
            </h1>
            <p className="text-sm text-slate-500">
              The clinic will follow up with you directly if needed.
            </p>
          </div>
        )}
      </main>

      <footer className="text-center pb-8 px-6">
        <p className="text-xs text-slate-400">
          Your feedback helps us continuously improve our patient standards and clinical care quality.
        </p>
      </footer>
    </div>
  );
}

function CenteredMessage({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <p className="text-sm text-slate-500 text-center">{children}</p>
    </div>
  );
}
