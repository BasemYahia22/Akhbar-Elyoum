import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching student grades
export const fetchStudentGrades = createAsyncThunk(
  "studentGrades/fetchStudentGrades",
  async (role, {rejectWithValue }) => {
    const api = await setupApi();
    try {
      let endpoint;
      // Determine endpoint based on role
      switch (role) {
        case "Professor":
          endpoint = "student_grades_page_from_prof";
          break;
        case "Admin":
          endpoint = "student_grades_page_from_admin";
          break;
        default:
          throw new Error("Unauthorized role");
      }
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchStudentGradesSlice = createSlice({
  name: "fetchStudentGrades",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchStudentGradesSlice.reducer;
