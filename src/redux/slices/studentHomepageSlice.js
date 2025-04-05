import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for fetching student homepage data
export const fetchStudentHomepage = createAsyncThunk(
  "studentHomepage/fetchStudentHomepage",
  async (_, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      const response = await api.get("student_homepage");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
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
      })
      // Handle rehydration from redux-persist
      .addCase("persist/REHYDRATE", (state, action) => {
        if (action.payload?.studentHomepage) {
          return { ...state, ...action.payload.studentHomepage };
        }
      });
  },
});

export default studentHomepageSlice.reducer;
