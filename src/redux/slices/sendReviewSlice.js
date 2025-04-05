// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for send review
export const sendReview = createAsyncThunk(
  "courses/sendReview",
  async (credentials, { getState, rejectWithValue }) => {
    const api = await setupApi();
    try {
      // Retrieve the token from local storage
      const state = getState();
      const userRole = state.auth.role;
      if (!userRole) {
        throw new Error("User role not available");
      }
      // Validate and normalize role
      if (!["Student", "Professor"].includes(userRole)) {
        throw new Error(`Invalid user role: ${userRole}`);
      }
      // Determine endpoint based on role
      const endpoint =
        userRole === "Student" ? "submit_review" : "submit_review_for_prof";

      const response = await api.post(endpoint, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const sendReviewSlice = createSlice({
  name: "sendReview",
  initialState: {
    message: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendReview.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(sendReview.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default sendReviewSlice.reducer;
