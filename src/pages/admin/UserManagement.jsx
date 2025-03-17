import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      courses: [],
      status: "active", // Add status field
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Professor",
      courses: ["CS101", "MATH202"],
      status: "active", // Add status field
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    courses: [],
    status: "active", // Add status field
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Available courses for assignment
  const availableCourses = [
    "CS101",
    "MATH202",
    "PHYS301",
    "CHEM401",
    "CS101",
    "MATH202",
    "PHYS301",
    "CHEM401",
  ];
  const inputStyle = "w-full p-2 border rounded-lg";

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill in all fields.");
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser,
    };

    setUsers([...users, user]);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "Student",
      courses: [],
      status: "active", // Reset status
    });
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const startEdit = (user) => {
    setIsEditing(true);
    setEditUser({ ...user });
  };

  const updateUser = () => {
    if (!editUser.name || !editUser.email) {
      alert("Please fill in all fields.");
      return;
    }

    setUsers(
      users.map((user) => (user.id === editUser.id ? { ...editUser } : user))
    );
    setIsEditing(false);
    setEditUser(null);
  };

  // Toggle user status
  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  // Handle course assignment for professors
  const handleCourseAssignment = (course, isChecked) => {
    if (isEditing) {
      const updatedCourses = isChecked
        ? [...editUser.courses, course]
        : editUser.courses.filter((c) => c !== course);
      setEditUser({ ...editUser, courses: updatedCourses });
    } else {
      const updatedCourses = isChecked
        ? [...newUser.courses, course]
        : newUser.courses.filter((c) => c !== course);
      setNewUser({ ...newUser, courses: updatedCourses });
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>

      {/* Add/Edit User Form */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-semibold">
          {isEditing ? "Edit User" : "Add New User"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={isEditing ? editUser.name : newUser.name}
            onChange={(e) =>
              isEditing
                ? setEditUser({ ...editUser, name: e.target.value })
                : setNewUser({ ...newUser, name: e.target.value })
            }
            className={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={isEditing ? editUser.email : newUser.email}
            onChange={(e) =>
              isEditing
                ? setEditUser({ ...editUser, email: e.target.value })
                : setNewUser({ ...newUser, email: e.target.value })
            }
            className={inputStyle}
          />
          {!isEditing && (
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className={inputStyle}
            />
          )}
          <select
            value={isEditing ? editUser.role : newUser.role}
            onChange={(e) =>
              isEditing
                ? setEditUser({ ...editUser, role: e.target.value })
                : setNewUser({ ...newUser, role: e.target.value })
            }
            className={inputStyle}
          >
            <option value="Student">Student</option>
            <option value="Professor">Professor</option>
            <option value="Admin">Admin</option>
          </select>

          {/* Assign Courses (Only for Professors) */}
          {(isEditing ? editUser.role : newUser.role) === "Professor" && (
            <div className="mt-4">
              <h3 className="mb-2 font-semibold">Assign Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3">
                {availableCourses.map((course) => (
                  <div key={course} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={course}
                      checked={
                        isEditing
                          ? editUser.courses.includes(course)
                          : newUser.courses.includes(course)
                      }
                      onChange={(e) =>
                        handleCourseAssignment(course, e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={course}>{course}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isEditing ? (
            <button
              onClick={updateUser}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              Update User
            </button>
          ) : (
            <button
              onClick={addUser}
              className="px-8 py-2 text-white rounded-lg bg-third"
            >
              Add User
            </button>
          )}
        </div>
      </div>

      {/* User Table */}
      <div className="p-3 overflow-x-auto bg-white rounded-lg shadow md:p-6 max-w-[18rem] md:max-w-full">
        <h2 className="mb-4 text-xl font-semibold">User List</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Courses</th>
              <th className="p-2">Status</th> {/* New column for status */}
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center border-b">
                <td className="p-2">{user.name}</td>
                <td className="p-2 break-all">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  {user.courses.length > 0 ? user.courses.join(", ") : "None"}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="flex flex-wrap items-center justify-center gap-2 p-2 md:flex-nowrap">
                  <button
                    onClick={() => startEdit(user)}
                    className="px-2 py-1 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-2 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-2 py-1 text-white rounded-lg ${
                      user.status === "active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={user.status === "active" ? faEye : faEyeSlash}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
