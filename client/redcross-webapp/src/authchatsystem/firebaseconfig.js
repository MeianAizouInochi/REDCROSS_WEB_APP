import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBXQM0KE0QZ0VTr1m9-tY1lZnXmJZwvvfE",
    authDomain: "redcross-final.firebaseapp.com",
    projectId: "redcross-final",
    storageBucket: "redcross-final.appspot.com",
    messagingSenderId: "866760905617",
    appId: "1:866760905617:web:2df722685ccf78e89c4030",
    databaseURL:"https://redcross-final-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const firebaselink = initializeApp(firebaseConfig);

export const phoneauth = getAuth(firebaselink);

export const chatRDB = getDatabase(firebaselink);