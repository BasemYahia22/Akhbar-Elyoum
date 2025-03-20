import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching student homepage data
export const fetchStudentHomepage = createAsyncThunk(
  "studentHomepage/fetchStudentHomepage",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Retrieve the token from the persisted auth state
      const token = getState().auth.token;

      const response = await axios.get(
        import.meta.env.VITE_API_URL + "student_homepage",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Include the token in the Authorization header
          },
        }
      );
      return response.data; // Return the API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch student dashboard data"
      );
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
