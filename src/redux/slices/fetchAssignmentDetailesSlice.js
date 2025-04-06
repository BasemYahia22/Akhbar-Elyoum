import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching assignment details
export const fetchAssignmentDetailes = createAsyncThunk(
  "Assignment/fetchAssignmentDetailes",
  async (credential, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.post("show_assignments_info", credential);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchAssignmentDetailesSlice = createSlice({
  name: "fetchAssignmentDetailes",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentDetailes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentDetailes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAssignmentDetailes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchAssignmentDetailesSlice.reducer;
