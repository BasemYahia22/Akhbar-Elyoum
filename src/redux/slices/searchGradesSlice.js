import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStudentGrades = createAsyncThunk(
  "studentHomepage/fetchStudentGrades",
  async (credentials, { getState,rejectWithValue }) => {
    console.log(credentials);
    try {
      // Retrieve the token from the persisted auth state
      const token = getState().auth.token;
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "search_for_grades",
        credentials,
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
        error.response?.data?.message || "Failed to fetch student grades data"
      );
    }
  }
);

const searchGradesSlice = createSlice({
  name: "fetchStudentGrades",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchGradesSlice.reducer;
