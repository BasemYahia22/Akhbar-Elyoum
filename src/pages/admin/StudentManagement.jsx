import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faEyeSlash,
  faSearch,
  faPlus,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserFormModal from "./UserFormModal";
import { fetchUsers } from "../../redux/slices/fetchUsersSlice";
import { toggleStatus } from "../../redux/slices/toggleStatusSlice";
import { addNewUser } from "../../redux/slices/addNewUserSlice";
import { updateUser } from "../../redux/slices/updateUserSlice";
import StatusMessage from "../../components/StatusMessage";
import Message from "../../components/Message";

const StudentManagement = () => {
  // Redux state and dispatch
  const { data, loading, error } = useSelector((state) => state.fetchUsers);
  const dispatch = useDispatch();

  // Component state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Style variables
  const searchInputStyle =
    "max-w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const addButtonStyle =
    "flex items-center px-4 py-2 text-white rounded-lg w-[230px] bg-third md:w-fit";
  const statusStyle = (status) =>
    status === 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const editButtonStyle =
    "px-2 py-1 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600";
  const toggleButtonStyle = (status) =>
    `px-2 py-1 text-white rounded-lg ${
      status === 0
        ? "bg-green-500 hover:bg-green-600"
        : "bg-gray-500 hover:bg-gray-600"
    }`;
  const viewButtonStyle =
    "px-2 py-1 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300";
  const tableHeaderStyle = "p-2 text-left bg-gray-100";
  const tableCellStyle = "p-2";

  // Filter students based on search term
  const students = data?.students || [];
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (student.student_name?.toLowerCase() || "").includes(searchLower) ||
      (student.email?.toLowerCase() || "").includes(searchLower) ||
      (student.std_code?.toLowerCase() || "").includes(searchLower)
    );
  });

  // Handle form submission for add/update
  const handleSubmit = (operation, userData) => {
    const action = operation === "add" ? addNewUser : updateUser;
    const credentials =
      operation === "add"
        ? { role: "student", credentials: userData }
        : {
            role: "student",
            credentials: {
              ...userData,
              first_name: userData.FirstName,
              last_name: userData.LastName,
              email: userData.Email,
            },
          };

    dispatch(action(credentials))
      .unwrap()
      .then(() => {
        showMessage(
          `Student ${operation === "add" ? "added" : "updated"} successfully!`,
          "success"
        );
        dispatch(fetchUsers("student"));
      })
      .catch((error) => {
        showMessage(error, "error");
      });

    setIsModalOpen(false);
  };

  // Toggle student active/inactive status
  const handleToggleStatus = async (studentId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    dispatch(
      toggleStatus({
        role: "student",
        credentials: { user_id: studentId, status: newStatus },
      })
    )
      .unwrap()
      .then(() => {
        showMessage("Status updated successfully!", "success");
        dispatch(fetchUsers("student"));
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  };

  // Show status message
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  // Initialize new student data
  const initNewStudent = () => ({
    FirstName: "",
    LastName: "",
    Email: "",
    PasswordHash: "",
    gender: "",
    Major: "",
    AcademicLevel: "",
    department: "",
    squad_number: "",
    semester_number: "",
  });

  // Parse student name
  const parseStudentName = (fullName = "") => {
    const nameParts = fullName.trim().split(/\s+/);
    return {
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
    };
  };

  // Fetch students on component mount
  useEffect(() => {
    dispatch(fetchUsers("student"));
  }, [dispatch]);

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div>
      {/* Page header */}
      <h1 className="mb-4 text-2xl font-bold">Student Management</h1>

      {/* Search and add student section */}
      <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={searchInputStyle}
          />
        </div>
        <button
          onClick={() => {
            setCurrentStudent(initNewStudent());
            setIsModalOpen(true);
            setIsEditing(false);
          }}
          className={addButtonStyle}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Student
        </button>
      </div>

      {/* Students table */}
      <div className="p-3 overflow-x-auto bg-white rounded-lg shadow md:p-4 max-w-[285px] md:max-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className={tableHeaderStyle}>Name</th>
              <th className={tableHeaderStyle}>Student Code</th>
              <th className={tableHeaderStyle}>Email</th>
              <th className={tableHeaderStyle}>Major</th>
              <th className={tableHeaderStyle}>Status</th>
              <th className={`${tableHeaderStyle} text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const { firstName, lastName } = parseStudentName(
                  student.student_name
                );
                const statusText = student.status === 0 ? "Active" : "InActive";

                return (
                  <tr key={student.student_id} className="hover:bg-gray-50">
                    <td className={tableCellStyle}>
                      {student.student_name || "-"}
                    </td>
                    <td className={tableCellStyle}>
                      {student.std_code || "-"}
                    </td>
                    <td className={`${tableCellStyle} break-all`}>
                      {student.email || "-"}
                    </td>
                    <td className={tableCellStyle}>
                      {student.student_details?.Major || "-"}
                    </td>
                    <td className={tableCellStyle}>
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${statusStyle(
                          student.status
                        )}`}
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="flex items-center justify-center gap-2 p-2 md:flex-wrap">
                      {/* Edit button */}
                      <button
                        onClick={() => {
                          setCurrentStudent({
                            FirstName: firstName,
                            LastName: lastName,
                            Email: student.email,
                            PasswordHash: student.password,
                            gender: student.gender,
                            Major: student.student_details.Major,
                            AcademicLevel:
                              student.student_details.AcademicLevel,
                            department: student.student_details.department,
                            squad_number: student.student_details.squad_number,
                            semester_number:
                              student.student_details.semester_number,
                            gpa: student.gpa,
                            passed_hours: student.passed_hours,
                            registered_hours: student.registered_hours,
                            available_hours: student.available_hours,
                            std_code: student.std_code,
                            student_id: student.student_id,
                          });
                          setIsEditing(true);
                          setIsModalOpen(true);
                        }}
                        className={editButtonStyle}
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      {/* Toggle status button */}
                      <button
                        onClick={() =>
                          handleToggleStatus(student.student_id, student.status)
                        }
                        className={toggleButtonStyle(student.status)}
                        title={student.status === 0 ? "Deactivate" : "Activate"}
                      >
                        <FontAwesomeIcon
                          icon={student.status === 0 ? faEye : faEyeSlash}
                        />
                      </button>

                      {/* View details button */}
                      <Link
                        to={`/admin/student/${student.student_id}`}
                        className={viewButtonStyle}
                        title="View Full Details"
                      >
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student form modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        userData={currentStudent}
        setUserData={setCurrentStudent}
        role="Student"
      />

      {/* Status messages */}
      {message && (
        <Message
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />
      )}
    </div>
  );
};

export default StudentManagement;
