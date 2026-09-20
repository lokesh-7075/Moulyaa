import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE_URL
});


// =====================
// REQUEST INTERCEPTOR
// =====================

API.interceptors.request.use(

  (req) => {

    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;

  },

  (error) => Promise.reject(error)

);


// =====================
// RESPONSE INTERCEPTOR
// =====================

API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response) {

      const status = error.response.status;

      if (status === 401) {

        console.warn("Session expired. Logging out...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

      }

      if (status === 403) {

        console.warn("Permission denied");

        alert("You don't have permission to perform this action.");

      }

    }

    return Promise.reject(error);

  }

);

export default API;