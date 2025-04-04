import {
  faBook,
  faTasks,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
const Statistics = () => {
  //Styles
  const statsContainerStyle1 =
    "p-6 bg-white rounded-lg shadow text-center h-fit";
  const h2Style = "text-xl font-semibold";
  const pStyle = "text-3xl font-bold border-b-2 w-fit mx-auto pb-1";
  const { data } = useSelector((state) => state.profDashboard);
  return (
    <div className="grid grid-cols-1 col-span-3 gap-6 md:grid-cols-4 h-fit">
      {/* courses numbers*/}
      <div className={statsContainerStyle1}>
        <div>
          <FontAwesomeIcon icon={faBook} className="text-3xl text-blue-500 " />
          <h2 className={h2Style}>Courses</h2>
        </div>
        <p className={`${pStyle} border-blue-500`}>
          {data?.courses.Courses_Number}
        </p>
      </div>
      {/*total student*/}
      <div className={statsContainerStyle1}>
        <div>
          <FontAwesomeIcon
            icon={faUserGraduate}
            className="text-3xl text-green-500 "
          />
          <h2 className={h2Style}>Students</h2>
        </div>
        <p className={`${pStyle} border-green-500`}>
          {data?.number_students.total_number_students}
        </p>
      </div>
      {/*count assigned tasks*/}
      <div className={statsContainerStyle1}>
        <div>
          <FontAwesomeIcon
            icon={faTasks}
            className="text-3xl text-yellow-500"
          />
          <h2 className={h2Style}>Assignments</h2>
        </div>
        <p className={`${pStyle} border-yellow-500`}>
          {data?.assigned_tasks?.assigned_tasks}
        </p>
      </div>
      {/*count submited tasks*/}
      <div className={statsContainerStyle1}>
        <div>
          <FontAwesomeIcon
            icon={faTasks}
            className="text-3xl text-yellow-500"
          />
          <h2 className={h2Style}>Assignments submit</h2>
        </div>
        <p className={`${pStyle} border-yellow-500`}>
          {data?.submited_tasks?.submited_tasks}
        </p>
      </div>
    </div>
  );
};

export default Statistics;
