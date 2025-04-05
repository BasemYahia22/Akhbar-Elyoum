import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching admin dashboard data
export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetchAdminDashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Retrieve the token from the persisted auth state
      const token = getState().auth.token;

      const response = await axios.get(
        import.meta.env.VITE_API_URL + "admin_homepage",
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

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle rehydration from redux-persist
      .addCase("persist/REHYDRATE", (state, action) => {
        if (action.payload?.adminDashboard) {
          return { ...state, ...action.payload.adminDashboard };
        }
      });
  },
});

export default adminDashboardSlice.reducer;
