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

/**
 * Navbar component that displays the navigation bar with user controls
 * @param {Object} props - Component props
 * @param {Function} props.toggleSidebar - Function to toggle sidebar visibility
 * @returns {JSX.Element} - Rendered Navbar component
 */
const Navbar = ({ toggleSidebar }) => {
  // Theme context for dark mode functionality
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();

  // Get user role from Redux store
  const userRole = useSelector((state) => state.auth.role);

  /**
   * Fetches notifications based on user role when component mounts
   */
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

  /**
   * Gets user information based on role from Redux store
   */
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

  // Get notifications from Redux store
  const { data: notifications } = useSelector(
    (state) => state.fetchNotifications
  );

  // Calculate number of unread notifications
  const unreadCount = notifications
    ? notifications.filter((notification) => notification.IsRead === 0).length
    : 0;

  /**
   * Gets the appropriate notification path based on user role
   * @returns {string} - Path to notifications page
   */
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

  /**
   * Gets the user's display name based on role
   * @returns {string} - User's display name
   */
  const getUserDisplayName = () => {
    if (userRole === "Student") {
      return `${userInfo?.user_info.FirstName} ${userInfo?.user_info.LastName}`;
    } else if (userRole === "Professor") {
      return `${userInfo?.FirstName} ${userInfo?.LastName}`;
    }
    return "Admin";
  };

  /**
   * Gets the user's role display text
   * @returns {string} - User's role display text
   */
  const getUserRoleText = () => {
    if (userRole === "Student") {
      return userInfo?.student_data.AcademicLevel;
    } else if (userRole === "Professor") {
      return "Professor";
    }
    return "Admin";
  };

  return (
    <div
      className={`lg:w-[calc(100%-250px)] fixed w-full top-0 z-10 flex flex-col items-center justify-between p-4 shadow-md md:flex-row ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
      {/* Top section containing main navigation elements */}
      <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
        {/* Sidebar toggle button (visible on mobile/tablet) */}
        <button
          onClick={toggleSidebar}
          className={`hover:text-gray-900 md:block lg:hidden ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>

        {/* Search bar (visible on tablet and desktop) */}
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
              aria-label="Search input"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className={`absolute left-3 top-3 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Right side icons and user profile */}
        <div className="flex items-center space-x-6">
          {/* Dark/Light mode toggle */}
          <div className="flex items-center space-x-2">
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

          {/* Notifications icon with badge */}
          <Link
            to={getNotificationPath()}
            className={`relative hover:text-gray-900 ${
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

          {/* User profile section */}
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

      {/* Mobile search bar (visible only on mobile) */}
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
            aria-label="Search input"
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
