import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Check if the user is authenticated and has the required role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page if role doesn't match
  }

  return <Outlet />; // Render the child routes if authenticated and authorized
};

export default ProtectedRoute;
