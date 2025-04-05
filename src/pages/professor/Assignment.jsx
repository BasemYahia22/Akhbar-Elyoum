import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import AddAssignmentModal from "./AddAssignmentModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentsProfessor } from "../../redux/slices/fetchAssignmentsProfessorSlice";
import { assignmentOperation } from "../../redux/slices/assignmentOperationSlice";
import Message from "../../components/Message";
import { updateAssignment } from "../../redux/slices/updateAssignmentSlice";
import { removeAssignment } from "../../redux/slices/removeAssignmentSlice";
import StatusMessage from "../../components/StatusMessage";

const Assignment = () => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [filterAssignmentName, setFilterAssignmentName] = useState("");

  const dispatch = useDispatch();
  const tdStyle = "p-2 text-sm md:text-base whitespace-nowrap";

  // Get data from Redux store
  const {
    data: assignmentsData,
    loading,
    error,
  } = useSelector((state) => state.fetchAssignmentsProfessor);
  const coursesInfo = useSelector((state) => state.assignmentOperation.data);
  console.log(coursesInfo);
  // Get assignments from the fetched data
  const assignments = assignmentsData?.assignments_data || [];

  // Fetch assignments and courses on component mount and after operations
  useEffect(() => {
    dispatch(fetchAssignmentsProfessor({ method: "GET" }));
    dispatch(assignmentOperation({ method: "GET" }));
  }, [dispatch]);

  // Helper function to show messages (success/error)
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  // Handle adding a new assignment
  const handleAddAssignment = (newAssignment) => {
    dispatch(
      assignmentOperation({ credentials: newAssignment, method: "POST" })
    )
      .unwrap()
      .then(() => {
        showMessage("Assignment added successfully!", "success");
        dispatch(fetchAssignmentsProfessor({ method: "GET" }));
        setIsModalOpen(false);
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  };

  // Handle editing an assignment
  const handleEditAssignment = (updatedAssignment) => {
    dispatch(updateAssignment(updatedAssignment))
      .unwrap()
      .then(() => {
        showMessage("Assignment updated successfully!", "success");
        dispatch(fetchAssignmentsProfessor({ method: "GET" }));
        setIsModalOpen(false);
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  };

  // Handle removing an assignment
  const handleRemoveAssignment = (id) => {
    const credentials = {
      assignment_id: id,
    };
    dispatch(removeAssignment(credentials))
      .unwrap()
      .then(() => {
        showMessage("Assignment removed successfully!", "success");
        dispatch(fetchAssignmentsProfessor({ method: "GET" }));
      })
      .catch((error) => {
        showMessage(error?.message, "error");
      });
  };

  // Handle edit button click - opens modal with assignment data
  const handleEditClick = (assignment) => {
    setAssignmentToEdit(assignment);
    setIsModalOpen(true);
  };

  // Filter assignments by assignment name
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.assignment_name
      .toLowerCase()
      .includes(filterAssignmentName.toLowerCase())
  );

  const inputStyle =
    "p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none w-full md:w-auto";

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div className="mt-5 md:mt-0">
      {/* Message Component for showing alerts */}
      {message && (
        <Message
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />
      )}

      {/* Filter and Add New Assignment Button */}
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        {/* Filter by Assignment Name */}
        <input
          type="text"
          placeholder="Filter by Assignment Name"
          value={filterAssignmentName}
          onChange={(e) => setFilterAssignmentName(e.target.value)}
          className={inputStyle}
        />

        {/* Add New Assignment Button */}
        <button
          onClick={() => {
            setAssignmentToEdit(null);
            setIsModalOpen(true);
          }}
          className="w-full px-4 py-2 text-white rounded-lg bg-third font-crimson-text-semibold md:w-auto"
        >
          <span>Add New</span>
          <FontAwesomeIcon icon={faPlus} className="ml-2" />
        </button>
      </div>

      {/* Table with horizontal scrolling on mobile */}
      <div className="overflow-x-auto">
        <div className="max-w-[200px] md:max-w-full">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 font-crimson-text-semibold">
              <tr>
                <th className={tdStyle}>#</th>
                <th className={tdStyle}>Assignment Name</th>
                <th className={tdStyle}>Course Name</th>
                <th className={tdStyle}>Deadline</th>
                <th className={tdStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment, index) => (
                  <tr
                    key={assignment.assignment_id}
                    className="text-center border-b"
                  >
                    <td className={tdStyle}>{index + 1}</td>
                    <td className="p-2 text-sm md:text-base whitespace-nowrap">
                      {assignment.assignment_name}
                    </td>
                    <td className={tdStyle}>{assignment.course_name}</td>
                    <td className={tdStyle}>{assignment.deadline}</td>
                    <td className={tdStyle}>
                      <div className="flex justify-center space-x-2">
                        {/* Download button - only shown if file exists */}
                        {assignment.file_link && (
                          <a
                            href={assignment.file_link}
                            download
                            className="text-blue-500 hover:text-blue-700"
                            aria-label="Download"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </a>
                        )}
                        {/* Edit button */}
                        <button
                          onClick={() => handleEditClick(assignment)}
                          className="text-yellow-500 hover:text-yellow-700"
                          aria-label="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={() =>
                            handleRemoveAssignment(assignment.assignment_id)
                          }
                          className="text-red-500 hover:text-red-700"
                          aria-label="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    {assignments.length === 0
                      ? "No assignments found."
                      : "No assignments match the filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding/Editing Assignment */}
      <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAssignment={handleAddAssignment}
        onEditAssignment={handleEditAssignment}
        assignmentToEdit={assignmentToEdit}
        coursesInfo={coursesInfo?.professor_courses}
      />
    </div>
  );
};

export default Assignment;
