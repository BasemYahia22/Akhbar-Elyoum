import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import StudentDashboard from "./pages/student/StudentDashboard";
import Login from "./pages/Login";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    // Wrap the entire app with ThemeProvider
    <ThemeProvider>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Student Dashboard Route */}
        <Route path="/student/*" element={<StudentDashboard />} />

        {/* Teacher Dashboard Route (Commented Out) */}
        <Route path="/professor/*" element={<ProfessorDashboard />} />

        {/* Admin Dashboard Route (Commented Out) */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
