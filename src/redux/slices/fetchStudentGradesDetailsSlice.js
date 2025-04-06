import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching student grades details
export const fetchStudentGradesDetails = createAsyncThunk(
  "studentGrades/fetchStudentGradesDetails",
  async ({ role, credentials }, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      let endpoint;
      // Determine endpoint based on role
      switch (role) {
        case "Professor":
          endpoint = "show_more_grades_student";
          break;
        case "Admin":
          endpoint = "show_more_grades_student_from_admin";
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

const fetchStudentGradesDetailsSlice = createSlice({
  name: "fetchStudentGradesDetails",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentGradesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentGradesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentGradesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchStudentGradesDetailsSlice.reducer;
