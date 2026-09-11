import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// TODO: replace with your Firebase project config (Project Settings > General > Your apps)
const firebaseConfig = {
  apiKey: "AIzaSyCtmTwP1lypJOObApYIg7s1YrbMqrGM2N0",
  authDomain: "reviewflow-46f68.firebaseapp.com",
  projectId: "reviewflow-46f68",
  storageBucket: "reviewflow-46f68.firebasestorage.app",
  messagingSenderId: "666682604036",
  appId: "1:666682604036:web:ec4e18ddd71a91312d1351",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ---------- Auth ----------
export function loginClinic(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function logoutClinic() {
  return signOut(auth);
}
export function watchAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

// ---------- Visits ----------
function makeToken() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

export async function createVisit({ clinicId, patientName, doctorName, visitType }) {
  const token = makeToken();
  const ref = await addDoc(collection(db, "visits"), {
    clinicId,
    patientName: patientName || "",
    doctorName: doctorName || "",
    visitType: visitType || "Outpatient Consultation",
    token,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, token };
}

export async function getVisitByToken(token) {
  const q = query(collection(db, "visits"), where("token", "==", token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function markVisitCompleted(visitId) {
  await updateDoc(doc(db, "visits", visitId), { status: "completed" });
}

// ---------- Reviews ----------
export async function submitReview({ visitId, clinicId, stars, comment }) {
  const routedPublic = stars >= 4;
  await addDoc(collection(db, "reviews"), {
    visitId,
    clinicId,
    stars,
    comment: comment || "",
    routedPublic,
    createdAt: serverTimestamp(),
  });
  if (visitId) await markVisitCompleted(visitId);
  return { routedPublic };
}

export function watchReviews(clinicId, cb) {
  const q = query(
    collection(db, "reviews"),
    where("clinicId", "==", clinicId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ---------- Clinic ----------
export async function getClinic(clinicId) {
  const snap = await getDoc(doc(db, "clinics", clinicId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
