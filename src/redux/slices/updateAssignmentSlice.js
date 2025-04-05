import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for update assignment by professor
export const updateAssignment = createAsyncThunk(
  "Assignment/updateAssignment",
  async (credentials, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.post("update_assignment", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const updateAssignmentSlice = createSlice({
  name: "updateAssignment",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default updateAssignmentSlice.reducer;
