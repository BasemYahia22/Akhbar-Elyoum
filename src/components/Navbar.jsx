import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMoon,
  faBell,
  faBars,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import profileImage from "../assets/profilePhoto.png";

const Navbar = ({ toggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 bg-white shadow-md md:flex-row">
      {/* First Line: Bars Icon and Icons */}
      <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
        {/* Bars Icon for Tablet and Mobile */}
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-gray-900 md:block lg:hidden"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>

        {/* Search Bar (Visible on Tablet and PC) */}
        <div className="hidden md:block md:flex-1 md:mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Class, Documents, Activities... "
              className="px-8 py-2 border rounded-lg focus:outline-none border-primary lg:w-96 w-60"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute text-gray-500 left-3 top-3"
            />
          </div>
        </div>

        {/* Icons (Dark Mode, Notifications, Profile) */}
        <div className="flex items-center space-x-6">
          {/* Dark/Light Mode Toggle Button */}
          <div className="flex items-center space-x-2">
            {/* Sun Icon */}
            <FontAwesomeIcon
              icon={faSun}
              className={`text-lg ${
                isDarkMode ? "text-gray-800" : "text-[#35488B]"
              }`}
            />

            {/* Toggle Bar */}
            <button
              onClick={toggleDarkMode}
              className="relative w-12 h-6 bg-[#35488B] rounded-full focus:outline-none"
            >
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-300 bg-white ${
                  isDarkMode ? "left-6" : "left-1"
                }`}
              ></div>
            </button>

            {/* Moon Icon */}
            <FontAwesomeIcon
              icon={faMoon}
              className={`text-lg ${
                isDarkMode ? "text-[#35488B]" : "text-gray-800"
              }`}
            />
          </div>

          {/* Notifications */}
          <button className="text-gray-700 hover:text-gray-900">
            <FontAwesomeIcon icon={faBell} className="text-lg" />
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-[16px] text-gray-500 font-crimson-text-regular">
                3rd year
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar (Visible on Mobile) */}
      <div className="w-full mt-4 md:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Class, Documents, Activities... "
            className="w-full px-8 py-2 border rounded-lg focus:outline-none border-primary"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute text-gray-500 left-3 top-3"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
