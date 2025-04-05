import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching student courses
export const fetchStudentCourses = createAsyncThunk(
  "studentCourses/fetchStudentCourses",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.get("student_courses");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchStudentCoursesSlice = createSlice({
  name: "fetchStudentCourses",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchStudentCoursesSlice.reducer;
