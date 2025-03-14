import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUserGraduate,
  faChalkboardTeacher,
  faBell,
  faClock,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import ProfessorAndAdminDataSection from "../../components/ProfessorAndAdminDataSection";

const Dashboard = () => {
  // Styles
  const statsContainerStyle1 =
    "p-6 bg-white rounded-lg shadow text-center h-fit";
  const h2Style = "text-xl font-semibold";
  const pStyle = "text-3xl font-bold border-b-2 w-fit mx-auto pb-1";
  const liStyle = "flex items-center";

  // Mock data
  const topStudents = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", gpa: 3.8 },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", gpa: 3.9 },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      gpa: 3.7,
    },
    { id: 4, name: "Bob Brown", email: "bob.brown@example.com", gpa: 3.6 },
    {
      id: 5,
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      gpa: 3.5,
    },
    { id: 6, name: "Eva Green", email: "eva.green@example.com", gpa: 3.9 },
    { id: 7, name: "Frank White", email: "frank.white@example.com", gpa: 3.4 },
    { id: 8, name: "Grace Black", email: "grace.black@example.com", gpa: 3.8 },
    { id: 9, name: "Henry Blue", email: "henry.blue@example.com", gpa: 3.3 },
    { id: 10, name: "Ivy Yellow", email: "ivy.yellow@example.com", gpa: 3.9 },
  ];

  const latestNotifications = [
    { id: 1, message: "New course added: Advanced Mathematics" },
    { id: 2, message: "Reminder: Submit grades by Friday" },
    { id: 3, message: "System maintenance scheduled for Sunday" },
  ];

  return (
    <>
      <ProfessorAndAdminDataSection />
      <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-3">
        {/* Statistics and table */}
        <div className="col-span-2">
          {/* Statistics */}
          <div className="grid grid-cols-1 col-span-2 gap-6 md:grid-cols-3 h-fit">
            <div className={statsContainerStyle1}>
              <div>
                <FontAwesomeIcon
                  icon={faBook}
                  className="text-3xl text-blue-500 "
                />
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

          {/* Top Students Table */}
          <div className="p-3 mt-5 bg-white rounded-lg shadow md:p-6">
            <h2 className={`${h2Style} mb-4`}>Top 10 Students</h2>
            <div className="overflow-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {topStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.id}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">{student.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notifications and Recent Activities */}
        <div>
          {/* Notifications */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon
                icon={faBell}
                className="mr-4 text-3xl text-blue-500"
              />
              <h2 className={h2Style}>Latest Notifications</h2>
            </div>
            <ul className="space-y-2">
              {latestNotifications.map((notification) => (
                <li key={notification.id} className={liStyle}>
                  <FontAwesomeIcon
                    icon={faBell}
                    className="mr-2 text-blue-500"
                  />
                  {notification.message}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Activities */}
          <div className="p-6 mt-5 bg-white rounded-lg shadow">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon
                icon={faClock}
                className="mr-4 text-3xl text-blue-500"
              />
              <h2 className={h2Style}>Recent Activities</h2>
            </div>
            <ul className="space-y-2">
              <li className={liStyle}>
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="mr-2 text-green-500"
                />
                User John Doe added a new course.
              </li>
              <li className={liStyle}>
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="mr-2 text-blue-500"
                />
                Professor Jane updated grades for Course CS101.
              </li>
              <li className={liStyle}>
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="mr-2 text-yellow-500"
                />
                Student Alice registered for Course MATH202.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
