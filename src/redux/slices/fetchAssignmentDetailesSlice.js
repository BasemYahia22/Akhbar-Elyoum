import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching assignment details
export const fetchAssignmentDetailes = createAsyncThunk(
  "Assignment/fetchAssignmentDetailes",
  async (credential, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "show_assignments_info",
        credential,
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

const fetchAssignmentDetailesSlice = createSlice({
  name: "fetchAssignmentDetailes",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentDetailes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentDetailes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAssignmentDetailes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fetchAssignmentDetailesSlice.reducer;
