import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for remove assignment by professor
export const removeAssignment = createAsyncThunk(
  "Assignment/removeAssignment",
  async (credentials, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "delete_assignment",
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

const removeAssignmentSlice = createSlice({
  name: "removeAssignment",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(removeAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default removeAssignmentSlice.reducer;
