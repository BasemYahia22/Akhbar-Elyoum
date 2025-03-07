import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFile,
  faChartLine,
  faTasks,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

const CourseCardWithGrades = ({ course }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className={`w-full p-5 text-white rounded-lg bg-primary transition-all duration-300 ${
        isDropdownOpen ? "h-auto" : "h-40"
      }`}
      style={{
        background: "linear-gradient(to bottom, #003256, #021828)",
      }}
    >
      <div>
        <h2 className="w-full mb-2 text-xl font-crimson-text-semibold">
          {course.name}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-sm mb-4">Instructor: {course.instructor}</p>
          <p className="text-sm mb-4 text-gray-300">{course.prerequisite}</p>
        </div>

        {/* Dropdown for Grades */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="py-1 text-white rounded-full focus:outline-none flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronUp : faChevronDown}
              className="text-sm"
            />
            {isDropdownOpen ? "Hide Grades" : "Show Grades"}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="w-64 text-white rounded-lg mt-2">
              <ul>
                <li className="px-4 py-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faFile} />
                  Midterm Grade: {course.midtermGrade || "N/A"}
                </li>
                <li className="px-4 py-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartLine} />
                  Yearwork Grade: {course.yearworkGrade || "N/A"}
                </li>
                <li className="px-4 py-2">
                  <details>
                    <summary className="cursor-pointer flex items-center gap-2">
                      <FontAwesomeIcon icon={faTasks} />
                      Assignments Grade
                    </summary>
                    <ul className="pl-8 mt-2">
                      {course.assignments.map((assignment, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <span>{assignment.name}:</span>
                          <span>{assignment.grade}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
                <li className="px-4 py-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  Final Grade: {course.finalGrade || "N/A"}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCardWithGrades;
