import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching professor information
export const fetchProfessorInfo = createAsyncThunk(
  "courseMangement/fetchProfessorInfo",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.get("add_course_with_professor");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const fetchProfessorInfoSlice = createSlice({
  name: "fetchProfessorInfo",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfessorInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfessorInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfessorInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchProfessorInfoSlice.reducer;
