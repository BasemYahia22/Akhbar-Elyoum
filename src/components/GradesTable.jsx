const GradesTable = () => {
  // Sample data for the table
  const gradesData = [
    {
      courseName: "Artificial Intelligence",
      courseCode: "CS350",
      points: 3,
      degree: 85,
      grade: "A",
      status: "Passed",
    },
    {
      courseName: "Physics",
      courseCode: "PHYS101",
      points: 4,
      degree: 72,
      grade: "B",
      status: "Passed",
    },
    {
      courseName: "Chemistry",
      courseCode: "CHEM101",
      points: 3,
      degree: 58,
      grade: "F",
      status: "Failed",
    },
  ];
  const tdStyle = "font-crimson-text-bold p-3 text-center text-lg";

  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[300px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Course</th>
              <th className="p-3">Points</th>
              <th className="p-3">Degree</th>
              <th className="p-3">Grade</th>
            </tr>
          </thead>
          <tbody>
            {gradesData.map((course, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">
                  <div className="flex items-center justify-between text-lg text-black font-crimson-text-regular">
                    {course.courseName}
                    <div className="px-2 space-x-3 text-sm text-gray-400 bg-gray-100 rounded-md">
                      {course.courseCode}
                    </div>
                  </div>
                  <div
                    className={`px-2 rounded-md w-fit text-sm ${
                      course.status === "Passed"
                        ? "text-green-600 bg-green-300"
                        : "text-red-600 bg-red-300"
                    }`}
                  >
                    {course.status}
                  </div>
                </td>
                <td className={tdStyle}>{course.points}</td>
                <td className={tdStyle}>{course.degree}</td>
                <td className={tdStyle}>{course.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesTable;
