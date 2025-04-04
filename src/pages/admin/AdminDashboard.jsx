import { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ThemeContext } from "../../context/ThemeContext";
import Notifications from "../Notifications";
import Dashboard from "./Dashboard";
import CourseManagement from "./CourseManagement";
import ScheduleUpload from "./ScheduleUpload";
import ProfessorManagement from "./ProfessorManagement";
import StudentManagement from "./StudentManagement";
import AdminManagement from "./AdminManagement";
import ShowStudentGrades from "../professor/ShowStudentGrades";
import StudentGrades from "../professor/StudentGrades";
import UserDetailsPage from "./UserDetailsPage"; // Import the new UserDetailsPage
import NotFound from "../NotFound";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar (Fixed) */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userRole="admin"
        />

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-h-screen lg:ml-[255px]">
          <Navbar toggleSidebar={toggleSidebar} userRole="admin" />

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
                  path="/course-management"
                  element={<CourseManagement isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/student-management"
                  element={<StudentManagement isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/student-grades"
                  element={<ShowStudentGrades isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/grades/:id"
                  element={<StudentGrades isDarkMode={isDarkMode} />}
                />

                {/* Updated User Detail Routes */}
                <Route
                  path="/:role/:id"
                  element={<UserDetailsPage isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/:role/:id"
                  element={<UserDetailsPage isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/:role/:id"
                  element={<UserDetailsPage isDarkMode={isDarkMode} />}
                />

                <Route
                  path="/professor-management"
                  element={<ProfessorManagement isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/admin-management"
                  element={<AdminManagement isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/schedule-upload"
                  element={<ScheduleUpload isDarkMode={isDarkMode} />}
                />
                <Route
                  path="/notifications"
                  element={<Notifications isDarkMode={isDarkMode} />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {/* Footer (Scrollable) */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
