import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for add new assignment by professor
export const assignmentOperation = createAsyncThunk(
  "Assignment/assignmentOperation",
  async ({ credentials = null, method }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      let response;
      if (method === "POST") {
        response = await axios.post(
          import.meta.env.VITE_API_URL + "add_new_assignment",
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
        response = await axios.get(
          import.meta.env.VITE_API_URL + "add_new_assignment",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
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
