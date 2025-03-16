import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../slices/authSlice";
import axios from "axios";

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/login",
      credentials
    );
    console.log(response);
    dispatch(loginSuccess(response.data));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};
