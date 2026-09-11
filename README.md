# ReviewFlow

Patient review/reputation collection tool for private clinics. Staff generate a
per-visit link (or QR code), the patient rates 1–5 stars with an optional
comment, and 4–5 star reviews are routed toward a public review platform
(e.g. Google) while 1–3 star reviews stay private with the clinic.

## Stack
- React + Vite, Tailwind CSS v4
- Firebase Auth (clinic staff login) + Firestore (visits, reviews, clinics)
- `qrcode.react` for shareable QR codes

## Setup

1. **Create a Firebase project** at https://console.firebase.google.com
   - Enable **Firestore Database** (production mode)
   - Enable **Authentication → Email/Password**
2. Copy your web app config into `src/firebase.js` (replace the `firebaseConfig` placeholder values).
3. Deploy the security rules in `firestore.rules`:
   ```
   npx firebase-tools deploy --only firestore:rules
   ```
   (or paste the file's contents into Firestore → Rules in the console)
4. Create your clinic doc manually in Firestore for now:
   - Collection `clinics`, doc ID `demo-clinic` (matches the placeholder in `src/App.jsx`)
   - Fields: `name` (string), `publicReviewUrl` (string — your Google review link)
5. Create a staff user in Firebase Auth (Authentication → Users → Add user) to sign in to `/dashboard`.

## Run locally
```
npm install
npm run dev
```

## Routes
- `/dashboard` — clinic staff login + review list + link/QR generator
- `/r/:token` — patient-facing rating page (opened from the generated link/QR)

## Deploy
Build with `npm run build`, then deploy the `dist/` folder to Vercel, Firebase
Hosting, or similar — same as the IntakeFlow deployment.

## Known placeholders to fill in before production use
- `clinicId="demo-clinic"` in `src/App.jsx` — replace with a real per-staff
  clinic lookup (e.g. a `clinicStaff/{uid}` doc) once you support multiple clinics.
- `firebaseConfig` in `src/firebase.js`.
- `publicReviewUrl` on the clinic doc, so the 4–5 star flow has somewhere to route to.
