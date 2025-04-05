import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for add and update and remove schedule for admin
export const addAndUpdateAndRemoveSchedule = createAsyncThunk(
  "schedulesUpload/addAndUpdateAndRemoveSchedule",
  async ({ operation, credentials }, { rejectWithValue }) => {
    const api = await setupApi();
    let endpoint;
    switch (operation) {
      case "add":
        endpoint = "add_schedule";
        break;
      case "update":
        endpoint = "update_schedule";
        break;
      case "remove":
        endpoint = "remove_schedule";
        break;
      default:
        throw new Error("Unknown operation");
    }
    try {
      const response = await api.post(endpoint, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const addAndUpdateAndRemoveScheduleSlice = createSlice({
  name: "addAndUpdateAndRemoveSchedule",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAndUpdateAndRemoveSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAndUpdateAndRemoveSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addAndUpdateAndRemoveSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addAndUpdateAndRemoveScheduleSlice.reducer;
