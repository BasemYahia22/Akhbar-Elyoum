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
import { toggleStatus } from "../../redux/slices/toggleStatusSlice";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { addNewUser } from "../../redux/slices/addNewUserSlice";
import { updateUser } from "../../redux/slices/updateUserSlice";
import StatusMessage from "../../components/StatusMessage";

const AdminManagement = () => {
  const { data, loading, error } = useSelector((state) => state.fetchUsers);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const admins = data?.admins || [];

  const filteredAdmins = admins.filter((admin) => {
    const name = admin.admin_name?.toLowerCase() || "";
    const email = admin.email?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (operation, userData) => {
    if (operation === "add") {
      const credentials = { ...userData };
      dispatch(addNewUser({ role: "admin", credentials }))
        .unwrap()
        .then(() => {
          showMessage("admin added successfully!", "success");
          dispatch(fetchUsers("admin"));
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
      };
      dispatch(updateUser({ role: "admin", credentials }))
        .unwrap()
        .then(() => {
          showMessage("admin updated successfully!", "success");
          dispatch(fetchUsers("admin"));
        })
        .catch((error) => {
          showMessage(error, "error");
        });
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    currentStatus = currentStatus === 0 ? 1 : 0;
    const credentials = {
      user_id: adminId,
      status: currentStatus,
    };
    console.log(credentials);
    dispatch(toggleStatus({ role: "admin", credentials }))
      .unwrap()
      .then(() => {
        showMessage("your toggle submited successfully!", "success");
        dispatch(fetchUsers("admin"));
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  };
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  useEffect(() => {
    dispatch(fetchUsers("admin"));
  }, [dispatch]);

 if (loading || error) {
   return <StatusMessage loading={loading} error={error} />;
 }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Admin Management</h1>

      <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setCurrentAdmin({
              FirstName: "",
              LastName: "",
              Email: "",
              PasswordHash: "",
              gender: "",
              Role: "",
              status: 0,
            });
            setIsModalOpen(true);
            setIsEditing(false);
          }}
          className="flex items-center px-4 py-2 text-white rounded-lg bg-third md:w-fit w-[230px]"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Admin
        </button>
      </div>

      <div className="p-3 overflow-x-auto bg-white rounded-lg shadow md:p-6 max-w-[285px] md:max-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => {
                const status = admin.status === 0 ? "Inactive" : "Active";
                const fullName = admin.admin_name || "";
                const nameParts = fullName.trim().split(/\s+/);
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";
                return (
                  <tr key={admin.admin_id} className="hover:bg-gray-50">
                    <td className="p-2">{admin.admin_name || "-"}</td>
                    <td className="p-2 break-all">{admin.email || "-"}</td>
                    <td className="p-2">{admin.admin_details?.Role || "-"}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          admin.status === 1
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
                          setCurrentAdmin({
                            FirstName: firstName,
                            LastName: lastName,
                            Email: admin.email.trim(),
                            PasswordHash: admin.PasswordHash,
                            gender: admin.gender,
                            status: admin.status || 1,
                            std_code: admin.std_code || null,
                            Role: admin.admin_details.Role,
                            admin_id: admin.admin_id,
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
                          handleToggleStatus(admin.admin_id, admin.status)
                        }
                        className={`px-2 py-1 text-white rounded-lg ${
                          admin.status === 1
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }`}
                        title={admin.status === 1 ? "Deactivate" : "Activate"}
                      >
                        <FontAwesomeIcon
                          icon={admin.status === 1 ? faEye : faEyeSlash}
                        />
                      </button>
                      <Link
                        to={`/admin/admin/${admin.admin_id}`}
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
                  No admins found
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
        userData={currentAdmin}
        setUserData={setCurrentAdmin}
        role="Admin"
      />
      {/* Message Component for displaying alerts */}
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

export default AdminManagement;
