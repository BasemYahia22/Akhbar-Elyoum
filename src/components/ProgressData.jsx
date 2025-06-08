import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";

const ProgressData = () => {

    const { data} = useSelector(
      (state) => state.studentHomepage
    );
console.log(data);
  // Data for the circular progress bars
  const progressData = [
    {
      title: "Registered Hours",
      value: data?.credit_hours, // Current registered hours
      max: 18, // Maximum registered hours
      year: "2024 - 2025",
      color: "#003256", // Blue
      text: (value) => `${value} Hours`, // Display format
    },
    {
      title: "CGPA : A-",
      value: data?.CGPA, // Current GPA
      max: 4, // Maximum GPA
      year: "2024 - 2025",
      color: "#003256", // Green
      text: (value) => `${value}`, // Display format
    },
    {
      title: "Acc Registered Hours",
      value: data?.Accumulated_Registered_Hours, // Accumulated registered hours
      max: 144, // Maximum accumulated hours (optional)
      year: "2024 - 2025",
      color: "#003256", // Purple
      text: (value) => `${value} Hours`, // Display format
    },
  ];

  return (
    <div className="flex flex-wrap justify-between gap-3 mt-8 lg:justify-normal">
      {progressData.map((item, index) => (
        <div
          key={index}
          className="flex flex-col-reverse justify-between gap-3 p-2 mb-3 rounded-md shadow-md md:flex-row"
        >
          <div>
            <div className="mt-2 text-sm">{item.title}</div>
            <div className="text-xs text-gray-500">{item.year}</div>
          </div>
          <div style={{ width: 50, height: 50, margin: "0 auto" }}>
            <CircularProgressbar
              value={(item.value / item.max) * 100} // Convert to percentage
              text={item.text(item.value, item.max)} // Display custom text
              styles={buildStyles({
                pathColor: item.color, // Color of the progress bar
                textColor: item.color, // Color of the text
                textSize: "20px", // Size of the text
                trailColor: "#e5e7eb", // Color of the trail (background)
              })}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressData;
