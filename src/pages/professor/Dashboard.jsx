import React from "react";
import ProfessorAndAdminDataSection from "../../components/ProfessorAndAdminDataSection";
import StudentTable from "../../components/StudentTable";

const Dashboard = () => {
  return (
    <div>
      <ProfessorAndAdminDataSection />
      <StudentTable />
    </div>
  );
};

export default Dashboard;
