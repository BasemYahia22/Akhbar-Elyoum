import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for add new assignment by professor
export const assignmentOperation = createAsyncThunk(
  "Assignment/assignmentOperation",
  async ({ credentials = null, method }, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      let response;
      if (method === "POST") {
        response = await api.post("add_new_assignment", credentials);
      } else {
        response = await api.get("add_new_assignment");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const assignmentOperationSlice = createSlice({
  name: "assignmentOperation",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignmentOperation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignmentOperation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(assignmentOperation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentOperationSlice.reducer;
