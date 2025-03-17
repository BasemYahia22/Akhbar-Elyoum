import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const Assignments = () => {
  // Sample assignments data with instructor name, course name, and course code
  const [assignments] = useState([
    {
      id: 1,
      name: "Assignment 1",
      fileUrl: "/files/assignment1.pdf",
      instructor: "Dr. Smith",
      courseName: "Introduction to React",
      courseCode: "CS101",
    },
    {
      id: 2,
      name: "Assignment 2",
      fileUrl: "/files/assignment2.pdf",
      instructor: "Prof. Johnson",
      courseName: "Advanced JavaScript",
      courseCode: "CS201",
    },
  ]);

  // State for file upload, email, and selected assignment
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle email input
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle assignment selection
  const handleAssignmentChange = (e) => {
    setSelectedAssignmentId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && email && selectedAssignmentId) {
      const selectedAssignment = assignments.find(
        (assignment) => assignment.id === parseInt(selectedAssignmentId)
      );

      // Simulate sending data to the server
      console.log("Assignment Name:", selectedAssignment.name);
      console.log("Instructor:", selectedAssignment.instructor);
      console.log("Course Name:", selectedAssignment.courseName);
      console.log("Course Code:", selectedAssignment.courseCode);
      console.log("File:", file);
      console.log("Email:", email);
      alert("Assignment solution submitted successfully!");
    } else {
      alert("Please fill out all fields and upload a file.");
    }
  };

  // Style
  const labelStyle = "block mb-2 text-sm font-medium";
  const inputStyle = "w-full p-2 border rounded-lg";
  const thStyle = "px-4 py-2 text-left";
  const tdStyle = "px-4 py-2";
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-center">Assignments</h1>

      {/* Display Assignments in a Responsive Table */}
      <div className="mb-8 overflow-auto md:w-full w-[18rem]">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className={thStyle}>Assignment Name</th>
              <th className={thStyle}>Instructor</th>
              <th className={thStyle}>Course Name</th>
              <th className={thStyle}>Course Code</th>
              <th className={thStyle}>Download</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-b hover:bg-gray-50">
                <td className={tdStyle}>{assignment.name}</td>
                <td className={tdStyle}>{assignment.instructor}</td>
                <td className={tdStyle}>{assignment.courseName}</td>
                <td className={tdStyle}>{assignment.courseCode}</td>
                <td className={tdStyle}>
                  <a
                    href={assignment.fileUrl}
                    download
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="text-sm text-primary"
                    />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Assignment Solution */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Submit Your Solution</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={labelStyle}>
              Select Assignment
            </label>
            <select
              value={selectedAssignmentId}
              onChange={handleAssignmentChange}
              className={inputStyle}
              required
            >
              <option value="" disabled>
                Choose an assignment
              </option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.name} - {assignment.courseName} (
                  {assignment.courseCode})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={inputStyle}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className={labelStyle}>
              Upload Solution File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className={inputStyle}
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded bg-primary"
          >
            Submit Solution
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assignments;
