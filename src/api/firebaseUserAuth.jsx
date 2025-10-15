import axios from "axios";

// 👇 tumhara Firebase API key
const API_KEY = "AIzaSyBqpYDjh7aL6g6Fu0TWadOAiOZmRVys4zU";

// 🔹 User Signup (Firebase REST API)
export const signupUser = async (email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
  return response.data;
};

// 🔹 User Login (Firebase REST API)
export const loginUser = async (email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
  return response.data;
};
