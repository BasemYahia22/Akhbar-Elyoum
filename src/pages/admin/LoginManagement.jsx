import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

const LoginManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      status: "Active",
      gpa: 3.5,
      lastLogin: "2023-10-01 10:00 AM",
    },
    {
      id: 2,
      name: "Jane Smith",
      status: "Inactive",
      gpa: 1.8,
      lastLogin: "2023-09-28 02:30 PM",
    },
    {
      id: 3,
      name: "Alice Johnson",
      status: "Active",
      gpa: 2.5,
      lastLogin: "2023-10-05 09:15 AM",
    },
    {
      id: 4,
      name: "Alice Johnson",
      status: "Inactive",
      gpa: 1.9,
      lastLogin: "2023-10-05 09:15 AM",
    },
    {
      id: 5,
      name: "Alice Johnson",
      status: "Active",
      gpa: 2.5,
      lastLogin: "2023-10-05 09:15 AM",
    },
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    gpa: "",
  });

  // Toggle user status (Active/Inactive)
  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  // Filter users based on filters
  const filteredUsers = users.filter((user) => {
    return (
      (filters.name === "" ||
        user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.status === "" || user.status === filters.status) &&
      (filters.gpa === "" || user.gpa >= parseFloat(filters.gpa))
    );
  });

  const containerStyle =
    "transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl md:p-6 p-3";

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Login Management</h1>

      {/* Filters */}
      <div className={`mb-6 ${containerStyle}`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Search by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full p-2 mt-1 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full p-2 mt-1 border rounded-lg"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum GPA
            </label>
            <input
              type="number"
              placeholder="Filter by GPA"
              value={filters.gpa}
              onChange={(e) => setFilters({ ...filters, gpa: e.target.value })}
              className="w-full p-2 mt-1 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Manage User Logins */}
      <div className={containerStyle}>
        <h2 className="mb-4 text-xl font-semibold">Manage User Logins</h2>

        {/* User Table */}
        <div className="overflow-x-auto max-w-[16rem] md:max-w-full">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">GPA</th>
                <th className="p-2">Last Login</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-center border-b hover:bg-gray-50"
                >
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-2">{user.gpa}</td>
                  <td className="p-2">{user.lastLogin}</td>
                  <td className="flex flex-wrap items-center justify-center gap-2 p-2 md:gap-5 md:flex-nowrap">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className="px-3 py-1 text-white rounded-lg bg-third"
                    >
                      <FontAwesomeIcon
                        icon={
                          user.status === "Active" ? faToggleOn : faToggleOff
                        }
                        className="md:mr-2"
                      />
                      <span className="hidden md:inline">Toggle Status</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginManagement;
