import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE_URL
});


// ============================
// REQUEST INTERCEPTOR
// ============================

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;

});


// ============================
// RESPONSE INTERCEPTOR (IMPORTANT FIX)
// ============================

API.interceptors.response.use(

  (response) => response,

  (error) => {

    // If token is invalid / expired
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {

      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }

);

export default API;