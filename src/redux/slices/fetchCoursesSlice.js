import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching Courses for admin
export const fetchCourses = createAsyncThunk(
  "courseManagement/fetchCourses",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.get("show_course_management_page");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchCoursesSlice = createSlice({
  name: "fetchCourses",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchCoursesSlice.reducer;
