import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching or posting courses
export const fetchCourses = createAsyncThunk(
  "registerCourses/fetchCourses",
  async ({ type, courseIds = null }, { getState, rejectWithValue }) => {
    console.log(courseIds);
    try {
      const token = getState().auth.token;

      let response;
      if (type === "GET") {
        // GET request to fetch available courses
        response = await axios.get(
          import.meta.env.VITE_API_URL + "student_register_course",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
      } else if (type === "POST") {
        // POST request to register selected courses
        response = await axios.post(
          import.meta.env.VITE_API_URL + "student_register_course",
          { courseIds },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
      } else {
        throw new Error("Invalid request type");
      }

      return { type, data: response.data }; // Return both the type and data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch or register courses"
      );
    }
  }
);

const registerCoursesSlice = createSlice({
  name: "registerCourses",
  initialState: {
    data: null, // Data from GET request
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
        const { type, data } = action.payload;
        if (type === "GET") {
          state.data = data; // Store data from GET request
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerCoursesSlice.reducer;
