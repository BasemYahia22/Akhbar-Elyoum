import {
  faBook,
  faChalkboardTeacher,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Statistics = () => {
  // Styles
  const statsContainerStyle1 =
    "p-6 bg-white rounded-lg shadow text-center h-fit";
  const h2Style = "text-xl font-semibold";
  const pStyle = "text-3xl font-bold border-b-2 w-fit mx-auto pb-1";
  return (
    <div className="grid grid-cols-1 col-span-2 gap-6 md:grid-cols-3 h-fit">
      <div className={statsContainerStyle1}>
        <div>
          <FontAwesomeIcon icon={faBook} className="text-3xl text-blue-500 " />
          <h2 className={h2Style}>Courses</h2>
        </div>
        <p className={`${pStyle} border-blue-500`}>56</p>
      </div>
      <div className={statsContainerStyle1}>
        <div>
          <FontAwesomeIcon
            icon={faUserGraduate}
            className="text-3xl text-green-500 "
          />
          <h2 className={h2Style}>Students</h2>
        </div>
        <p className={`${pStyle} border-green-500`}>1234</p>
      </div>
      <div className={statsContainerStyle1}>
        <div>
          <FontAwesomeIcon
            icon={faChalkboardTeacher}
            className="text-3xl text-yellow-500 "
          />
          <h2 className={h2Style}>Classes</h2>
        </div>
        <p className={`${pStyle} border-yellow-500`}>45</p>
      </div>
    </div>
  );
};

export default Statistics;
