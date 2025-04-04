import { useSelector } from "react-redux";
import professorImg from "../assets/Professor.png";

const ProfessorAndAdminDataSection = () => {
  const userRole = useSelector((state) => state.auth.role);
  const userInfo = useSelector((state) => {
    switch (userRole) {
      case "Professor":
        return state.profDashboard?.data?.prof_info;
      case "Admin":
        return state.adminDashboard.data?.admin_info;
      default:
        return null;
    }
  });
  const getUserDisplayName = () => {
    if (userRole === "Professor") {
      return `${userInfo?.FirstName} ${userInfo?.LastName}`;
    }
    return `${userInfo?.admin_name}`;
  };
  const getWelcomeMessage = () => {
    if (userRole === "Professor") {
      return "New teaching assistants have been added to your domain. Please reach out to the Head Teaching Assistant if you want them excluded from your domain.";
    }
    return "Welcome to the admin dashboard. You can manage all system settings and user accounts from here.";
  };
  return (
    <div className="flex items-center justify-between text-white rounded-lg bg-primary">
      <div className="p-3 md:p-8 lg:w-2/3">
        <h1 className="text-2xl md:text-3xl font-crimson-text-semibold">
          Welcome back, {getUserDisplayName()}
        </h1>
        <p className="text-gray-300 md:text-lg font-crimson-text-regular">
          {getWelcomeMessage()}
        </p>
      </div>
      <img src={professorImg} alt="professorImg" className="hidden md:block" />
    </div>
  );
};

export default ProfessorAndAdminDataSection;
