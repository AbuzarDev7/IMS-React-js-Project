
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDRuKEIetXP0lO_UDLPNzZlOrBGkZ4FRlc",
  authDomain: "mui-systwm.firebaseapp.com",
  projectId: "mui-systwm",
  storageBucket: "mui-systwm.firebasestorage.app",
  messagingSenderId: "749226208740",
  appId: "1:749226208740:web:520e379c86c0baa3c96bf1",
  measurementId: "G-72G0LRVS0D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);  