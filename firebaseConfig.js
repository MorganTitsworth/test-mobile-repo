import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCTrdij3zmZnj-zuUF_grxUnIjiwKlZMqE",
  authDomain: "tattoo-app-80c04.firebaseapp.com",
  projectId: "tattoo-app-80c04",
  storageBucket: "tattoo-app-80c04.firebasestorage.app",
  messagingSenderId: "412691481792",
  appId: "1:412691481792:web:acf28c51c2a80e0d5fd925"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
export {db, auth};