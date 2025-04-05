// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "login",
        credentials
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

// Async thunk for token refresh
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "refresh",
        { refresh_token: refreshToken }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Token refresh failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: null,
    refreshToken: null,
    tokenExpiration: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiration = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = {
          email: action.payload.email,
          userId: action.payload.user_id,
        };
        state.role = action.payload.usertype;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.tokenExpiration = Date.now() + action.payload.expires_in * 1000;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Refresh token cases
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.tokenExpiration = Date.now() + action.payload.expires_in * 1000;
        state.loading = false;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        // Optional: automatically logout if refresh fails
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiration = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
