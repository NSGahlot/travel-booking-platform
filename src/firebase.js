import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBqpYDjh7aL6g6Fu0TWadOAiOZmRVys4zU",
  authDomain: "travel-website-project-27e70.firebaseapp.com",
  databaseURL:
    "https://travel-website-project-27e70-default-rtdb.firebaseio.com",
  projectId: "travel-website-project-27e70",
  storageBucket: "travel-website-project-27e70.firebasestorage.app",
  messagingSenderId: "194717453239",
  appId: "1:194717453239:web:c915f07faf7b10e84a7632",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
