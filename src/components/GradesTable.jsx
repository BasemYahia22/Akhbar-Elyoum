import { useSelector } from "react-redux";
import StatusMessage from "./StatusMessage";
const GradesTable = () => {
  const tdStyle =
    "font-crimson-text-bold p-2 sm:p-3 text-center text-base sm:text-lg";
    const thStyle = "p-2 text-sm sm:p-3 sm:text-base";
  // Fetch data from both states
  const homepageState = useSelector((state) => state.studentHomepage);
  const searchState = useSelector((state) => state.searchGrades);
  // Decide which data to use
  const data = searchState.data
    ? searchState.data.grades_data
    : homepageState.data?.Grades_data;
  const loading = searchState.loading || homepageState.loading;
  const error = searchState.error || homepageState.error;

 if (loading || error) {
   return <StatusMessage loading={loading} error={error} />;
 }

  return (
    <div className="p-2 bg-white rounded-lg shadow-md sm:p-3">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className={thStyle}>Course</th>
              <th className={thStyle}>Points</th>
              <th className={thStyle}>Degree</th>
              <th className={thStyle}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((course, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <span className="text-base text-black sm:text-lg font-crimson-text-regular">
                      {course.CourseName}
                    </span>
                    <div className="px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded-md sm:py-0 sm:text-sm w-fit">
                      {course.CourseCode}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md w-fit text-xs sm:text-sm mt-1 ${
                      course.pass_status === "Passed"
                        ? "text-green-600 bg-green-300"
                        : "text-red-600 bg-red-300"
                    }`}
                  >
                    {course.pass_status}
                  </div>
                </td>
                <td className={tdStyle}>{course.points}</td>
                <td className={tdStyle}>{course.Total_grades}</td>
                <td className={tdStyle}>{course.Grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesTable;
