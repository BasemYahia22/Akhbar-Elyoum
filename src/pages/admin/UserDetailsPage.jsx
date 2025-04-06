import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faIdCard,
  faVenusMars,
  faUniversity,
  faGraduationCap,
  faChartLine,
  faCalendarAlt,
  faUsers,
  faCog,
  faClock,
  faLayerGroup,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/fetchUsersSlice";
import StatusMessage from "../../components/StatusMessage";

const UserDetailsPage = () => {
  // Get role and id from URL params
  const { role, id } = useParams();
  const { data, loading, error } = useSelector((state) => state.fetchUsers);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  // Fetch users data when component mounts or role changes
  useEffect(() => {
    dispatch(fetchUsers(role));
  }, [dispatch, role]);

  // Find specific user when data loads
  useEffect(() => {
    if (data) {
      let usersArray = [];
      if (role === "student") usersArray = data.students || [];
      else if (role === "professor") usersArray = data.professors || [];
      else if (role === "admin") usersArray = data.admins || [];

      const foundUser = usersArray.find((u) => {
        if (role === "student") return u.student_id === parseInt(id);
        if (role === "professor") return u.professor_id === parseInt(id);
        if (role === "admin") return u.admin_id === parseInt(id);
        return false;
      });

      setUser(foundUser || null);
    }
  }, [data, role, id]);

  // Show loading/error states if needed
  if (loading || error)
    return <StatusMessage loading={loading} error={error} />;
  if (!user) return <div className="p-8 text-center">User not found</div>;

  // Helper functions to get role-specific data
  const getUserName = () => {
    if (role === "student") return user.student_name;
    if (role === "professor") return user.professor_name;
    if (role === "admin") return user.admin_name;
    return "Unknown";
  };

  const getUserId = () => {
    if (role === "student") return user.student_id;
    if (role === "professor") return user.professor_id;
    if (role === "admin") return user.admin_id;
    return "Unknown";
  };

  const getDetails = () => {
    if (role === "student") return user.student_details;
    if (role === "professor") return user.professor_details;
    if (role === "admin") return user.admin_details;
    return {};
  };

  const details = getDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to {role} list
          </button>
        </div>

        {/* Main profile card */}
        <div className="mb-8 overflow-hidden bg-white shadow-md rounded-xl">
          <div className="md:flex">
            {/* Profile picture section */}
            <div className="flex flex-col items-center justify-center p-6 text-white md:w-1/3 bg-gradient-to-br from-blue-500 to-blue-700">
              <div className="flex items-center justify-center w-32 h-32 mb-4 bg-white rounded-full bg-opacity-20">
                <span className="text-4xl font-bold">
                  {getUserName()?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <h2 className="mb-1 text-2xl font-bold">
                {getUserName() || "Unknown"}
              </h2>
              <p className="mt-2 opacity-80">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>

            {/* User details section */}
            <div className="p-6 md:w-2/3">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Basic information column */}
                <div className="space-y-4">
                  <h3 className="pb-2 text-lg font-semibold text-gray-700 border-b">
                    Basic Information
                  </h3>
                  <InfoItem
                    icon={faEnvelope}
                    label="Email"
                    value={user.email || "-"}
                  />
                  <InfoItem
                    icon={faVenusMars}
                    label="Gender"
                    value={
                      user.gender
                        ? user.gender.charAt(0).toUpperCase() +
                          user.gender.slice(1)
                        : "-"
                    }
                  />
                  <InfoItem
                    icon={faIdCard}
                    label={`${role.charAt(0).toUpperCase() + role.slice(1)} ID`}
                    value={getUserId() || "-"}
                  />
                  {role === "student" && (
                    <InfoItem
                      icon={faIdCard}
                      label="Student Code"
                      value={user.std_code || "-"}
                    />
                  )}
                </div>

                {/* Role-specific information column */}
                <div className="space-y-4">
                  <h3 className="pb-2 text-lg font-semibold text-gray-700 border-b">
                    {role === "student"
                      ? "Academic Information"
                      : role === "professor"
                      ? "Professional Information"
                      : "Administrative Information"}
                  </h3>

                  {role === "student" && details && (
                    <>
                      <InfoItem
                        icon={faUniversity}
                        label="Major"
                        value={details.Major || "-"}
                      />
                      <InfoItem
                        icon={faGraduationCap}
                        label="Academic Level"
                        value={details.AcademicLevel || "-"}
                      />
                      <InfoItem
                        icon={faChartLine}
                        label="GPA"
                        value={details.CumulativeGPA || "-"}
                      />
                    </>
                  )}

                  {role === "professor" && details && (
                    <>
                      <InfoItem
                        icon={faUniversity}
                        label="Department"
                        value={details.Department || "-"}
                      />
                      <InfoItem
                        icon={faBook}
                        label="Courses Assigned"
                        value={details.TotalCourses || "0"}
                      />
                    </>
                  )}

                  {role === "admin" && details && (
                    <InfoItem
                      icon={faCog}
                      label="Admin Role"
                      value={details.Role || "-"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional details for students */}
        {role === "student" && (
          <div className="overflow-hidden bg-white shadow-md rounded-xl">
            <div className="p-6">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-700 border-b">
                Additional Details
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InfoItem
                  icon={faUniversity}
                  label="Department"
                  value={details.department || "-"}
                />
                <InfoItem
                  icon={faCalendarAlt}
                  label="Semester"
                  value={
                    details.semester_number
                      ? `Semester ${details.semester_number}`
                      : "-"
                  }
                />
                <InfoItem
                  icon={faUsers}
                  label="Squad"
                  value={
                    details.squad_number ? `Squad ${details.squad_number}` : "-"
                  }
                />
                <InfoItem
                  icon={faLayerGroup}
                  label="Passed Credit Hours"
                  value={details.TotalPassedCreditHours || "0"}
                />
                <InfoItem
                  icon={faClock}
                  label="Registered Credit Hours"
                  value={details.TotalRegisteredCreditHours || "0"}
                />
                <InfoItem
                  icon={faClock}
                  label="Available Hours"
                  value={details.available_hours_registered || "0"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable component for displaying information items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    {icon && (
      <div className="mt-1 mr-3 text-blue-500">
        <FontAwesomeIcon icon={icon} />
      </div>
    )}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default UserDetailsPage;
