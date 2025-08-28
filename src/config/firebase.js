// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD7XdnGaUAORIK4G5bzAjKhhuUrxJTuRl8",
  authDomain: "bookworm-0.firebaseapp.com",
  projectId: "bookworm-0",
  storageBucket: "bookworm-0.firebasestorage.app",
  messagingSenderId: "687554982507",
  appId: "1:687554982507:web:428527554500b9d46f372e",
  measurementId: "G-PFENZDRL5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;



