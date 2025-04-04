import { useSelector } from "react-redux";
import Graduationcap from "../assets/Graduationcap.png";
const TitleGradesSection = () => {
  const { data } = useSelector((state) => state.studentHomepage);
  return (
    <div
      className="flex items-center justify-center gap-5 p-2 text-center text-white rounded-lg"
      style={{
        background: "linear-gradient(to bottom, #003256, #021828)",
      }}
    >
      <img src={Graduationcap} alt="Graduationcap" />
      <div>
        <h1 className="text-2xl font-crimson-text-bold">
          Current Semester Grades
        </h1>
        <h2 className="text-lg font-crimson-text-regular">
          {data?.Semester_info?.semester_name}{" "}
          {data?.Semester_info?.semester_year_range}
        </h2>
      </div>
    </div>
  );
};

export default TitleGradesSection;
