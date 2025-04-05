import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "userManagement/fetchUsers",
  async (role, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      // Determine endpoint based on role
      let endpoint;
      switch (role) {
        case "professor":
          endpoint = "all_professors_info";
          break;
        case "admin":
          endpoint = "all_admins_info";
          break;
        case "student":
          endpoint = "all_students_info";
          break;
        default:
          throw new Error("Unauthorized role");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Fetch users error:", error);
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchUsersSlice = createSlice({
  name: "fetchUsers",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchUsersSlice.reducer;
