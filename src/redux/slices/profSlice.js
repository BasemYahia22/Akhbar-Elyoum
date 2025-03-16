// src/redux/slices/profSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const profSlice = createSlice({
  name: "prof",
  initialState,
  reducers: {
    fetchProfStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchProfFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchProfStart, fetchProfSuccess, fetchProfFailure } =
  profSlice.actions;
export default profSlice.reducer;
