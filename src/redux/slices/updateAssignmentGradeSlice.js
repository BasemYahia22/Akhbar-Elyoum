import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for update assignment grade by professor
export const updateAssignmentGrade = createAsyncThunk(
  "Assignment/updateAssignmentGrade",
  async (credentials, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.post("update_assignment_grade", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const updateAssignmentGradeSlice = createSlice({
  name: "updateAssignmentGrade",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAssignmentGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateAssignmentGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default updateAssignmentGradeSlice.reducer;
