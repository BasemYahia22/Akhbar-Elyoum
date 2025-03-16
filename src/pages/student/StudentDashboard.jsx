import { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Dashboard from "./Dashboard";
import Registration from "./Registration";
import MyCourses from "./Courses";
import Footer from "../../components/Footer";
import { ThemeContext } from "../../context/ThemeContext";
import About from "./About";
import Notifications from "../Notifications";
import { NotificationsProvider } from "../../context/NotificationsContext";
import Assignments from "./Assignments";
import NotFound from "../NotFound"; // Import the NotFound component
const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <NotificationsProvider>
      <div className="flex min-h-screen">
        {/* Sidebar (Fixed) */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userRole="student"
        />

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-h-screen lg:ml-[255px]">
          <Navbar toggleSidebar={toggleSidebar} userRole="student" />
          {/* Main Content Wrapper (Scrollable) */}
          <div className="flex flex-col flex-grow overflow-y-auto mt-[136px] md:mt-[76px]">
            <main
              className={`flex-grow p-4 lg:p-8 ${
                isDarkMode
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Routes>
                <Route
                  path="/"
                  element={<Dashboard isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/registration"
                  element={<Registration isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/my-courses"
                  element={<MyCourses isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/assignments"
                  element={<Assignments isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/notifications"
                  element={<Notifications isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/about"
                  element={<About isDarkMode={isDarkMode} />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {/* Footer (Scrollable) */}
            <Footer />
          </div>
        </div>
      </div>
    </NotificationsProvider>
  );
};

export default StudentDashboard;
