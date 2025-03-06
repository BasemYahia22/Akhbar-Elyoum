import { useState } from "react";
import CourseCard from "../components/CourseCard";
import aiImage from "../assets/aiImage.jpg";
const courses = [
  {
    id: 1,
    name: "Intro to AI",
    code: "CS400",
    hours: 3,
    prerequisites: "CS350",
    image: aiImage,
  },
  {
    id: 2,
    name: "Web Development",
    code: "CS220",
    hours: 2,
    prerequisites: "CS101",
    image: aiImage,
  },
  {
    id: 3,
    name: "Data Structures",
    code: "CS201",
    hours: 3,
    prerequisites: "CS101",
    image: aiImage,
  },
  {
    id: 4,
    name: "Cyber Security",
    code: "CS450",
    hours: 1,
    prerequisites: "CS201",
    image: aiImage,
  },
  {
    id: 5,
    name: "Machine Learning",
    code: "CS470",
    hours: 3,
    prerequisites: "CS350",
    image: aiImage,
  },
];
const Registration = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleSelect = (id) => {
    setSelectedCourses([...selectedCourses, id]);
  };

  const handleCancel = (id) => {
    setSelectedCourses(selectedCourses.filter((courseId) => courseId !== id));
  };

  return (
    <div className="flex flex-col min-h-screen gap-6 bg-gray-100 lg:gap-10 md:flex-row">
      {/*Sidebar */}
      <div className="h-full p-4 overflow-y-auto bg-white shadow-md md:w-1/4 rounded-xl">
        <div className="flex flex-wrap items-center justify-center gap-6 md:flex-col">
          {["Available", "Semester", "Selected"].map((label, index) => {
            const value =
              label === "Available"
                ? 18
                : label === "Semester"
                ? 18
                : selectedCourses.reduce(
                    (acc, id) => acc + courses.find((c) => c.id === id)?.hours,
                    0
                  );
            return (
              <div key={index} className="flex flex-col items-center">
                <p className="mb-5 text-lg text-primary font-crimson-text-regular">
                  {label} Credit Hours
                </p>
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke={label === "Selected" ? "#FFC756" : "#34D399"}
                      strokeWidth="8"
                      strokeDasharray="314"
                      strokeDashoffset={314 - (value / 18) * 314}
                      fill="none"
                    />
                  </svg>
                  <span className="absolute w-full font-semibold text-center text-black transform -translate-x-1/2 -translate-y-1/2 text- top-1/2 left-1/2">
                    {value} hours
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-lg font-crimson-text-bold text-primary">
          Reg.Approved: <span className="text-[#FFC756]">Pending</span>.
        </p>
        <p className="mt-2 text-lg font-crimson-text-bold text-primary">
          Supervisor:TA/Ahmed Ali
        </p>
        <p className="mt-2 text-sm text-primary">
          Contacts:aliahmed12@gmail.com.
        </p>
        <p className="mt-2 text-gray-600 text-[12px]">
          Note:You Can't Register After Approving.
        </p>
      </div>

      {/* Courses Section */}
      <div className="p-5 overflow-x-auto bg-white md:w-3/4 lg:p-10 rounded-xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-crimson-text-bold">
            Course Registration
          </h1>
          <p className="text-lg font-crimson-text-regular">
            Second Semester 2024-2025
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={selectedCourses.includes(course.id)}
              onSelect={() => handleSelect(course.id)}
              onCancel={() => handleCancel(course.id)}
            />
          ))}
        </div>
        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            className="px-16 py-2 text-black bg-[#E6F1FF] rounded-md font-crimson-text-regular text-lg "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
