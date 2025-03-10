import React from "react";
import ProfessorDataSection from "../../components/ProfessorDataSection";
import StudentTable from "../../components/StudentTable";

const Dashboard = () => {
  return (
    <div>
      <ProfessorDataSection />
      <StudentTable />
    </div>
  );
};

export default Dashboard;
