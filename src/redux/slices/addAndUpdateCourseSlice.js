import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for add and update Courses for admin
export const addAndUpdateCourse = createAsyncThunk(
  "courseManagement/addAndUpdateCourse",
  async ({ operation, credentials }, { rejectWithValue }) => {
    const api = await setupApi();
    let endpoint;
    switch (operation) {
      case "add":
        endpoint = "add_course_with_professor";
        break;
      case "update":
        endpoint = "update_course";
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

const addAndUpdateCourseSlice = createSlice({
  name: "addAndUpdateCourse",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAndUpdateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAndUpdateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addAndUpdateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addAndUpdateCourseSlice.reducer;
