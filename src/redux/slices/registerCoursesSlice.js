import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching or posting courses
export const fetchCourses = createAsyncThunk(
  "registerCourses/fetchCourses",
  async ({ type, courseIds = null }, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      let response;
      if (type === "GET") {
        response = await api.get("student_register_course");
      } else if (type === "POST") {
        response = await api.post("student_register_course", courseIds);
      } else {
        throw new Error("Invalid request type");
      }

      return { type, data: response.data };
    } catch (error) {
      // Handle the structured error response
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = errorData.error;

        // Construct detailed error message
        const messages = [];

        if (errorData.already_registered_courses?.length > 0) {
          const courses = errorData.already_registered_courses
            .map((c) => `${c.course_name} (${c.course_id})`)
            .join(", ");
          messages.push(`Already registered: ${courses}`);
        }

        if (errorData.invalid_courses?.length > 0) {
          const courses = errorData.invalid_courses.join(", ");
          messages.push(`Invalid courses: ${courses}`);
        }

        if (errorData.missing_prerequisites?.length > 0) {
          const prereqs = errorData.missing_prerequisites
            .map(
              (p) =>
                `${p.course_name} requires ${p.prerequisite_name} (${p.prerequisite_id})`
            )
            .join(", ");
          messages.push(`Missing prerequisites: ${prereqs}`);
        }

        if (messages.length > 0) {
          errorMessage += ": " + messages.join("; ");
        }

        return rejectWithValue({
          message: errorMessage,
          details: errorData,
        });
      }

      return rejectWithValue({
        message: error.message || "An unknown error occurred",
        details: null,
      });
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
