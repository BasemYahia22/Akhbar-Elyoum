import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons"; // Added eye icons
import logo from "../assets/logo.png";
import bgImage from "../assets/loginImage.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const Login = () => {
  const [userType, setUserType] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const userTypeStyle =
    "md:px-6 lg:px-8 py-2 text-2xl rounded-md transition-all font-crimson-text-semibold px-2";
  const containerInputStyle =
    "flex items-center p-2 border border-gray-300 rounded";
  const inputStyle = "flex-1 focus:outline-none";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password, usertype: userType };
    try {
      // Dispatch the login action and wait for it to complete
      const resultAction = await dispatch(loginUser(credentials)).unwrap();
      // Redirect based on the role returned from the API
      switch (resultAction.usertype) {
        case "Student":
          navigate("/student");
          break;
        case "Professor":
          navigate("/professor");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Side - Background */}
      <div className="hidden bg-center bg-cover lg:flex lg:w-1/3">
        <img src={bgImage} alt="backgroundImage" className="w-full h-screen" />
      </div>
      <div className="bg-[#ADC8E7] lg:hidden md:flex md:w-1/3"></div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center w-full px-4 md:px-6 md:p-8 md:w-2/3 lg:w-2/3">
        <img src={logo} alt="Logo" className="w-32 my-4 lg:w-40" />

        {error && <p className="mb-4 text-red-500">{error}</p>}

        {/* User Type Selection */}
        <div className="flex mb-4 border rounded-md border-[#003256]">
          <button
            type="button"
            onClick={() => setUserType("Student")}
            className={`${userTypeStyle} ${
              userType === "Student"
                ? "bg-[#003256] text-white"
                : "text-blue-950"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setUserType("Professor")}
            className={`${userTypeStyle} ${
              userType === "Professor"
                ? "bg-[#003256] text-white"
                : "text-blue-950"
            }`}
          >
            Professor
          </button>
          <button
            type="button"
            onClick={() => setUserType("Admin")}
            className={`${userTypeStyle} ${
              userType === "Admin" ? "bg-[#003256] text-white" : "text-blue-950"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <form
          method="POST"
          action="/login"
          onSubmit={handleSubmit}
          className="w-full max-w-72"
        >
          <input type="hidden" name="userType" value={userType} />
          {/* Email Input */}
          <div className="mb-4 text-lg font-crimson-text-semibold">
            <label className="block text-left">Email Address</label>
            <div className={containerInputStyle}>
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-2 text-gray-500"
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4 text-lg font-crimson-text-semibold">
            <label className="block text-left">Password</label>
            <div className={containerInputStyle}>
              <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyle}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-500 focus:outline-none"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mb-4 text-4xl text-white rounded-md bg-[#003256] font-crimson-text-regular"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-[15px] md:text-base">
          Do you forget password?{" "}
          <button
            onClick={() => setIsForgotPasswordModalOpen(true)}
            className="text-blue-500 hover:underline"
          >
            Forgot Password
          </button>
        </p>

        {/* Footer */}
        <p className="text-gray-500 md:mt-10 font-crimson-text-regular">
          ©Akhbar Elyoum Academy 2020-2025
        </p>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Login;
