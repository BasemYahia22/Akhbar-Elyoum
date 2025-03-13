import professorImg from "../assets/Professor.png";

const ProfessorAndAdminDataSection = () => {
  return (
    <div className="flex items-center justify-between text-white rounded-lg bg-primary">
      <div className="p-3 md:p-8 lg:w-2/3">
        <h1 className="text-2xl md:text-3xl font-crimson-text-semibold">
          Welcome back, Smith Johnson
        </h1>
        <p className="text-gray-300 md:text-lg font-crimson-text-regular">
          You have 27 new student added to your domain. Please reach out to the
          Head Teaching Assistant if you want them excluded from your domain.
        </p>
      </div>
      <img src={professorImg} alt="professorImg" className="hidden md:block" />
    </div>
  );
};

export default ProfessorAndAdminDataSection;
