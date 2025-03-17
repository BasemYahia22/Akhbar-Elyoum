import React from "react";
import ProfessorAndAdminDataSection from "../../components/ProfessorAndAdminDataSection";
import StudentTable from "../../components/StudentTable";
import Statistics from "../../components/Statistics";
import LastNotifications from "../../components/LastNotifications";

const Dashboard = () => {
  const latestNotifications = [
    { id: 1, message: "New course added: Advanced Mathematics" },
    { id: 2, message: "Reminder: Submit grades by Friday" },
    { id: 3, message: "System maintenance scheduled for Sunday" },
  ];
  return (
    <div>
      <ProfessorAndAdminDataSection />
      <div className="grid grid-cols-1 mt-5 md:gap-6 md:grid-cols-3">
        <div className="col-span-2 mb-5 md:mb-0">
          <Statistics />
          <StudentTable />
        </div>
        <LastNotifications latestNotifications={latestNotifications}/>
      </div>
    </div>
  );
};

export default Dashboard;
