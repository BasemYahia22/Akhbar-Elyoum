import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching student courses
export const fetchStudentCourses = createAsyncThunk(
  "studentCourses/fetchStudentCourses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      // GET request to fetch student courses
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "student_courses",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      return response.data; // Return both the type and data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student courses"
      );
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
