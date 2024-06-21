import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCSs2rWMu56m72YqST_vRhELptUpAa8AwI",
    authDomain: "momentz-dev.firebaseapp.com",
    projectId: "momentz-dev",
    storageBucket: "momentz-dev.appspot.com",
    messagingSenderId: "1057855363124",
    appId: "1:1057855363124:web:ad469e2adbd40363e11261",
    measurementId: "G-D0C86K8ZZ8"
  };
//
// const firebaseConfig = {
//     apiKey: "AIzaSyBHx8iHTl545qG0KsQixm7ynoEsLIbUwPU",
//     authDomain: "momentz-28392.firebaseapp.com",
//     projectId: "momentz-28392",
//     storageBucket: "momentz-28392.appspot.com",
//     messagingSenderId: "122419075015",
//     appId: "1:122419075015:web:1f6b80892e8cec938aebe2",
//     measurementId: "G-X6VREV09HR"
// };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
