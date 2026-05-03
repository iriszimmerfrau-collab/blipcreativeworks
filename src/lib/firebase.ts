import { initializeApp, type FirebaseOptions } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  setPersistence
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore
} from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions
} from "firebase/functions";
import {
  connectStorageEmulator,
  getStorage
} from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);

if (import.meta.env.VITE_ENABLE_APP_CHECK === "true" && import.meta.env.VITE_FIREBASE_APP_CHECK_RECAPTCHA_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_FIREBASE_APP_CHECK_RECAPTCHA_KEY),
    isTokenAutoRefreshEnabled: true
  });
}

export const auth = getAuth(app);
void setPersistence(auth, browserLocalPersistence).catch(() => undefined);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, import.meta.env.VITE_FUNCTION_REGION || "us-central1");
export const googleProvider = new GoogleAuthProvider();

declare global {
  interface Window {
    __BLIP_EMULATORS_CONNECTED__?: boolean;
  }
}

if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true" && !window.__BLIP_EMULATORS_CONNECTED__) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  window.__BLIP_EMULATORS_CONNECTED__ = true;
}
