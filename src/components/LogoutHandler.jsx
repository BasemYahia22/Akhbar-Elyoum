// src/components/LogoutHandler.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fullCleanup } from "../redux/slices/authUtils";


const LogoutHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(fullCleanup()).unwrap();
        navigate("/login", {
          replace: true,
          state: { from: "session_expired" }, // Optional: for tracking
        });
      } catch (error) {
        navigate("/login", {
          replace: true,
          state: { error: "logout_failed" },
        });
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
};

export default LogoutHandler;
