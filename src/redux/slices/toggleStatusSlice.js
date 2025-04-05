import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for toggle status for admin
export const toggleStatus = createAsyncThunk(
  "userManagement/toggleStatus",
  async ({ role, credentials }, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      // Determine endpoint based on role
      let endpoint;
      switch (role) {
        case "professor":
          endpoint = "toggle_professor_status";
          break;
        case "admin":
          endpoint = "toggle_admin_status";
          break;
        case "student":
          endpoint = "toggle_student_status";
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

const toggleStatusSlice = createSlice({
  name: "toggleStatus",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(toggleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default toggleStatusSlice.reducer;
