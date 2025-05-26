import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpc0_zjri24ZkrNs6KtIi-7ZpOKcyolZE",
  authDomain: "bioage-5c2c2.firebaseapp.com",
  projectId: "bioage-5c2c2",
  storageBucket: "bioage-5c2c2.firebasestorage.app",
  messagingSenderId: "107323300442",
  appId: "1:107323300442:web:a867e7f92283e8e2495663",
  measurementId: "G-Y4LT4FCM5K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
