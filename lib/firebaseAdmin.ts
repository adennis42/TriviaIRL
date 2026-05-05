import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let _adminApp: App | null = null;

function getAdminApp(): App {
  if (_adminApp) return _adminApp;
  if (getApps().length > 0) { _adminApp = getApps()[0]; return _adminApp; }

  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials not set. Add FIREBASE_ADMIN_PROJECT_ID, " +
      "FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY to .env.local"
    );
  }

  _adminApp = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return _adminApp;
}

// Lazy exports — only initialized when actually called at runtime
export const getAdminDb   = () => getFirestore(getAdminApp());
export const getAdminAuth = () => getAuth(getAdminApp());

// For backward compat — but only use in server-side code
export { getAdminApp };
