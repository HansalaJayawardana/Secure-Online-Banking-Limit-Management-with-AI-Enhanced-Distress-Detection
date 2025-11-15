// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJwG7aB6_Vh4hngViBu52HMbnE_HX9zPU",
  authDomain: "safebank-e3c5b.firebaseapp.com",
  projectId: "safebank-e3c5b",
  storageBucket: "safebank-e3c5b.firebasestorage.app",
  messagingSenderId: "828194303695",
  appId: "1:828194303695:web:ccb72f9d97302e85b351ba",
  measurementId: "G-1GS8KQ3Z9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export { createUserWithEmailAndPassword, signInWithEmailAndPassword };