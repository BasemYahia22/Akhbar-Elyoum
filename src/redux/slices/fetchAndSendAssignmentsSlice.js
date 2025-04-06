import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching or sending assignment
export const fetchAndSendAssignments = createAsyncThunk(
  "Assignment/fetchAndSendAssignments",
  async ({ type, credentials = null }, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      let response;
      if (type === "GET") {
        // GET request to fetch available courses
        response = await api.get("assignments_page_students");
      } else if (type === "POST") {
        // POST request to register selected courses
        response = await api.post("assignments_page_students", credentials);
      } else {
        throw new Error("Invalid request type");
      }

      return { type, data: response.data }; // Return both the type and data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchAndSendAssignmentsSlice = createSlice({
  name: "Assignment",
  initialState: {
    data: null, // Data from GET request
    submitAssignmentResponse: null, // Data from POST request
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAndSendAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAndSendAssignments.fulfilled, (state, action) => {
        state.loading = false;
        const { type, data } = action.payload;

        if (type === "GET") {
          state.data = data; // Store data from GET request
        } else if (type === "POST") {
          state.submitAssignmentResponse = data; // Store data from POST request
        }
      })
      .addCase(fetchAndSendAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchAndSendAssignmentsSlice.reducer;
