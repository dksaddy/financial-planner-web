import axios from "axios";
import { getToken, logout } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Endpoints where a 401 is an expected, form-level error (wrong
// credentials) rather than "your session expired" — these should
// NOT trigger an auto-logout/redirect, just bubble up so the page's
// own catch block can show the right message.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      url.includes(endpoint)
    );

    if (status === 401 && !isAuthEndpoint) {
      logout();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;