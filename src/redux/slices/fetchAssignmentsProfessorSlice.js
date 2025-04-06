import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching assignments for professor
export const fetchAssignmentsProfessor = createAsyncThunk(
  "Assignment/fetchAssignmentsProfessor",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.get("assignments_page");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchAssignmentsProfessorSlice = createSlice({
  name: "fetchAssignmentsProfessor",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentsProfessor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsProfessor.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAssignmentsProfessor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchAssignmentsProfessorSlice.reducer;
