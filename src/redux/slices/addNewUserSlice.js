import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import setupApi from "../../api/axios";

// Async thunk for add new user
export const addNewUser = createAsyncThunk(
  "userManagement/addNewUser",
  async ({ role, credentials }, { rejectWithValue }) => {
    const api = await setupApi();
    try {
      // Determine endpoint based on role
      let endpoint;
      switch (role) {
        case "professor":
          endpoint = "add_professor";
          break;
        case "admin":
          endpoint = "add_admin";
          break;
        case "student":
          endpoint = "add_new_student";
          break;
        default:
          throw new Error("Unauthorized role");
      }
      const response = await api.post(endpoint, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const addNewUserSlice = createSlice({
  name: "addNewUser",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addNewUserSlice.reducer;
