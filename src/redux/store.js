import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PURGE } from "redux-persist";
import storage from "redux-persist/lib/storage";

// 1. First import primitive/non-dependent reducers
import authReducer from "./slices/authSlice";
import studentHomepageReducer from "./slices/studentHomepageSlice";
import profDashboardReducer from "./slices/profDashboardSlice";
import adminDashboardReducer from "./slices/adminDashboardSlice";

// 2. Configure persistences
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "role",
    "isAuthenticated",
    "token",
    "refreshToken",
    "tokenExpiration",
  ],
};

const studentHomepagePersistConfig = {
  key: "studentHomepage",
  storage,
  whitelist: ["data"],
};

const profDashboardPersistConfig = {
  key: "profDashboard",
  storage,
  whitelist: ["data"],
};

const adminDashboardPersistConfig = {
  key: "adminDashboard",
  storage,
  whitelist: ["data"],
};

// 3. Create persisted reducers first
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedStudentHomepageReducer = persistReducer(studentHomepagePersistConfig, studentHomepageReducer);
const persistedProfDashboardReducer = persistReducer(profDashboardPersistConfig, profDashboardReducer);
const persistedAdminDashboardReducer = persistReducer(adminDashboardPersistConfig, adminDashboardReducer);

// 4. Now import remaining reducers that might depend on the above
const getReducers = async () => {
  const [
    searchGradesReducer,
    registerCoursesReducer,
    fetchStudentCoursesReducer,
    sendReviewReducer,
    fetchAndSendAssignmentsReducer,
    fetchNotificationsReducer,
    fetchAssignmentDetailesReducer,
    assignmentOperationReducer,
    fetchAssignmentsProfessorReducer,
    removeAssignmentReducer,
    updateAssignmentReducer,
    fetchStudentAssignmentsSubmitedReducer,
    updateAssignmentGradeReducer,
    fetchStudentGradesReducer,
    fetchStudentGradesDetailsReducer,
    updateStudentGradesReducer,
    fetchUsersReducer,
    toggleStatusReducer,
    addNewUserReducer,
    updateUserReducer,
    fetchCoursesReducer,
    removeCourseReducer,
    addAndUpdateCourseReducer,
    fetchschedulesReducer,
    addAndUpdateAndRemoveScheduleReducer,
    fetchProfessorInfoReducer
  ] = await Promise.all([
    import("./slices/searchGradesSlice"),
    import("./slices/registerCoursesSlice"),
    import("./slices/fetchStudentCoursesSlice"),
    import("./slices/sendReviewSlice"),
    import("./slices/fetchAndSendAssignmentsSlice"),
    import("./slices/fetchNotificationsSlice"),
    import("./slices/fetchAssignmentDetailesSlice"),
    import("./slices/assignmentOperationSlice"), // Now safely imported
    import("./slices/fetchAssignmentsProfessorSlice"),
    import("./slices/removeAssignmentSlice"),
    import("./slices/updateAssignmentSlice"),
    import("./slices/fetchStudentAssignmentsSubmitedSlice"),
    import("./slices/updateAssignmentGradeSlice"),
    import("./slices/fetchStudentGradesSlice"),
    import("./slices/fetchStudentGradesDetailsSlice"),
    import("./slices/updateStudentGradesSlice"),
    import("./slices/fetchUsersSlice"),
    import("./slices/toggleStatusSlice"),
    import("./slices/addNewUserSlice"),
    import("./slices/updateUserSlice"),
    import("./slices/fetchCoursesSlice"),
    import("./slices/removeCourseSlice"),
    import("./slices/addAndUpdateCourseSlice"),
    import("./slices/fetchSchedulesSlice"),
    import("./slices/addAndUpdateAndRemoveScheduleSlice"),
    import("./slices/fetchProfessorInfoSlice")
  ]);

  return {
    auth: persistedAuthReducer,
    studentHomepage: persistedStudentHomepageReducer,
    profDashboard: persistedProfDashboardReducer,
    adminDashboard: persistedAdminDashboardReducer,
    searchGrades: searchGradesReducer.default,
    registerCourses: registerCoursesReducer.default,
    fetchStudentCourses: fetchStudentCoursesReducer.default,
    sendReview: sendReviewReducer.default,
    fetchAndSendAssignments: fetchAndSendAssignmentsReducer.default,
    fetchNotifications: fetchNotificationsReducer.default,
    fetchAssignmentDetailes: fetchAssignmentDetailesReducer.default,
    assignmentOperation: assignmentOperationReducer.default,
    fetchAssignmentsProfessor: fetchAssignmentsProfessorReducer.default,
    removeAssignment: removeAssignmentReducer.default,
    updateAssignment: updateAssignmentReducer.default,
    fetchStudentAssignmentsSubmited: fetchStudentAssignmentsSubmitedReducer.default,
    updateAssignmentGrade: updateAssignmentGradeReducer.default,
    fetchStudentGrades: fetchStudentGradesReducer.default,
    fetchStudentGradesDetails: fetchStudentGradesDetailsReducer.default,
    updateStudentGrades: updateStudentGradesReducer.default,
    fetchUsers: fetchUsersReducer.default,
    toggleStatus: toggleStatusReducer.default,
    addNewUser: addNewUserReducer.default,
    updateUser: updateUserReducer.default,
    fetchCourses: fetchCoursesReducer.default,
    removeCourse: removeCourseReducer.default,
    addAndUpdateCourse: addAndUpdateCourseReducer.default,
    fetchschedules: fetchschedulesReducer.default,
    addAndUpdateAndRemoveSchedule: addAndUpdateAndRemoveScheduleReducer.default,
    fetchProfessorInfo: fetchProfessorInfoReducer.default
  };
};

// 5. Create store asynchronously
export const createStore = async () => {
  const reducers = await getReducers();
  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [PURGE],
          ignoredActionPaths: ["result"],
        },
      }),
  });
  
  const persistor = persistStore(store);
  return { store, persistor };
};
