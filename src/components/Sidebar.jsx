import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faBook,
  faTimes,
  faChartBar,
  faCalendarAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const linkStyle =
    "flex items-center p-2 text-white rounded-lg hover:bg-gray-100 hover:text-black";

  return (
    <div
      className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 p-4 text-white shadow-lg bg-primary transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Close Button for Tablet and Mobile */}
      <button
        onClick={toggleSidebar}
        className="absolute text-white top-4 right-4 lg:hidden"
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
            <Link to="/student/drop-semester" className={linkStyle}>
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Drop Semester
            </Link>
          </li>
          <li>
            <Link to="/student/result" className={linkStyle}>
              <FontAwesomeIcon icon={faChartBar} className="mr-2" />
              Result
            </Link>
          </li>
          <li>
            <Link to="/student/schedule" className={linkStyle}>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Schedule
            </Link>
          </li>
          <li>
            <Link to="/logout" className={linkStyle}>
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Log Out
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
