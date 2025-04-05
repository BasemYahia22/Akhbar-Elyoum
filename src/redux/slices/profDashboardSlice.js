import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching professor dashboard data
export const fetchProfDashboard = createAsyncThunk(
  "profDashboard/fetchProfDashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "prof_homepage",
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

const profDashboardSlice = createSlice({
  name: "profDashboard",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle rehydration from redux-persist
      .addCase("persist/REHYDRATE", (state, action) => {
        if (action.payload?.profDashboard) {
          return { ...state, ...action.payload.profDashboard };
        }
      });
  },
});

export default profDashboardSlice.reducer;
