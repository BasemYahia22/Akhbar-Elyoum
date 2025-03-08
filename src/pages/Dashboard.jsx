import React from "react";
import UserDataSection from "../components/UserDataSection";
import FilterSection from "../components/FilterSection";
import SemesterGrades from "../components/SemesterGrades";
import GradeGuide from "../components/GradeGuide";
import UniversitySchedule from "../components/UniversitySchedule";

const Dashboard = () => {
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
