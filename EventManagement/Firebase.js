// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoTWlk2FSll6zVkRd3UsuIT7tjBQ39dWQ",
  authDomain: "eventmanagement-b1565.firebaseapp.com",
  projectId: "eventmanagement-b1565",
  storageBucket: "eventmanagement-b1565.firebasestorage.app",
  messagingSenderId: "88625779514",
  appId: "1:88625779514:web:efa609f8d72cadf23e3603"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };