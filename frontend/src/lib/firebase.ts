import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function requirePublicEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to frontend/.env.local and restart "npm run dev".`
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: requirePublicEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requirePublicEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requirePublicEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requirePublicEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requirePublicEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requirePublicEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, 'NEXT_PUBLIC_FIREBASE_APP_ID'),
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

