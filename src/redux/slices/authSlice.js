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
        credentials,
        { withCredentials: true }
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
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: null,
  },
  reducers: {
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      state.token = null;
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
        state.token = action.payload.token; // Assuming the token is in action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
