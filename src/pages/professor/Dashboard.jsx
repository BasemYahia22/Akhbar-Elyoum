import { useEffect } from "react";
import ProfessorAndAdminDataSection from "../../components/ProfessorAndAdminDataSection";
import Statistics from "../../components/Statistics";
import LastNotifications from "../../components/LastNotifications";
import RecentAssignments from "../../components/RecentAssignments";
import UniversityInfo from "../../components/UniversityInfo";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfDashboard } from "../../redux/slices/profDashboardSlice";
import StatusMessage from "../../components/StatusMessage";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.profDashboard);
  // Fetch student homepage data on component mount
  useEffect(() => {
    if (!data) {
      dispatch(fetchProfDashboard());
    }
  }, [dispatch, data]);
  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }
  return (
    <div>
      <ProfessorAndAdminDataSection />
      <div className="grid grid-cols-1 mt-5 md:gap-6 md:grid-cols-3">
        <Statistics />
        <div className="col-span-3 mb-5 md:col-span-2 md:mb-0">
          <RecentAssignments assignments={data?.recent_assigments} />
        </div>
        <div>
          <LastNotifications latestNotifications={data?.recent_notifications} />
          <UniversityInfo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
