import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAndSendAssignments } from "../../redux/slices/fetchAndSendAssignmentsSlice";
import { Link } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";

const Assignments = () => {
  // State for filter input
  const [filter, setFilter] = useState("");
  const dispatch = useDispatch();

  // Get data from Redux store
  const { data, loading, error } = useSelector(
    (state) => state.fetchAndSendAssignments
  );

  // Style variables
  const thAndTdStyle = "px-4 py-2";
  const filterInputStyle =
    "w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none";
  const downloadLinkStyle = "text-blue-500 hover:text-blue-700";
  const moreLinkStyle = "block w-full h-full text-center";
  const moreIconStyle = "text-gray-600 cursor-pointer hover:text-gray-900";
  const submittedStyle = "text-green-600";
  const notSubmittedStyle = "text-red-600";

  // Fetch assignments on component mount
  useEffect(() => {
    if (!data) {
      dispatch(fetchAndSendAssignments({ type: "GET" }));
    }
  }, [dispatch, data]);

  // Filter assignments based on search term
  const filteredAssignments =
    data?.assignments_data?.filter((assignment) => {
      const searchTerm = filter.toLowerCase();
      return (
        assignment.course_name.toLowerCase().includes(searchTerm) ||
        assignment.prof_name.toLowerCase().includes(searchTerm)
      );
    }) || [];

  // Handle filter input change
  const handleFilterChange = (e) => setFilter(e.target.value);

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-center">Assignments</h1>

      {/* Filter Input */}
      <div className="mb-4 w-60">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filter by course or instructor"
          className={filterInputStyle}
        />
      </div>

      {/* Assignments Table */}
      <div className="overflow-auto md:max-w-full max-w-[18rem]">
        <table className="min-w-full text-center bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className={thAndTdStyle}>Assignment Name</th>
              <th className={thAndTdStyle}>Instructor</th>
              <th className={thAndTdStyle}>Course Name</th>
              <th className={thAndTdStyle}>Deadline</th>
              <th className={thAndTdStyle}>Download</th>
              <th className={thAndTdStyle}>Submitted</th>
              <th className={thAndTdStyle}>More</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <tr
                  key={assignment.assignment_id}
                  className="border-b cursor-pointer hover:bg-gray-50"
                >
                  {/* Assignment Data */}
                  <td className={thAndTdStyle}>{assignment.assignment_name}</td>
                  <td className={thAndTdStyle}>{assignment.prof_name}</td>
                  <td className={thAndTdStyle}>{assignment.course_name}</td>
                  <td className={thAndTdStyle}>
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </td>

                  {/* Download Link */}
                  <td className={thAndTdStyle}>
                    <a
                      href={assignment.file_upload_link}
                      download
                      className={downloadLinkStyle}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </a>
                  </td>

                  {/* Submission Status */}
                  <td className={thAndTdStyle}>
                    {assignment.Submit_assignment ? (
                      <span className={submittedStyle}>Submitted</span>
                    ) : (
                      <span className={notSubmittedStyle}>Not Submitted</span>
                    )}
                  </td>

                  {/* More Options Link */}
                  <td className={thAndTdStyle}>
                    <Link
                      to={`${assignment.assignment_id}`}
                      className={moreLinkStyle}
                    >
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        className={moreIconStyle}
                      />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No data found matching the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
