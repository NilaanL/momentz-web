import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBHx8iHTl545qG0KsQixm7ynoEsLIbUwPU",
    authDomain: "momentz-28392.firebaseapp.com",
    projectId: "momentz-28392",
    storageBucket: "momentz-28392.appspot.com",
    messagingSenderId: "122419075015",
    appId: "1:122419075015:web:1f6b80892e8cec938aebe2",
    measurementId: "G-X6VREV09HR"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
