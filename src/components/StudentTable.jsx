import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentTable = ({ data }) => {
  // State and Redux
  const [searchId, setSearchId] = useState("");
  const role = useSelector((state) => state.auth.role);

  // Style variables
  const tableCellStyle = "px-4 py-2";
  const searchInputStyle =
    "w-full p-2 border rounded md:w-fit focus:outline-none focus:ring-2 focus:ring-blue-500";
  const professorLinkStyle =
    "flex items-center justify-center p-2 text-blue-800 rounded hover:bg-blue-100";
  const adminLinkStyle =
    "flex items-center justify-center p-2 text-green-800 rounded hover:bg-green-100";
  const headerStyle = "text-lg font-crimson-text-semibold bg-gray-200";
  const rowStyle = "border-b hover:bg-gray-50";

  // Filter students based on search ID
  const filteredData = data?.student_grades?.filter((item) =>
    searchId ? item.user_id.toString().includes(searchId) : true
  );

  return (
    <div className="mt-5">
      {/* Search Input */}
      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by ID"
          className={searchInputStyle}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          aria-label="Search students by ID"
        />
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto max-w-[280px] md:max-w-full">
        <table className="min-w-full">
          <thead>
            <tr className={headerStyle}>
              <th className={tableCellStyle}>Name</th>
              <th className={tableCellStyle}>ID</th>
              <th className={tableCellStyle}>GPA</th>
              <th className={tableCellStyle}>Department</th>
              <th className={tableCellStyle}>Semester</th>
              <th className={tableCellStyle}>Squad</th>
              <th className={tableCellStyle}>Year Work</th>
              {(role === "Professor" || role === "Admin") && (
                <th className={tableCellStyle}>Action</th>
              )}
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredData?.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.user_id} className={rowStyle}>
                  <td className={tableCellStyle}>{item.first_name}</td>
                  <td className={tableCellStyle}>{item.user_id}</td>
                  <td className={tableCellStyle}>{item.GPA}</td>
                  <td className={tableCellStyle}>{item.department}</td>
                  <td className={tableCellStyle}>{item.semester}</td>
                  <td className={tableCellStyle}>{item.squad}</td>
                  <td className={tableCellStyle}>{item.year_work}</td>

                  {/* Professor Action */}
                  {role === "Professor" && (
                    <td className={tableCellStyle}>
                      <Link
                        to={`/professor/grades/${item.user_id}`}
                        state={{
                          semester_number: item.semester,
                          squad_number: item.squad,
                        }}
                        className={professorLinkStyle}
                        aria-label={`Add grades for ${item.first_name}`}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Grades
                      </Link>
                    </td>
                  )}

                  {/* Admin Action */}
                  {role === "Admin" && (
                    <td className={tableCellStyle}>
                      <Link
                        to={`/admin/grades/${item.user_id}`}
                        state={{
                          semester_number: item.semester,
                          squad_number: item.squad,
                        }}
                        className={adminLinkStyle}
                        aria-label={`View details for ${item.first_name}`}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Show Details
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={role === "Professor" || role === "Admin" ? 8 : 7}
                  className="p-4 text-center"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
