import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyCcHrSL6fNMHd2R4Of-hs3303_ZdAJLL8s",
  authDomain: "ngo-dashboard-ade99.firebaseapp.com",
  projectId: "ngo-dashboard-ade99",
  storageBucket: "ngo-dashboard-ade99.firebasestorage.app",
  messagingSenderId: "160660418360",
  appId: "1:160660418360:web:7a10eafa35a5fcd3359bcd",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); 