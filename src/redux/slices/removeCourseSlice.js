import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for remove course by admin
export const removeCourse = createAsyncThunk(
  "courseManagement/removeCourse",
  async (credentials, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.post("delete_course", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const removeCourseSlice = createSlice({
  name: "removeCourse",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(removeCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default removeCourseSlice.reducer;
