import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching student assignment submited
export const fetchStudentAssignmentsSubmited = createAsyncThunk(
  "studentAssignment/fetchStudentAssignmentsSubmited",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.get("student_assignments_submited");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchStudentAssignmentsSubmitedSlice = createSlice({
  name: "fetchStudentAssignmentsSubmited",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAssignmentsSubmited.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAssignmentsSubmited.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentAssignmentsSubmited.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchStudentAssignmentsSubmitedSlice.reducer;
