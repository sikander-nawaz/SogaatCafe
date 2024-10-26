import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBvStEwk6hCte_OxDpa0Sb7Er9WQ6dZTRw",
  authDomain: "soogat-c5e0a.firebaseapp.com",
  projectId: "soogat-c5e0a",
  storageBucket: "soogat-c5e0a.appspot.com",
  messagingSenderId: "5272084624",
  appId: "1:5272084624:web:637355baee6d2292a13815",
  measurementId: "G-ENRW87D28J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);