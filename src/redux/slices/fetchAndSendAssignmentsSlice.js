import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching or sending assignment
export const fetchAndSendAssignments = createAsyncThunk(
  "Assignment/fetchAndSendAssignments",
  async ({ type, credentials = null }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      let response;
      if (type === "GET") {
        // GET request to fetch available courses
        response = await axios.get(
          import.meta.env.VITE_API_URL + "assignments_page_students",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
      } else if (type === "POST") {
        // POST request to register selected courses
        response = await axios.post(
          import.meta.env.VITE_API_URL + "assignments_page_students",
          credentials,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
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
