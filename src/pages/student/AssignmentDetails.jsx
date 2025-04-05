import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAndSendAssignments } from "../../redux/slices/fetchAndSendAssignmentsSlice";
import { fetchAssignmentDetailes } from "../../redux/slices/fetchAssignmentDetailesSlice";
import Message from "../../components/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faDownload,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import StatusMessage from "../../components/StatusMessage";

const AssignmentDetails = () => {
  // State management
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  // Style variables
  const pStyle = "text-gray-700 lg:text-lg";
  const containerStyle = "flex items-center justify-between flex-wrap";
  const backLinkStyle = "text-blue-500 hover:text-blue-700 hover:underline";
  const downloadButtonStyle =
    "block px-2 py-3 mt-3 text-white rounded-lg cursor-pointer md:px-6 bg-third hover:shadow-lg md:float-end w-fit";
  const submitButtonStyle =
    "inline-flex items-center px-6 py-3 text-white rounded-lg bg-third hover:shadow-lg";
  const inputStyle =
    "w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const statusStyle = (submitted) =>
    `font-semibold ${submitted ? "text-green-600" : "text-red-600"}`;
  const iconStyle =
    "py-[6px] px-[7px] mr-2 text-white rounded-full lg:py-3 lg:px-[14px] bg-third md:mt-1 lg:mt-0";

  // Redux data
  const { data, loading, error } = useSelector(
    (state) => state.fetchAssignmentDetailes
  );
  const assignment = data?.assignments_data;

  // Fetch assignment details on component mount
  useEffect(() => {
    const credential = { assignment_id: id };
    dispatch(fetchAssignmentDetailes(credential));
  }, [dispatch, id]);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (file && email) {
      const credentials = {
        file_link: file,
        assigment_name: assignment?.assignment_name,
        prof_email: email,
        course_code: assignment?.course_code,
      };
      handleSubmitAssignment(credentials);
    }
  };

  // Submit assignment to server
  const handleSubmitAssignment = (credentials) => {
    dispatch(fetchAndSendAssignments({ type: "POST", credentials }))
      .unwrap()
      .then(() => {
        showMessage("Assignment solution submitted successfully!", "success");
        setFile(null);
        setEmail("");
      })
      .catch(() => {
        showMessage(error, "error");
      });
  };

  // Message handling
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const hideMessage = () => setMessage("");

  // File and email handlers
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(URL.createObjectURL(selectedFile));
  };

  const handleEmailChange = (e) => setEmail(e.target.value);

  // Loading and error states
  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back Link */}
      <div className="mb-4">
        <Link to="/student/assignments" className={backLinkStyle}>
          &larr; Back to Assignments
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap items-center justify-between gap-5 lg:gap-10 md:flex-nowrap">
        {/* Assignment Details Section */}
        <div className="flex items-start w-full p-6 bg-white rounded-lg shadow-xl lg:p-6 md:p-3">
          <FontAwesomeIcon icon={faClipboardList} className={iconStyle} />
          <div className="relative w-full h-full">
            {/* Assignment Header */}
            <div className={containerStyle}>
              <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                {assignment?.assignment_name}
              </h1>
              <p className={pStyle}>
                <strong>Status:</strong>{" "}
                <span className={statusStyle(assignment?.student_submit)}>
                  {assignment?.student_submit ? "Submitted" : "Not Submitted"}
                </span>
              </p>
            </div>

            {/* Professor and Deadline */}
            <div className={containerStyle}>
              <p className={pStyle}>
                <strong>Professor name: </strong>
                {data?.professor_info?.FirstName}{" "}
                {data?.professor_info?.LastName}
              </p>
              <p className={pStyle}>
                <strong>Deadline: </strong>
                {new Date(assignment?.deadline).toLocaleDateString()}
              </p>
            </div>

            {/* Course Information */}
            <div className={containerStyle}>
              <p className={pStyle}>
                <strong>Course name: </strong>
                {assignment?.course_name} ({assignment?.course_code})
              </p>
              <p className={pStyle}>
                <strong>Department: </strong>
                {assignment?.department}
              </p>
            </div>

            {/* Assignment Description */}
            <p className="my-5">
              <p className="font-bold">Description assignment: </p>
              {assignment?.assignment_description}
            </p>

            {/* Download Button */}
            <a
              href={assignment?.file_upload_link}
              download
              className={downloadButtonStyle}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download Assignment
            </a>
          </div>
        </div>

        {/* Submission Form Section */}
        <div className="p-6 bg-white rounded-lg shadow-xl h-fit">
          <h2 className="mb-6 text-xl font-bold text-center text-gray-800">
            Submit Assignment
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={inputStyle}
                placeholder="Enter professor email"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload Solution File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className={inputStyle}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button type="submit" className={submitButtonStyle}>
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Submit Solution
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Message Component */}
      {message && (
        <Message message={message} type={messageType} onClose={hideMessage} />
      )}
    </div>
  );
};

export default AssignmentDetails;
