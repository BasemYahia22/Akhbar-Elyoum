import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import studentReducer from "./slices/studentSlice";
import profReducer from "./slices/profSlice";
import adminReducer from "./slices/adminSlice";
import studentHomepageReducer from "./slices/studentHomepageSlice";

// Initialize state from local storage
const preloadedState = {
  auth: {
    role: localStorage.getItem("role") || null,
    isAuthenticated:
      localStorage.getItem("isAuthenticated") === "true" || false,
    loading: false,
    error: null,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentHomepage: studentHomepageReducer,
    student: studentReducer,
    prof: profReducer,
    admin: adminReducer,
  },
  preloadedState,
});
