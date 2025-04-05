import React, { useContext, useState } from "react";
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
  faChevronDown,
  faChevronUp,
  faUserGraduate,
  faChalkboardTeacher,
  faUserShield,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  const linkStyle = `text-white flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-black w-full transition-colors duration-200`;
  const dropdownLinkStyle = `text-white flex items-center p-2 pl-6 rounded-lg hover:bg-gray-100 hover:text-black w-full transition-colors duration-200 flex`;
  const iconStyle = "mr-2";
  const handleLogout = () => {
    navigate("/logout");
  };

  const toggleUserManagement = () => {
    setIsUserManagementOpen(!isUserManagementOpen);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 p-4 shadow-lg transition-transform duration-300 ease-in-out ${
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

      {/* Navigation Links - Scrollable Area */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {/* Role-Specific Links */}
          {userRole === "student" && (
            <>
              <li>
                <Link to="/student" className={linkStyle}>
                  <FontAwesomeIcon icon={faHome} className={iconStyle} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/registration" className={linkStyle}>
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className={iconStyle}
                  />
                  Registration for Course
                </Link>
              </li>
              <li>
                <Link to="/student/my-courses" className={linkStyle}>
                  <FontAwesomeIcon icon={faBook} className={iconStyle} />
                  My Courses
                </Link>
              </li>
              <li>
                <Link to="/student/assignments" className={linkStyle}>
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className={iconStyle}
                  />
                  Assignments
                </Link>
              </li>
              <li>
                <Link to="/student/notifications" className={linkStyle}>
                  <FontAwesomeIcon icon={faBell} className={iconStyle} />
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/student/about" className={linkStyle}>
                  <FontAwesomeIcon icon={faInfoCircle} className={iconStyle} />
                  About
                </Link>
              </li>
            </>
          )}

          {userRole === "professor" && (
            <>
              <li>
                <Link to="/professor" className={linkStyle}>
                  <FontAwesomeIcon icon={faHome} className={iconStyle} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/professor/assignments" className={linkStyle}>
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className={iconStyle}
                  />
                  Assignments
                </Link>
              </li>
              <li>
                <Link to="/professor/student-assignment" className={linkStyle}>
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className={iconStyle}
                  />
                  Student Assignment
                </Link>
              </li>
              <li>
                <Link to="/professor/student-grades" className={linkStyle}>
                  <FontAwesomeIcon icon={faChartBar} className={iconStyle} />
                  Student Grades
                </Link>
              </li>
              <li>
                <Link to="/professor/notifications" className={linkStyle}>
                  <FontAwesomeIcon icon={faBell} className={iconStyle} />
                  Notifications
                </Link>
              </li>
            </>
          )}

          {userRole === "admin" && (
            <>
              <li>
                <Link to="/admin" className={linkStyle}>
                  <FontAwesomeIcon icon={faHome} className={iconStyle} />
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex flex-col">
                  <button
                    onClick={toggleUserManagement}
                    className={`${linkStyle} justify-between`}
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUsers} className={iconStyle} />
                      User Management
                    </div>
                    <FontAwesomeIcon
                      icon={isUserManagementOpen ? faChevronUp : faChevronDown}
                      className="text-sm transition-transform duration-200"
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isUserManagementOpen ? "max-h-fit" : "max-h-0"
                    }`}
                  >
                    <div className="mt-1 ml-1 space-y-2">
                      <Link
                        to="/admin/student-management"
                        className={dropdownLinkStyle}
                      >
                        <FontAwesomeIcon
                          icon={faUserGraduate}
                          className={iconStyle}
                        />
                        Student Management
                      </Link>
                      <Link
                        to="/admin/professor-management"
                        className={dropdownLinkStyle}
                      >
                        <FontAwesomeIcon
                          icon={faChalkboardTeacher}
                          className={iconStyle}
                        />
                        Professor Management
                      </Link>
                      <Link
                        to="/admin/admin-management"
                        className={dropdownLinkStyle}
                      >
                        <FontAwesomeIcon
                          icon={faUserShield}
                          className={iconStyle}
                        />
                        Admin Management
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <Link to="/admin/course-management" className={linkStyle}>
                  <FontAwesomeIcon icon={faBook} className={iconStyle} />
                  Course Management
                </Link>
              </li>
              <li>
                <Link to="/admin/student-grades" className={linkStyle}>
                  <FontAwesomeIcon icon={faChartBar} className={iconStyle} />
                  Student Grades
                </Link>
              </li>
              <li>
                <Link to="/admin/schedule-upload" className={linkStyle}>
                  <FontAwesomeIcon icon={faUpload} className={iconStyle} />
                  Schedule Upload
                </Link>
              </li>
              <li>
                <Link to="/admin/notifications" className={linkStyle}>
                  <FontAwesomeIcon icon={faBell} className={iconStyle} />
                  Notifications
                </Link>
              </li>
            </>
          )}

          {/* Common Links for All Roles */}
          <li>
            <button onClick={handleLogout} className={linkStyle}>
              <FontAwesomeIcon icon={faSignOutAlt} className={iconStyle} />
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
