import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createVisit } from "../firebase";

export default function LinkGenerator({ clinicId, onClose }) {
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [visitType, setVisitType] = useState("Outpatient Consultation");
  const [link, setLink] = useState(null);
  const [creating, setCreating] = useState(false);

  async function handleGenerate() {
    setCreating(true);
    const { token } = await createVisit({ clinicId, patientName, doctorName, visitType });
    const url = `${window.location.origin}/r/${token}`;
    setLink(url);
    setCreating(false);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-5 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
        {!link ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">New review link</h2>
            <div className="space-y-3">
              <Field label="Patient name (optional)" value={patientName} onChange={setPatientName} />
              <Field label="Doctor / provider (optional)" value={doctorName} onChange={setDoctorName} />
              <Field label="Visit type" value={visitType} onChange={setVisitType} />
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={creating}
                className="flex-1 h-11 rounded-xl bg-brand-600 text-white text-sm font-semibold"
              >
                {creating ? "Generating…" : "Generate"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Ready to send</h2>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={link} size={160} fgColor="#0F766E" />
            </div>
            <p className="text-xs text-slate-500 break-all bg-slate-50 rounded-xl p-3 mb-4">
              {link}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(link)}
              className="w-full h-11 rounded-xl bg-brand-600 text-white text-sm font-semibold mb-2"
            >
              Copy link
            </button>
            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-600"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-600"
      />
    </div>
  );
}
