// Displays a table of recent assignments
const RecentAssignments = ({ assignments }) => {
  // Table cell styling
  const thStyle = "p-3 text-left";
  const tdStyle = "p-3";

  return (
    <div className="mt-5">
      <h2 className="mb-4 text-xl font-bold">Recent Assignments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Table header */}
          <thead>
            <tr className="bg-gray-200">
              <th className={thStyle}>Student Name</th>
              <th className={thStyle}>Assignment Name</th>
              <th className={thStyle}>File</th>
            </tr>
          </thead>

          {/* Table body with assignment data */}
          <tbody>
            {assignments?.map((assignment) => (
              <tr key={assignment.assignment_id} className="bg-white border-b">
                <td className={tdStyle}>{assignment.student_name}</td>
                <td className={tdStyle}>{assignment.assignment_name}</td>
                <td className={tdStyle}>{assignment.assignment_link}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAssignments;
