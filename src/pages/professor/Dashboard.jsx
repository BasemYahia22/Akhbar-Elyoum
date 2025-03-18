import { useState } from "react";
import ProfessorAndAdminDataSection from "../../components/ProfessorAndAdminDataSection";
import Statistics from "../../components/Statistics";
import LastNotifications from "../../components/LastNotifications";
import RecentAssignments from "../../components/RecentAssignments";
import UniversityInfo from "../../components/UniversityInfo";

const Dashboard = () => {
  const latestNotifications = [
    { id: 1, message: "New course added: Advanced Mathematics" },
    { id: 2, message: "Reminder: Submit grades by Friday" },
    { id: 3, message: "System maintenance scheduled for Sunday" },
  ];
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      studentName: "John Doe",
      assignmentName: "Math Homework",
      file: "math_hw.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "A",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      assignmentName: "Science Project",
      file: "science_project.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "B+",
    },
    {
      id: 3,
      studentName: "Alice Johnson",
      assignmentName: "History Essay",
      file: "history_essay.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "",
    },
    {
      id: 4,
      studentName: "Bob Brown",
      assignmentName: "Physics Lab Report",
      file: "physics_lab.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "A-",
    },
    {
      id: 5,
      studentName: "Charlie Davis",
      assignmentName: "Chemistry Quiz",
      file: "chemistry_quiz.pdf",
      squad: "third year",
      department: "computer science",
      semester: 2,
      degree: "C",
    },
  ]);

  return (
    <div>
      <ProfessorAndAdminDataSection />
      <div className="grid grid-cols-1 mt-5 md:gap-6 md:grid-cols-3">
        <div className="col-span-2 mb-5 md:mb-0">
          <Statistics />
          <RecentAssignments assignments={assignments} />
        </div>
        <div>
          <LastNotifications latestNotifications={latestNotifications} />
          <UniversityInfo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
