import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDAsD1v7ydrl174uXWW9v1D8KD_UbW_tMM",
  authDomain: "neoblood-com.firebaseapp.com",
  projectId: "neoblood-com",
  storageBucket: "neoblood-com.firebasestorage.app",
  messagingSenderId: "309783403147",
  appId: "1:309783403147:web:2130faf4e6bc881935528e",
  measurementId: "G-RH8HSD3N2T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Safe Analytics init for environments that support it
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { analytics };
