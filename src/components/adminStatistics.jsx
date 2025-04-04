import {
  faBook,
  faUserGraduate,
  faUserTie,
  faCheckCircle,
  faTimesCircle,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const AdminStatistics = () => {
  // Styles for the component
  const statsContainerStyle =
    "p-6 bg-white rounded-lg shadow text-center h-fit";
  const h2Style = "text-xl font-semibold"; // Style for heading
  const pStyle = "text-3xl font-bold border-b-2 w-fit mx-auto pb-1"; // Style for numbers

  // Get data from Redux store
  const { data } = useSelector((state) => state.adminDashboard);

  return (
    <div className="grid grid-cols-1 col-span-3 gap-6 md:grid-cols-3 h-fit">
      {/* Total Students Card */}
      <div className={statsContainerStyle}>
        <div>
          <FontAwesomeIcon
            icon={faUserGraduate}
            className="text-3xl text-green-500"
          />
          <h2 className={h2Style}>Total Students</h2>
        </div>
        <p className={`${pStyle} border-green-500`}>
          {data?.cards.total_students || 0}
        </p>
      </div>

      {/* Registered Students Card */}
      <div className={statsContainerStyle}>
        <div>
          <FontAwesomeIcon
            icon={faUserCheck}
            className="text-3xl text-blue-500"
          />
          <h2 className={h2Style}>Registered Students</h2>
        </div>
        <p className={`${pStyle} border-blue-500`}>
          {data?.cards.total_registered_students || 0}
        </p>
      </div>

      {/* Students Passed Card */}
      <div className={statsContainerStyle}>
        <div>
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-3xl text-emerald-500"
          />
          <h2 className={h2Style}>Students Passed</h2>
        </div>
        <p className={`${pStyle} border-emerald-500`}>
          {data?.cards.students_passed || 0}
        </p>
      </div>

      {/* Students Failed Card */}
      <div className={statsContainerStyle}>
        <div>
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="text-3xl text-red-500"
          />
          <h2 className={h2Style}>Students Failed</h2>
        </div>
        <p className={`${pStyle} border-red-500`}>
          {data?.cards.students_failed || 0}
        </p>
      </div>

      {/* Total Courses Card */}
      <div className={statsContainerStyle}>
        <div>
          <FontAwesomeIcon icon={faBook} className="text-3xl text-purple-500" />
          <h2 className={h2Style}>Total Courses</h2>
        </div>
        <p className={`${pStyle} border-purple-500`}>
          {data?.cards.total_courses || 0}
        </p>
      </div>

      {/* Total Professors Card */}
      <div className={statsContainerStyle}>
        <div>
          <FontAwesomeIcon
            icon={faUserTie}
            className="text-3xl text-amber-500"
          />
          <h2 className={h2Style}>Total Professors</h2>
        </div>
        <p className={`${pStyle} border-amber-500`}>
          {data?.cards.total_professors || 0}
        </p>
      </div>
    </div>
  );
};

export default AdminStatistics;
