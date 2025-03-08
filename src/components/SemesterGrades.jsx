import GradesTable from "./GradesTable";
import ProgressData from "./ProgressData";
import TitleGradesSection from "./TitleGradesSection";
const SemesterGrades = () => {
  return (
    <div className="p-3 mt-5 bg-white rounded-lg">
      <TitleGradesSection />
      <GradesTable />
      <ProgressData />
    </div>
  );
};

export default SemesterGrades;
