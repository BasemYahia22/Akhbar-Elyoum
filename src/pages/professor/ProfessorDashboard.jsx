import { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ThemeContext } from "../../context/ThemeContext";
import Notifications from "../Notifications";
import { NotificationsProvider } from "../../context/NotificationsContext";
import Dashboard from "./Dashboard";
import Assignment from "./Assignment";
import StudentGrades from "./StudentGrades";
import StudentAssignment from "./StudentAssignment";
const ProfessorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <NotificationsProvider>
        <div className="flex min-h-screen">
          {/* Sidebar (Fixed) */}
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            userRole="professor"
          />

          {/* Main Content */}
          <div className="flex flex-col flex-1 min-h-screen lg:ml-[255px]">
            <Navbar toggleSidebar={toggleSidebar} userRole="professor" />

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
                    path="/notifications"
                    element={<Notifications isDarkMode={isDarkMode} />}
                  />
                  <Route
                    path="/grades"
                    element={<StudentGrades isDarkMode={isDarkMode} />}
                  />
                  <Route
                    path="/assignments"
                    element={<Assignment isDarkMode={isDarkMode} />}
                  />
                  <Route
                    path="/student-assignment"
                    element={<StudentAssignment isDarkMode={isDarkMode} />}
                  />
                </Routes>
              </main>
              {/* Footer (Scrollable) */}
              <Footer />
            </div>
          </div>
        </div>
      </NotificationsProvider>
    </div>
  );
};

export default ProfessorDashboard;
