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

  // State for file upload, email, and assignment name
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [assignmentName, setAssignmentName] = useState("");

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle email input
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle assignment name input
  const handleAssignmentNameChange = (e) => {
    setAssignmentName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && email && assignmentName) {
      // Simulate sending data to the server
      console.log("Assignment Name:", assignmentName);
      console.log("File:", file);
      console.log("Email:", email);
      alert("Assignment submitted successfully!");
    } else {
      alert("Please fill out all fields and upload a file.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-center">Assignments</h1>

      {/* Display Assignments in a Responsive Table */}
      <div className="mb-8 overflow-auto md:w-full w-[18rem]">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Assignment Name</th>
              <th className="px-4 py-2 text-left">Instructor</th>
              <th className="px-4 py-2 text-left">Course Name</th>
              <th className="px-4 py-2 text-left">Course Code</th>
              <th className="px-4 py-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{assignment.name}</td>
                <td className="px-4 py-2">{assignment.instructor}</td>
                <td className="px-4 py-2">{assignment.courseName}</td>
                <td className="px-4 py-2">{assignment.courseCode}</td>
                <td className="px-4 py-2">
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
            <label className="block mb-2 text-sm font-medium">
              Assignment Name
            </label>
            <input
              type="text"
              value={assignmentName}
              onChange={handleAssignmentNameChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter assignment name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assignments;
