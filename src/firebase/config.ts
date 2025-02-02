
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: "hermez-v1",
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "576125515715",
  appId: import.meta.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const firebase = {
  app,
  auth
}