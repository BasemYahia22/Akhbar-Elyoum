import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAssignmentsSubmited } from "../../redux/slices/fetchStudentAssignmentsSubmitedSlice";
import { updateAssignmentGrade } from "../../redux/slices/updateAssignmentGradeSlice";
import Message from "../../components/Message";
import StatusMessage from "../../components/StatusMessage";

const StudentAssignment = () => {
  // State management
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  // Redux data
  const { data, loading, error } = useSelector(
    (state) => state.fetchStudentAssignmentsSubmited
  );

  // Style variables
  const tableHeaderStyle = "p-3 text-left bg-gray-200";
  const tableCellStyle = "p-3";
  const downloadButtonStyle =
    "p-2 text-blue-500 rounded-full hover:bg-blue-100";
  const submitButtonStyle = (hasGrade) =>
    `p-2 rounded-full ${
      hasGrade
        ? "text-green-500 hover:bg-green-100"
        : "text-gray-400 cursor-not-allowed"
    }`;
  const inputStyle =
    "p-2 transition-all duration-200 bg-white border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none";
  const linkStyle = "text-blue-500 hover:underline";

  // Fetch assignments on component mount
  useEffect(() => {
    if (!data) {
      dispatch(fetchStudentAssignmentsSubmited());
    }
  }, [dispatch, data]);

  // Initialize assignments and refs when data is available
  useEffect(() => {
    if (data?.submitted_assignments) {
      setAssignments(data.submitted_assignments);
      inputRefs.current = data.submitted_assignments.map(
        (_, i) => inputRefs.current[i] || React.createRef()
      );
    }
  }, [data]);

  // Handle grade change for an assignment
  const handleDegreeChange = (id, value) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.assignment_id === id
          ? { ...assignment, assignment_grade: value }
          : assignment
      )
    );
  };

  // Show status message
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  // Publish grade for an assignment
  const handlePublishDegree = (id) => {
    const assignment = assignments.find((a) => a.assignment_id === id);
    if (assignment?.assignment_grade) {
      const credentials = {
        student_id: assignment.student_id,
        assignment_id: id,
        assignment_grade: assignment.assignment_grade,
      };
      dispatch(updateAssignmentGrade(credentials))
        .unwrap()
        .then(() =>
          showMessage("Grade Assignment added successfully!", "success")
        )
        .catch((error) => showMessage(error, "error"));
    }
  };

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Student Assignments</h1>

      {/* Assignments Table */}
      <div className="overflow-auto max-w-[280px] md:max-w-full">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className={tableHeaderStyle}>Name</th>
              <th className={tableHeaderStyle}>Assignment</th>
              <th className={tableHeaderStyle}>File</th>
              <th className={tableHeaderStyle}>Grade</th>
              <th className={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment, index) => (
              <tr
                key={assignment.assignment_id}
                className="border-b hover:bg-gray-50"
              >
                {/* Student Info */}
                <td className={tableCellStyle}>{assignment.student_name}</td>

                {/* Assignment Info */}
                <td className={tableCellStyle}>{assignment.assignment_name}</td>

                {/* File Download */}
                <td className={tableCellStyle}>
                  <a
                    href={assignment.file_upload_link}
                    className={linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {assignment.file}
                  </a>
                </td>

                {/* Grade Input */}
                <td className={tableCellStyle}>
                  <input
                    type="text"
                    value={assignment.assignment_grade || ""}
                    onChange={(e) =>
                      handleDegreeChange(
                        assignment.assignment_id,
                        e.target.value
                      )
                    }
                    ref={(el) => (inputRefs.current[index] = el)}
                    className={inputStyle}
                    placeholder="Enter grade"
                  />
                </td>

                {/* Action Buttons */}
                <td className="flex items-center p-3 space-x-4">
                  <a
                    href={assignment.file_upload_link}
                    className={downloadButtonStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download"
                    download
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </a>

                  <button
                    onClick={() =>
                      handlePublishDegree(assignment.assignment_id)
                    }
                    className={submitButtonStyle(assignment.assignment_grade)}
                    disabled={!assignment.assignment_grade}
                    title="Submit grade"
                  >
                    <FontAwesomeIcon icon={faUpload} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Message */}
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

export default StudentAssignment;
