import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for toggleCourseStatus for admin
export const toggleCourseStatus = createAsyncThunk(
  "courseManagement/toggleCourseStatus",
  async (credentials, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.post("update_course_status", credentials);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const toggleCourseStatusSlice = createSlice({
  name: "toggleCourseStatus",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleCourseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCourseStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(toggleCourseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default toggleCourseStatusSlice.reducer;
