import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3S_a_bXI-0Vr4miOPR0WwYjKLQBsqbII",
  authDomain: "foodieloverz.firebaseapp.com",
  projectId: "foodieloverz",
  storageBucket: "foodieloverz.firebasestorage.app",
  messagingSenderId: "399925289486",
  appId: "1:399925289486:web:4fbf988fe27b019b50925f",
  measurementId: "G-WNDHVSSS33"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
