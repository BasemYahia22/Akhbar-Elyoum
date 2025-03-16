// src/redux/slices/studentHomepageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching student homepage data
export const fetchStudentHomepage = createAsyncThunk(
  "studentHomepage/fetchStudentHomepage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/student_homepage"
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student dashboard data"
      );
    }
  }
);

const studentHomepageSlice = createSlice({
  name: "studentHomepage",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentHomepage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentHomepage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentHomepage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentHomepageSlice.reducer;
