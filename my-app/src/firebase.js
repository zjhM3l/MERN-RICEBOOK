// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBxXyUKEfUiLT3S4JoVSJWjN64nO-Z6QGY",
  authDomain: "mern-ricebook.firebaseapp.com",
  projectId: "mern-ricebook",
  storageBucket: "mern-ricebook.appspot.com",
  messagingSenderId: "687486044831",
  appId: "1:687486044831:web:019e9a573e4bcd10f7b0aa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
