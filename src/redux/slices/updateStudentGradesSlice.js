import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for update student grade by professor
export const updateStudentGrades = createAsyncThunk(
  "studentGrades/updateStudentGrades",
  async (credentials, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.post("update_student_grades", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const updateStudentGradesSlice = createSlice({
  name: "updateStudentGrades",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateStudentGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateStudentGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default updateStudentGradesSlice.reducer;
