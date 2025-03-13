import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import Scholarcap from "../assets/Scholarcap.png";
import DateDisplay from "./DateDisplay";
const UserDataSection = () => {
  return (
    <div className="px-5 py-5 text-white rounded-lg md:px-10 bg-primary">
      <DateDisplay />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-crimson-text-bold">Welcome back, John!</h1>
        <img src={Scholarcap} alt="Scholarcap" />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-gray-200 md:gap-10">
        <p>ID:2022170300</p>
        <p>GPA:3.2</p>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faDesktop} />
          <p>Computer Science</p>
        </div>
      </div>
    </div>
  );
};

export default UserDataSection;
