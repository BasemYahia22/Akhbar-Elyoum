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
import UserFormModal from "./UserFormModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/fetchUsersSlice";
import { Link } from "react-router-dom";
import { toggleStatus } from "../../redux/slices/toggleStatusSlice";
import Message from "../../components/Message";
import { addNewUser } from "../../redux/slices/addNewUserSlice";
import { updateUser } from "../../redux/slices/updateUserSlice";
import StatusMessage from "../../components/StatusMessage";

const ProfessorManagement = () => {
  const { data, loading, error } = useSelector((state) => state.fetchUsers);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const professors = data?.professors || [];
  const filteredProfessors = professors.filter((professor) => {
    const name = `${professor.professor_name}`.toLowerCase();
    const email = professor.email?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (operation, userData) => {
    if (operation === "add") {
      const credentials = {
        ...userData,
      };
      dispatch(addNewUser({ role: "professor", credentials }))
        .unwrap()
        .then(() => {
          showMessage("Professor added successfully!", "success");
          dispatch(fetchUsers("professor"));
        })
        .catch((error) => {
          showMessage(error, "error");
        });
    } else {
      const credentials = {
        ...userData,
        first_name: userData.FirstName,
        last_name: userData.LastName,
        email: userData.Email,
        department: userData.Department,
      };
      dispatch(updateUser({ role: "professor", credentials }))
        .unwrap()
        .then(() => {
          showMessage("Professor updated successfully!", "success");
          dispatch(fetchUsers("professor"));
        })
        .catch((error) => {
          showMessage(error, "error");
        });
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (professorId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    const credentials = {
      user_id: professorId,
      status: newStatus,
    };

    dispatch(toggleStatus({ role: "professor", credentials }))
      .unwrap()
      .then(() => {
        showMessage("Status updated successfully!", "success");
        dispatch(fetchUsers("professor"));
      })
      .catch((error) => {
        showMessage(error.message || "Failed to update status", "error");
      });
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  useEffect(() => {
    dispatch(fetchUsers("professor"));
  }, [dispatch]);

 if (loading || error) {
   return <StatusMessage loading={loading} error={error} />;
 }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Professor Management</h1>

      <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search professors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setCurrentProfessor({
              FirstName: "",
              LastName: "",
              Email: "",
              PasswordHash: "",
              gender: "Male",
              Department: "",
              status: 1,
              course_id: null,
            });
            setIsModalOpen(true);
            setIsEditing(false);
          }}
          className="flex items-center px-4 py-2 text-white rounded-lg bg-third w-[230px] md:w-fit"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Professor
        </button>
      </div>

      <div className="p-3 overflow-x-auto bg-white rounded-lg shadow md:p-6 max-w-[285px] md:max-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProfessors.length > 0 ? (
              filteredProfessors.map((professor) => {
                const status = professor.status === 0 ? "Inactive" : "Active";
                const fullName = professor.professor_name || "";
                const nameParts = fullName.trim().split(/\s+/);
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";
                return (
                  <tr key={professor.professor_id} className="hover:bg-gray-50">
                    <td className="p-2">
                      {`${professor.professor_name}` || "-"}
                    </td>
                    <td className="p-2 break-all">{professor.email || "-"}</td>
                    <td className="p-2">
                      {professor.professor_details.Department || "-"}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          professor.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="flex items-center justify-center gap-2 p-2 md:flex-wrap">
                      <button
                        onClick={() => {
                          setCurrentProfessor({
                            FirstName: firstName,
                            LastName: lastName,
                            Email: professor.email,
                            PasswordHash: professor.PasswordHash,
                            gender: professor.gender,
                            Department: professor.professor_details.Department,
                            status: professor.status,
                            course_id: professor.course_id || null,
                            professor_id: professor.professor_id || null,
                            std_code: professor.std_code || null,
                          });
                          setIsEditing(true);
                          setIsModalOpen(true);
                        }}
                        className="px-2 py-1 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(
                            professor.professor_id,
                            professor.status
                          )
                        }
                        className={`px-2 py-1 text-white rounded-lg ${
                          professor.status === 1
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }`}
                        title={
                          professor.status === 1 ? "Deactivate" : "Activate"
                        }
                      >
                        <FontAwesomeIcon
                          icon={professor.status === 1 ? faEye : faEyeSlash}
                        />
                      </button>
                      <Link
                        to={`/admin/professor/${professor.professor_id}`}
                        className="px-2 py-1 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
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
                <td colSpan="5" className="p-4 text-center">
                  No professors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        userData={currentProfessor}
        setUserData={setCurrentProfessor}
        role="Professor"
      />

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

export default ProfessorManagement;
