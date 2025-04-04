import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);

  // Show a loading spinner or message while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to unauthorized page if the user's role doesn't match the required role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the child routes if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;