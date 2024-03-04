// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { initializeApp } from "firebase/app"
import "firebase/auth"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxq5ufG7jEOnwsZZq4-RmiThfnMfxEy2w",
  authDomain: "transportation-com.firebaseapp.com",
  projectId: "transportation-com",
  storageBucket: "transportation-com.appspot.com",
  messagingSenderId: "1032831331068",
  appId: "1:1032831331068:web:c7808a2ac947c3cd320579",
  measurementId: "G-5X2DGBNMZ1",
}

const app = initializeApp(firebaseConfig)
//const analytics = getAnalytics(app);

const auth = getAuth(app)
const db = getFirestore(app)
export default auth
export { app }
export { db };
