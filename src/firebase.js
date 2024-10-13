// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIufFPfAb7XvwJb8QoO_DNx-iqfrld_Ug",
  authDomain: "expencify-d219e.firebaseapp.com",
  projectId: "expencify-d219e",
  storageBucket: "expencify-d219e.appspot.com",
  messagingSenderId: "874540272135",
  appId: "1:874540272135:web:d4d50354b12561c09378a2",
  measurementId: "G-T5JRXC13P7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const  auth = getAuth(app);
const db = getFirestore(app);
const provider = new  GoogleAuthProvider();

export  { auth, db, provider, doc, setDoc };


