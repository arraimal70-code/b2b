import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9Xc1Vkt7HLZ3Qdlp1EaSiPIVDEJi841Q",
  authDomain: "ceremonial-coil-vgtt6.firebaseapp.com",
  projectId: "ceremonial-coil-vgtt6",
  storageBucket: "ceremonial-coil-vgtt6.firebasestorage.app",
  messagingSenderId: "806739238680",
  appId: "1:806739238680:web:878cb212cc5c9228c0886d"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut };
