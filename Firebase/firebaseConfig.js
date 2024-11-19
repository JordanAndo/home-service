// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Auth module
import { getFirestore } from "firebase/firestore"; // Import Firestore module if using Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMrXAknTuw8HnRlIG-x8CAcfnovH7JFaM",
  authDomain: "services-86d95.firebaseapp.com",
  projectId: "services-86d95",
  storageBucket: "services-86d95.appspot.com",
  messagingSenderId: "584602431945",
  appId: "1:584602431945:web:b0ce094c12ffe9f2e5b818"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services that you are using (auth and firestore in this case)
export const auth = getAuth(app);  // Export auth for use in authentication
export const db = getFirestore(app); // Export Firestore if using Firestore for database
