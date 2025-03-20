// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const sendReview = createAsyncThunk(
  "courses/sendReview",
  async (credentials, { getState,rejectWithValue }) => {
    try {
      // Retrieve the token from local storage
      const token = getState().auth.token;
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "submit_review",
        credentials,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Include the token in the Authorization header
          },
        }
      );
      return response.data; // Return the API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "sendReview failed"
      );
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
