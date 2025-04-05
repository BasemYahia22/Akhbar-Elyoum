import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for add and update Courses for admin
export const addAndUpdateCourse = createAsyncThunk(
  "courseManagement/addAndUpdateCourse",
  async ({ operation, credentials }, { getState, rejectWithValue }) => {
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
