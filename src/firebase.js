import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFeRNJn-Mm8lipO6AnjcKgOoQXygdzHaE",
  authDomain: "travel-app-2d78a.firebaseapp.com",
  databaseURL: "https://travel-app-2d78a-default-rtdb.firebaseio.com",
  projectId: "travel-app-2d78a",
  storageBucket: "travel-app-2d78a.firebasestorage.app",
  messagingSenderId: "727966757646",
  appId: "1:727966757646:web:be7ef4be68ac77e65fdd5f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
