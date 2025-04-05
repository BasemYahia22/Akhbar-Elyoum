import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import StudentDashboard from "./pages/student/StudentDashboard";
import Login from "./pages/Login";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutHandler from "./components/LogoutHandler";

function App() {
  return (
    // Wrap the entire app with ThemeProvider
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutHandler />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="Student" />}>
          <Route path="/student/*" element={<StudentDashboard />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="Professor" />}>
          <Route path="/professor/*" element={<ProfessorDashboard />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="Admin" />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
