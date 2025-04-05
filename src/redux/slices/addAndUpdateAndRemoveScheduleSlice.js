import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for add and update and remove schedule for admin
export const addAndUpdateAndRemoveSchedule = createAsyncThunk(
  "schedulesUpload/addAndUpdateAndRemoveSchedule",
  async ({ operation, credentials }, { getState, rejectWithValue }) => {
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
      const token = getState().auth.token;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        credentials,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
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
