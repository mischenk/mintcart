import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

export const firebaseConfig = {
  apiKey: "AIzaSyC4TDfn4CSzTL3EA-7RtY6VWtnRI6S9-pw",
  authDomain: "mintcart-staging.firebaseapp.com",
  databaseURL: "https://mintcart-staging-default-rtdb.firebaseio.com",
  projectId: "mintcart-staging",
  storageBucket: "mintcart-staging.appspot.com",
  messagingSenderId: "358983806577",
  appId: "1:358983806577:web:df7421c8ee82ee374df5d0",
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
