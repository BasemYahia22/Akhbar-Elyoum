import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import StudentDashboard from "./pages/student/StudentDashboard";
import Login from "./pages/Login";

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
        {/* <Route path="/teacher" element={<TeacherDashboard />} /> */}

        {/* Admin Dashboard Route (Commented Out) */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
