// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Firebase client config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDJwG7aB6_Vh4hngViBu52HMbnE_HX9zPU",
  authDomain: "safebank-e3c5b.firebaseapp.com",
  projectId: "safebank-e3c5b",
  storageBucket: "safebank-e3c5b.appspot.com",   
  messagingSenderId: "828194303695",
  appId: "1:828194303695:web:ccb72f9d97302e85b351ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export auth + functions
const auth = getAuth(app);
export { auth, db };