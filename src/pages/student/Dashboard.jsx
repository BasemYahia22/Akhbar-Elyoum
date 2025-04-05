import UserDataSection from "../../components/UserDataSection";
import FilterSection from "../../components/FilterSection";
import SemesterGrades from "../../components/SemesterGrades";
import GradeGuide from "../../components/GradeGuide";
import UniversitySchedule from "../../components/UniversitySchedule";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchStudentHomepage } from "../../redux/slices/studentHomepageSlice";
import StatusMessage from "../../components/StatusMessage";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.studentHomepage
  );
  // Fetch student homepage data on component mount
  useEffect(() => {
    if (!data) {
      dispatch(fetchStudentHomepage());
    }
  }, [dispatch, data]);
  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }
  return (
    <div>
      <UserDataSection />
      <div className="grid gap-5 mt-5 lg:gap-3 lg:grid-cols-2">
        <div>
          <FilterSection />
          <SemesterGrades />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:gap-3">
          <GradeGuide />
          <UniversitySchedule />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
