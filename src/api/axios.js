import axios from "axios";
import { refreshAccessToken } from "../redux/slices/authSlice";
import { fullCleanup } from "../redux/slices/authUtils";
import { createStore } from "../redux/store";

const setupApi = async () => {
  const { store } = await createStore(); // Assuming createStore returns store and persistor

  // Create configured Axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // Optional: Set withCredentials if you need to send cookies
    // withCredentials: true,
  });

  // Request interceptor - runs before every request
  api.interceptors.request.use(
    (config) => {
      const { token } = store.getState().auth;
      // If token exists, add to Authorization header
      if (token) {
        config.headers.Authorization = `${token}`;
      }

      // Important: Return the modified config
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Response interceptor - handles responses and errors
  api.interceptors.response.use(
    (response) => {
      // Simply return the response if successful
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const { tokenExpiration, refreshToken } = store.getState().auth;

      // Only handle 401 errors for expired/invalid tokens
      if (
        error.response?.status === 401 &&
        !originalRequest._retry && // Prevent infinite loops
        refreshToken // Only if we have a refresh token
      ) {
        // Case 1: Token expired (we have expiration time)
        if (tokenExpiration && Date.now() >= tokenExpiration) {
          originalRequest._retry = true; // Mark request as retried
          try {
            // Attempt to refresh the token
            await store.dispatch(refreshAccessToken()).unwrap();

            // Get the new token from the store
            const newToken = store.getState().auth.token;

            // Update the original request with new token
            originalRequest.headers.Authorization = `${newToken}`;

            // Retry the original request
            return api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout the user
            try {
              await store.dispatch(fullCleanup()).unwrap();
              window.location.href = "/login?reason=session_expired";
            } catch (cleanupError) {
              console.error("Cleanup failed:", cleanupError);
              window.location.href = "/login?error=cleanup_failed_axios";
            }
            return Promise.reject(refreshError);
          }
        }
        // Case 2: Token invalid but not expired (possibly corrupted)
        else {
          try {
            await store.dispatch(fullCleanup()).unwrap();
            window.location.href = "/login?reason=session_expired";
          } catch (cleanupError) {
            console.error("Cleanup failed:", cleanupError);
            window.location.href = "/login?error=cleanup_failed";
          }
        }
      }
      // For all other errors, just reject normally
      return Promise.reject(error);
    }
  );

  return api;
};

export default setupApi;
