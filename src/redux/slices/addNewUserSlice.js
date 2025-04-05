import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for add new user
export const addNewUser = createAsyncThunk(
  "userManagement/addNewUser",
  async ({ role, credentials }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
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
