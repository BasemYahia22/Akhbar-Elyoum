// src/redux/slices/studentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    fetchStudentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchStudentFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchStudentStart, fetchStudentSuccess, fetchStudentFailure } =
  studentSlice.actions;
export default studentSlice.reducer;
