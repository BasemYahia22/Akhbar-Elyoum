import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faBook,
  faTimes,
  faSignOutAlt,
  faInfoCircle,
  faBell,
  faUsers,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Dynamic link styles based on theme
  const linkStyle = `text-white flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black`;
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/"); // Redirect to the login page
  };
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 p-4 shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-primary text-white"
      }`}
    >
      {/* Close Button for Tablet and Mobile */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 right-4 lg:hidden ${
          isDarkMode ? "text-white" : "text-white"
        }`}
      >
        <FontAwesomeIcon icon={faTimes} className="text-lg" />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="space-y-4">
          {/* Role-Specific Links */}
          {userRole === "student" && (
            <>
              <li>
                <Link to="/student" className={linkStyle}>
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/registration" className={linkStyle}>
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                  Registration for Course
                </Link>
              </li>
              <li>
                <Link to="/student/my-courses" className={linkStyle}>
                  <FontAwesomeIcon icon={faBook} className="mr-2" />
                  My Courses
                </Link>
              </li>
              <li>
                <Link to="/student/assignments" className={linkStyle}>
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                  Assignments
                </Link>
              </li>
              <li>
                <Link to="/student/notifications" className={linkStyle}>
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/student/about" className={linkStyle}>
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  About
                </Link>
              </li>
            </>
          )}

          {userRole === "professor" && (
            <>
              <li>
                <Link to="/professor" className={linkStyle}>
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/professor/assignments" className={linkStyle}>
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                  Assignments
                </Link>
              </li>
              <li>
                <Link to="/professor/student-assignment" className={linkStyle}>
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                  Student Assignment
                </Link>
              </li>
              <li>
                <Link to="/professor/student-grades" className={linkStyle}>
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                  Student Grades
                </Link>
              </li>
              <li>
                <Link to="/professor/notifications" className={linkStyle}>
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Notifications
                </Link>
              </li>
            </>
          )}

          {userRole === "admin" && (
            <>
              <li>
                <Link to="/admin" className={linkStyle}>
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/user-management" className={linkStyle}>
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  User Management
                </Link>
              </li>
              <li>
                <Link to="/admin/course-management" className={linkStyle}>
                  <FontAwesomeIcon icon={faBook} className="mr-2" />
                  Course Management
                </Link>
              </li>
              <li>
                <Link to="/admin/ScheduleUpload" className={linkStyle}>
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Schedule Upload
                </Link>
              </li>
              <li>
                <Link to="/admin/notifications" className={linkStyle}>
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Notifications
                </Link>
              </li>
            </>
          )}

          {/* Common Links for All Roles */}
          <li>
            <button onClick={handleLogout} className={linkStyle}>
              <FontAwesomeIcon icon={faSignOutAlt} className={`mr-2`} />
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
