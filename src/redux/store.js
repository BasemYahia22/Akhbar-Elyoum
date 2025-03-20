import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "./slices/authSlice";
import studentHomepageReducer from "./slices/studentHomepageSlice";
import searchGradesReducer from "./slices/searchGradesSlice";
import registerCoursesReducer from "./slices/registerCoursesSlice";
import fetchStudentCoursesReducer from "./slices/fetchStudentCoursesSlice";
import sendReviewReducer from "./slices/sendReviewSlice";
import fetchAndSendAssignmentsReducer from "./slices/fetchAndSendAssignmentsSlice";
import fetchNotificationsReducer from "./slices/fetchNotificationsSlice";

// Configuration for redux-persist
const studentHomepagePersistConfig = {
  key: "studentHomepage",
  storage,
  whitelist: ["data"], // Only persist specific fields
};
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["role", "isAuthenticated", "token"], // Only persist specific fields
};
// Wrap your reducers with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedStudentHomepageReducer = persistReducer(
  studentHomepagePersistConfig,
  studentHomepageReducer
);
// Configure the store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use the persisted reducer for auth
    studentHomepage: persistedStudentHomepageReducer,
    searchGrades: searchGradesReducer,
    registerCourses: registerCoursesReducer,
    fetchStudentCourses: fetchStudentCoursesReducer,
    sendReview: sendReviewReducer,
    fetchAndSendAssignments: fetchAndSendAssignmentsReducer,
    fetchNotifications: fetchNotificationsReducer,
  },
});

// Create the persisted store
export const persistor = persistStore(store);
