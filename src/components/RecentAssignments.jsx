import React from "react";

const RecentAssignments = ({ assignments }) => {
  const thStyle = "p-3 text-left";
  const tdStyle = "p-3";
  return (
    <div className="mt-5">
      <h2 className="mb-4 text-xl font-bold">Recent 5 Assignments</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className={thStyle}>Student Name</th>
            <th className={thStyle}>Assignment Name</th>
            <th className={thStyle}>File</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id} className="bg-white border-b">
              <td className={tdStyle}>{assignment.studentName}</td>
              <td className={tdStyle}>{assignment.assignmentName}</td>
              <td className={tdStyle}>{assignment.file}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentAssignments;
