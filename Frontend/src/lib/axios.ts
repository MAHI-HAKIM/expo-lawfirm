import axios from "axios";

const PRODUCTION_API_URL =
  "https://avukatlik-backend-app-excga4a9g5d4crad.westeurope-01.azurewebsites.net";
const LOCAL_API_URL = "http://localhost:8000";

// Determine if we're in production based on environment variable
const isProduction = process.env.NODE_ENV === "production";

const axiosInstance = axios.create({
  baseURL: isProduction ? PRODUCTION_API_URL : LOCAL_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for client-side token handling
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Utility function to get current API URL
export const getCurrentApiUrl = () =>
  isProduction ? PRODUCTION_API_URL : LOCAL_API_URL;
