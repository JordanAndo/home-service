import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMrXAknTuw8HnRlIG-x8CAcfnovH7JFaM",
  authDomain: "services-86d95.firebaseapp.com",
  projectId: "services-86d95",
  storageBucket: "services-86d95.appspot.com",
  messagingSenderId: "584602431945",
  appId: "1:584602431945:web:b0ce094c12ffe9f2e5b818",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
