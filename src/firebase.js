// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgbRYrZa6Wsf89ElbTZbO4QSlEI3f_r9c",
  authDomain: "app-gastos-e2598.firebaseapp.com",
  projectId: "app-gastos-e2598",
  storageBucket: "app-gastos-e2598.firebasestorage.app",
  messagingSenderId: "655404513154",
  appId: "1:655404513154:web:10d7ca0c7f41429cb4019b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA_gbyGfiZvkeWB8wgYiU_3kyHYT3gLEiA",
//   authDomain: "app-gastos-cc.firebaseapp.com",
//   projectId: "app-gastos-cc",
//   storageBucket: "app-gastos-cc.firebasestorage.app",
//   messagingSenderId: "898402653876",
//   appId: "1:898402653876:web:ddd8b187894d1de55aa9e1"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);