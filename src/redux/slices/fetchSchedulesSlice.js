import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching schedules
export const fetchschedules = createAsyncThunk(
  "schedulesUpload/fetchschedules",
  async (_, {rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.get("get_scheduling_info");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchschedulesSlice = createSlice({
  name: "fetchschedules",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchschedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchschedules.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchschedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchschedulesSlice.reducer;
