// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFagtm1RALQ96NKlSr0MXm7a-b_aBf0YA",
  authDomain: "parking-ed26b.firebaseapp.com",
  projectId: "parking-ed26b",
  storageBucket: "parking-ed26b.firebasestorage.app",
  messagingSenderId: "181640116147",
  appId: "1:181640116147:web:c03616959a6de671dafdc6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // 🔥 Add this

export default app;
