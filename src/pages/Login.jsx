import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import bgImage from "../assets/1.png";

const Login = () => {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      userType,
      email,
      password,
    };
    console.log("Form Data Submitted:", formData);
    event.target.submit(); // يرسل النموذج إلى الباكند بدون استخدام API
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Side - Background */}
      <div className="hidden bg-center bg-cover lg:flex lg:w-1/2">
        <img src={bgImage} alt="backgroundImage" className="w-full h-screen" />
      </div>
      <div className="bg-[#ADC8E7] lg:hidden md:flex md:w-1/3"></div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center w-full px-6 md:p-8 md:w-2/3 lg:w-1/2">
        <img src={logo} alt="Logo" className="w-32 mb-4 lg:w-40" />

        {/* User Type Selection */}
        <div className="flex mb-4 border rounded-md border-[#003256]">
          <button
            type="button"
            onClick={() => setUserType("student")}
            className={`px-6 lg:px-8 py-2 text-xl rounded-md transition-all ${
              userType === "student"
                ? "bg-[#003256] text-white"
                : "text-blue-950"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setUserType("professor")}
            className={`px-6 lg:px-8 py-2 text-xl rounded-md transition-all ${
              userType === "professor"
                ? "bg-[#003256] text-white"
                : "text-blue-950"
            }`}
          >
            Professor
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
          <div className="mb-4">
            <label className="block text-left">Email Address</label>
            <div className="flex items-center p-2 border border-gray-300 rounded">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-2 text-gray-500"
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-left">Password</label>
            <div className="flex items-center p-2 border border-gray-300 rounded">
              <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 mb-4 text-2xl text-white rounded-md bg-[#003256]"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password */}
        <p>
          Do you forget password?{" "}
          <a href="#" className="text-blue-500">
            forget password
          </a>
        </p>

        {/* Footer */}
        <p className="text-gray-500 md:mt-10">
          ©Akhbar Elyoum Academy 2020-2025
        </p>
      </div>
    </div>
  );
};

export default Login;
