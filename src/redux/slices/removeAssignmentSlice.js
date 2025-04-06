import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for remove assignment by professor
export const removeAssignment = createAsyncThunk(
  "Assignment/removeAssignment",
  async (credentials, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.post("delete_assignment", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const removeAssignmentSlice = createSlice({
  name: "removeAssignment",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(removeAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default removeAssignmentSlice.reducer;
