import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";

const StudentAssignment = () => {
  // Sample data for student assignments
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      studentName: "John Doe",
      assignmentName: "Math Homework",
      file: "math_hw.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "", // Added degree field
    },
    {
      id: 2,
      studentName: "Jane Smith",
      assignmentName: "Science Project",
      file: "science_project.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "", // Added degree field
    },
    {
      id: 3,
      studentName: "Alice Johnson",
      assignmentName: "History Essay",
      file: "history_essay.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "", // Added degree field
    },
  ]);

  // Function to handle degree input change
  const handleDegreeChange = (id, value) => {
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === id ? { ...assignment, degree: value } : assignment
    );
    setAssignments(updatedAssignments);
  };

  // Function to handle publishing/uploading the degree
  const handlePublishDegree = (id) => {
    const assignment = assignments.find((a) => a.id === id);
    if (assignment && assignment.degree) {
      alert(
        `Degree "${assignment.degree}" published for ${assignment.studentName}`
      );
      // Here you can add logic to upload/publish the degree (e.g., API call)
    } else {
      alert("Please enter a degree before publishing.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Student Assignments</h1>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Name of Assignment</th>
            <th className="p-3 text-left">File</th>
            <th className="p-3 text-left">Degree</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id} className="border-b">
              <td className="p-3">{assignment.studentName}</td>
              <td className="p-3">{assignment.assignmentName}</td>
              <td className="p-3">{assignment.file}</td>
              <td className="p-3">
                <input
                  type="text"
                  value={assignment.degree}
                  onChange={(e) =>
                    handleDegreeChange(assignment.id, e.target.value)
                  }
                  className="p-2 border rounded focus:outline-none"
                  placeholder="Enter degree"
                />
              </td>
              <td className="flex items-center p-3 space-x-4">
                {/* Download Icon */}
                <a
                  href={`/path/to/download/${assignment.file}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </a>

                {/* Publish/Upload Degree Icon */}
                <button
                  onClick={() => handlePublishDegree(assignment.id)}
                  className="text-green-500 hover:text-green-700"
                >
                  <FontAwesomeIcon icon={faUpload} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentAssignment;
