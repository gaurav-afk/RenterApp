// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiOSfN6OvAFuebLpxq8_4FIc_sPy9_cbw",
  authDomain: "mads4014-proje.firebaseapp.com",
  projectId: "mads4014-proje",
  storageBucket: "mads4014-proje.appspot.com",
  messagingSenderId: "340372671689",
  appId: "1:340372671689:web:7eb14718e5fe52155a1118"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

export {db, auth}