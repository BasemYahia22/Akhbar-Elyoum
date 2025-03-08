const GradeGuide = () => {
  const grades = [
    { char: "A+", point: 4.0, description: "Very Good", range: "90 - 100" },
    { char: "A", point: 4.0, description: "Very Good", range: "85 - 89" },
    { char: "B", point: 3.3, description: "Good", range: "75 - 84" },
    { char: "C", point: 2.3, description: "Satisfactory", range: "65 - 74" },
    { char: "D", point: 1.0, description: "Passing", range: "50 - 64" },
    { char: "F", point: 0.0, description: "Fail", range: "0 - 49" },
  ];
  const spanStyle = "w-10 text-lg font-crimson-text-bold text-primary";
  return (
    <div className="w-full p-4 mx-auto font-sans bg-white rounded-md shadow-md lg:max-w-xs">
      <h2 className="mb-4 text-xl font-bold text-center">Grade Symbol Guide</h2>
      <div className="space-y-3">
        {grades.map((grade, index) => (
          <div key={index} className="px-3 bg-gray-100 rounded-md ">
            <div className="flex items-center justify-between py-2 border-b">
              <span className={spanStyle}>{grade.char}</span>
              <span className={spanStyle}>{grade.point}</span>
              <span className="text-gray-400 ">{grade.description}</span>
            </div>
            <div className="py-2 text-gray-400">
              <span>{grade.range} </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeGuide;
