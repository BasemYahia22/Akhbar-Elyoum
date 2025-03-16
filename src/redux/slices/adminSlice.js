// src/redux/slices/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    fetchAdminStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAdminSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchAdminFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchAdminStart, fetchAdminSuccess, fetchAdminFailure } =
  adminSlice.actions;
export default adminSlice.reducer;
