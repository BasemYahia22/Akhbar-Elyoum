// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        credentials
      );
      return response.data; // Return the API response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    role: localStorage.getItem("role") || null,
    isAuthenticated:
      localStorage.getItem("isAuthenticated") === "true" || false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("role");
      localStorage.removeItem("isAuthenticated");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.role = action.payload.usertype;
        state.isAuthenticated = true;
        state.loading = false;

        // Save to local storage
        localStorage.setItem("role", action.payload.usertype);
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
