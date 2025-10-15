import axios from "axios";

const API_KEY = "AIzaSyBqpYDjh7aL6g6Fu0TWadOAiOZmRVys4zU";

export const signupAdmin = async (email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
  return response.data;
};

// 🔹 Login (for existing admin)
export const loginAdmin = async (email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
  return response.data;
};
