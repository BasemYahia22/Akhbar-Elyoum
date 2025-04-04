import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import Scholarcap from "../assets/Scholarcap.png";
import DateDisplay from "./DateDisplay";
import { useSelector } from "react-redux";

const UserDataSection = () => {
  const { data } = useSelector((state) => state.studentHomepage);

  // Check if data is available
  if (!data) {
    return (
      <div className="px-5 py-5 text-white rounded-lg md:px-10 bg-primary">
        <DateDisplay />
        <p className="text-2xl font-crimson-text-bold">Loading user data...</p>
      </div>
    );
  }

  // Destructure data for easier access
  const { user_info, student_data } = data;

  return (
    <div className="px-5 py-5 text-white rounded-lg md:px-10 bg-primary">
      <DateDisplay />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-crimson-text-bold">
          Welcome back, {user_info?.FirstName} {user_info?.LastName}
        </h1>
        <img src={Scholarcap} alt="Scholarcap" />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-gray-200 md:gap-10">
        <p>Student Code: {student_data?.std_code}</p>
        <p>GPA: {data?.GPA}</p>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faDesktop} />
          <p>{student_data?.Major}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDataSection;
