import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMoon,
  faBell,
  faBars,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import profileImage from "../assets/profilePhoto.png";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
import { NotificationsContext } from "../context/NotificationsContext"; // Import NotificationsContext
import { Link } from "react-router-dom"; // Import Link for navigation

const Navbar = ({ toggleSidebar, userRole }) => {
  // Use ThemeContext to access isDarkMode and toggleDarkMode
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // Use NotificationsContext to access notifications
  const { notifications } = useContext(NotificationsContext);

  // Calculate the number of unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div
      className={`lg:w-[calc(100%-250px)] fixed w-full top-0 z-10 flex flex-col items-center justify-between p-4 shadow-md md:flex-row ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
      {/* First Line: Bars Icon and Icons */}
      <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
        {/* Bars Icon for Tablet and Mobile */}
        <button
          onClick={toggleSidebar}
          className={`hover:text-gray-900 md:block lg:hidden ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>

        {/* Search Bar (Visible on Tablet and PC) */}
        <div className="hidden md:block md:flex-1 md:mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Class, Documents, Activities... "
              className={`px-8 py-2 border rounded-lg focus:outline-none ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "border-primary"
              } lg:w-96 w-60`}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className={`absolute left-3 top-3 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
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
                isDarkMode ? "text-gray-400" : "text-[#35488B]"
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
          <Link
            to={
              userRole === "student"
                ? "/student/notifications"
                : userRole === "professor"
                ? "/professor/notifications"
                : "/admin/notifications"
            }
            className={`relative hover:text-gray-900 ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
          >
            <FontAwesomeIcon icon={faBell} className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p
                className={`text-[16px] font-crimson-text-regular ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {userRole === "student"
                  ? "3rd year"
                  : userRole === "professor"
                  ? "Professor"
                  : "Admin"}
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
            className={`w-full px-8 py-2 border rounded-lg focus:outline-none ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "border-primary"
            }`}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className={`absolute left-3 top-3 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
