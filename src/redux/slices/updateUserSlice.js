import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for update user
export const updateUser = createAsyncThunk(
  "userManagement/updateUser",
  async ({ role, credentials }, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      // Determine endpoint based on role
      let endpoint;
      switch (role) {
        case "professor":
          endpoint = "update_professor";
          break;
        case "admin":
          endpoint = "update_admin";
          break;
        case "student":
          endpoint = "update_student";
          break;
        default:
          throw new Error("Unauthorized role");
      }
      const response = await api.post(endpoint, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const updateUserSlice = createSlice({
  name: "updateUser",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default updateUserSlice.reducer;
