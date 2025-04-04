import ProfessorAndAdminDataSection from "../../components/ProfessorAndAdminDataSection";
import LastNotifications from "../../components/LastNotifications";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminDashboard } from "../../redux/slices/adminDashboardSlice";
import AdminStatistics from "../../components/adminStatistics";
import UniversityInfo from "../../components/UniversityInfo";
import StatusMessage from "../../components/StatusMessage";

const Dashboard = () => {
  // Styles;
  const h2Style = "text-xl font-semibold";
  const thStyle = "p-2 text-left";
  const tdStyle = "p-2";
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.adminDashboard);

  // Fetch student homepage data on component mount
  useEffect(() => {
    if (!data) {
      dispatch(fetchAdminDashboard());
    }
  }, [dispatch, data]);
  console.log(data);
  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <>
      <ProfessorAndAdminDataSection />
      <div className="grid grid-cols-1 gap-6 mt-5 lg:grid-cols-3">
        {/* Statistics and table */}
        <div className="lg:col-span-2">
          <AdminStatistics />
          {/* Top Students Table */}
          <div className="p-3 mt-5 text-center bg-white rounded-lg shadow md:p-6">
            <h2 className={`${h2Style} mb-4`}>Top Students</h2>
            <div className="overflow-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className={thStyle}>Name</th>
                    <th className={thStyle}>Squad Number</th>
                    <th className={thStyle}>Department</th>
                    <th className={thStyle}>Semester</th>
                    <th className={thStyle}>GPA</th>
                    <th className={thStyle}>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.students_grades_top_ten?.map((student) => (
                    <tr
                      key={student?.student_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className={tdStyle}>{student.student_name}</td>
                      <td className={tdStyle}>{student.Squad_number}</td>
                      <td className={tdStyle}>{student.department}</td>
                      <td className={tdStyle}>{student.semester_number}</td>
                      <td className={tdStyle}>{student.GPA}</td>
                      <td className={tdStyle}>
                        {student.total_regsiter_hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Notifications Section - UniversityInfo */}
        <div className="lg:col-span-1 xl:col-span-1 xl:col-start-3 xl:row-start-1">
          <LastNotifications latestNotifications={data?.notifications} />
          <UniversityInfo />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
