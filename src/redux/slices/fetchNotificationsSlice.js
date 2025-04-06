import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching student notifications
export const fetchStudentNotifications = createAsyncThunk(
  "notifications/fetchStudentNotifications",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      // GET request to fetch student notifications
      const response = await api.get("student_notifications");
      return response.data.notifications; // Return the notifications array
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

// Async thunk for fetching professor notifications
export const fetchProfessorNotifications = createAsyncThunk(
  "notifications/fetchProfessorNotifications",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      // GET request to fetch professor notifications
      const response = await api.get("professor_notifications");
      return response.data.notifications; // Return the notifications array
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

// Async thunk for fetching admin notifications
export const fetchAdminNotifications = createAsyncThunk(
  "notifications/fetchAdminNotifications",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      // GET request to fetch admin notifications
      const response = await api.get("admin_notifications");
      return response.data.notifications; // Return the notifications array
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchNotificationsSlice = createSlice({
  name: "fetchNotifications",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Student notifications
      .addCase(fetchStudentNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Professor notifications
      .addCase(fetchProfessorNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfessorNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfessorNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin notifications
      .addCase(fetchAdminNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchNotificationsSlice.reducer;
