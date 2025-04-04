import { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMoon,
  faBell,
  faBars,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import profileImage from "../assets/profilePhoto.png";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminNotifications,
  fetchProfessorNotifications,
  fetchStudentNotifications,
} from "../redux/slices/fetchNotificationsSlice";

// Responsive navbar with theme toggle and notifications
const Navbar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.role);

  // Fetch notifications based on user role
  useEffect(() => {
    const fetchNotifications = () => {
      switch (userRole) {
        case "Student":
          return dispatch(fetchStudentNotifications());
        case "Professor":
          return dispatch(fetchProfessorNotifications());
        case "Admin":
          return dispatch(fetchAdminNotifications());
        default:
          return null;
      }
    };
    fetchNotifications();
  }, [dispatch, userRole]);

  // Get user info based on role
  const userInfo = useSelector((state) => {
    switch (userRole) {
      case "Student":
        return state.studentHomepage.data;
      case "Professor":
        return state.profDashboard.data?.prof_info;
      case "Admin":
        return state.adminDashboard.data?.admin_info;
      default:
        return null;
    }
  });

  const { data: notifications } = useSelector(
    (state) => state.fetchNotifications
  );
  const unreadCount = notifications
    ? notifications.filter((notification) => notification.IsRead === 0).length
    : 0;

  // Helper functions
  const getNotificationPath = () => {
    switch (userRole) {
      case "Student":
        return "/student/notifications";
      case "Professor":
        return "/professor/notifications";
      case "Admin":
        return "/admin/notifications";
      default:
        return "#";
    }
  };

  const getUserDisplayName = () => {
    if (userRole === "Student") {
      return `${userInfo?.user_info.FirstName} ${userInfo?.user_info.LastName}`;
    } else if (userRole === "Professor") {
      return `${userInfo?.FirstName} ${userInfo?.LastName}`;
    }
    return `${userInfo?.admin_name}`;
  };

  const getUserRoleText = () => {
    if (userRole === "Student") return userInfo?.student_data.AcademicLevel;
    if (userRole === "Professor") return "Professor";
    return "Admin";
  };

  return (
    <div
      className={`lg:w-[calc(100%-250px)] fixed w-full top-0 z-10 flex flex-col items-center justify-between p-4 shadow-md md:flex-row ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
      {/* Main navigation */}
      <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className={`hover:text-gray-900 md:block lg:hidden ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>

        {/* Desktop search */}
        <div className="hidden md:block md:flex-1 md:mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Class, Documents, Activities..."
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

        {/* User controls */}
        <div className="flex items-center md:space-x-6 ">
          {/* Theme toggle */}
          <div className="flex items-center mr-5 space-x-2 md:mr-0">
            <FontAwesomeIcon
              icon={faSun}
              className={`text-lg ${
                isDarkMode ? "text-gray-400" : "text-[#35488B]"
              }`}
            />
            <button
              onClick={toggleDarkMode}
              className="relative w-12 h-6 bg-[#35488B] rounded-full focus:outline-none"
              aria-label={`Toggle ${isDarkMode ? "light" : "dark"} mode`}
            >
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-300 bg-white ${
                  isDarkMode ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
            <FontAwesomeIcon
              icon={faMoon}
              className={`text-lg ${
                isDarkMode ? "text-[#35488B]" : "text-gray-800"
              }`}
            />
          </div>

          {/* Notifications */}
          <Link
            to={getNotificationPath()}
            className={`mr-3 relative hover:text-gray-900 ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
            aria-label="Notifications"
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
              alt="User profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{getUserDisplayName()}</p>
              <p
                className={`text-[16px] font-crimson-text-regular ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {getUserRoleText()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="w-full mt-4 md:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Class, Documents, Activities..."
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
