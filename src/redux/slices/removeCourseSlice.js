import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for remove course by admin
export const removeCourse = createAsyncThunk(
  "courseManagement/removeCourse",
  async (credentials, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "delete_course",
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
