// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC39GUXpm7odDSjeGlQxjKtgVM3N47Ywnk",
  authDomain: "react-firebase-project-6a373.firebaseapp.com",
  databaseURL: "https://react-firebase-project-6a373-default-rtdb.firebaseio.com",
  projectId: "react-firebase-project-6a373",
  storageBucket: "react-firebase-project-6a373.appspot.com",
  messagingSenderId: "442676985350",
  appId: "1:442676985350:web:d0b8f0cba8ea3a0f934d87",
  measurementId: "G-ZCZB1ZVN10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);