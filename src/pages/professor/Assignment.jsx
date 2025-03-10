import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFile,
  faEdit,
  faTrash,
  faMousePointer,
} from "@fortawesome/free-solid-svg-icons";
import AddAssignmentModal from "../../components/AddAssignmentModal";

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const handleAddAssignment = (newAssignment) => {
    setAssignments([...assignments, newAssignment]);
  };

  const handleEditAssignment = (updatedAssignment) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );
  };

  const handleRemoveAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  const handleEditClick = (assignment) => {
    setAssignmentToEdit(assignment);
    setIsModalOpen(true);
  };

  // Filter assignments by date range
  const filteredAssignments = assignments.filter((assignment) => {
    const assignmentStartDate = new Date(assignment.startDate);
    const assignmentEndDate = new Date(assignment.endDate);

    const filterStart = filterStartDate ? new Date(filterStartDate) : null;
    const filterEnd = filterEndDate ? new Date(filterEndDate) : null;

    // Check if the assignment falls within the filter range
    if (filterStart && assignmentStartDate < filterStart) return false;
    if (filterEnd && assignmentEndDate > filterEnd) return false;

    return true;
  });

  const inputStyle="p-2 border border-gray-300 rounded"
  return (
    <div className="">
      {/* Filter and Add New Assignment Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          {/* Filter by Start Date */}
          <label htmlFor="" className="my-auto">
            Filter by Start Date
          </label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className={inputStyle}
          />
          {/* Filter by End Date */}
          <label htmlFor="" className="my-auto">
            Filter by End Date
          </label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className={inputStyle}
          />
        </div>
        <button
          onClick={() => {
            setAssignmentToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-white rounded-lg bg-third font-crimson-text-semibold"
        >
          <span>Add New</span>
          <FontAwesomeIcon icon={faPlus} className="ml-2" />
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead className="text-lg bg-gray-200 font-crimson-text-semibold">
          <tr>
            <th className="p-2">{filteredAssignments.length}</th>
            <th className="p-2">Start Date</th>
            <th className="p-2">End Date</th>
            <th className="p-2">Title</th>
            <th className="p-2">Attachment</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((assignment, index) => (
            <tr key={assignment.id} className="border-b">
              <td className="p-2 text-center">{index + 1}</td>
              <td className="p-2 text-center">{assignment.startDate}</td>
              <td className="p-2 text-center">{assignment.endDate}</td>
              <td className="p-2 text-blue-500">{assignment.title}</td>
              <td className="p-2 text-center">
                <FontAwesomeIcon icon={faFile} className="mr-2" />
                {assignment.files.length} file(s)
              </td>
              <td className="p-2 text-center">
                <button className="text-green-500 hover:text-green-700">
                  <FontAwesomeIcon icon={faMousePointer} />
                  <span className="sr-only">Publish</span>
                </button>
                <button
                  onClick={() => handleEditClick(assignment)}
                  className="ml-2 text-yellow-500 hover:text-yellow-700"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span className="sr-only">Edit</span>
                </button>
                <button
                  onClick={() => handleRemoveAssignment(assignment.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span className="sr-only">Remove</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding/Editing Assignment */}
      <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAssignment={handleAddAssignment}
        onEditAssignment={handleEditAssignment}
        assignmentToEdit={assignmentToEdit}
      />
    </div>
  );
};

export default Assignment;
