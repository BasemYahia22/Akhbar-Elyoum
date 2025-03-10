import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const StudentTable = () => {
  const [yearFilter, setYearFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([
    {
      id: 1,
      name: "John Doe",
      finalGrade: 85,
      status: "Complete Result",
      year: 2021,
    },
    {
      id: 2,
      name: "Jane Smith",
      finalGrade: 90,
      status: "Complete Result",
      year: 2022,
    },
    {
      id: 3,
      name: "Alice Johnson",
      finalGrade: 78,
      status: "Complete Result",
      year: 2021,
    },
    {
      id: 4,
      name: "Bob Brown",
      finalGrade: 92,
      status: "Review Request",
      year: 2023,
    },
  ]);

  const filteredData = data.filter((item) =>
    yearFilter ? item.year === parseInt(yearFilter) : true
  );

  const sortedData = filteredData.sort((a, b) =>
    sortOrder === "asc"
      ? a.finalGrade - b.finalGrade
      : b.finalGrade - a.finalGrade
  );
  const tdThStyle = "px-4 py-2";
  return (
    <div className="mt-5">
      <div className="flex justify-between mb-4">
        <select
          className="p-2 bg-gray-300 border rounded text-primary"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>
        <select
          className="p-2 bg-gray-300 border rounded text-primary"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort Ascending</option>
          <option value="desc">Sort Descending</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr className="text-lg font-crimson-text-semibold">
              <th className={tdThStyle}>Name</th>
              <th className={tdThStyle}>ID</th>
              <th className={tdThStyle}>Final Grade</th>
              <th className={tdThStyle}>Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {sortedData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className={tdThStyle}>{item.name}</td>
                <td className={tdThStyle}>{item.id}</td>
                <td className={tdThStyle}>{item.finalGrade}</td>
                <td className={tdThStyle}>
                  <Link
                    to="/professor/grades"
                    className={`flex items-center justify-center p-2 rounded ${
                      item.status === "Complete Result"
                        ? " text-green-800"
                        : " text-red-800"
                    }`}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    {item.status}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
