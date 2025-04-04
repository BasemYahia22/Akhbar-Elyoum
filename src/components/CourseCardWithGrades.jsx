import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFile,
  faChartLine,
  faTasks,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

// Collapsible card showing course grades
const CourseCardWithGrades = ({ course }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div
      className={`w-full p-5 text-white rounded-lg bg-primary transition-all duration-300 ${
        isDropdownOpen ? "h-auto" : "h-40"
      }`}
      style={{
        background: "linear-gradient(to bottom, #003256, #021828)",
      }}
    >
      {/* Course header */}
      <div>
        <h2 className="w-full mb-2 text-xl font-crimson-text-semibold">
          {course.course_name}
        </h2>
        <div className="flex items-center justify-between">
          <p className="mb-4 text-sm">Instructor: {course.prof_name}</p>
          <p className="mb-4 text-sm">{course.course_code}</p>
        </div>

        {/* Grades dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 py-1 text-white rounded-full focus:outline-none"
            aria-expanded={isDropdownOpen}
          >
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronUp : faChevronDown}
              className="text-sm"
            />
            {isDropdownOpen ? "Hide Grades" : "Show Grades"}
          </button>

          {isDropdownOpen && (
            <div className="w-64 mt-2 text-white rounded-lg">
              <ul>
                <li className="flex items-center gap-2 px-4 py-2">
                  <FontAwesomeIcon icon={faFile} />
                  Midterm Grade: {course.grades.midterm_grade || "N/A"}
                </li>

                <li className="flex items-center gap-2 px-4 py-2">
                  <FontAwesomeIcon icon={faChartLine} />
                  Yearwork Grade: {course.grades.year_work || "N/A"}
                </li>

                <li className="px-4 py-2">
                  <details open>
                    <summary className="flex items-center gap-2 cursor-pointer">
                      <FontAwesomeIcon icon={faTasks} />
                      Assignments Grade
                    </summary>
                    <ul className="pl-8 mt-2">
                      {course?.assignments_info?.assignments?.map(
                        (assignment, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span>{assignment.assignment_name}:</span>
                            <span>{assignment.grade}</span>
                          </li>
                        )
                      )}
                      <li>
                        Total:{" "}
                        {course?.assignments_info?.total_assignment_grade}
                      </li>
                    </ul>
                  </details>
                </li>

                <li className="flex items-center gap-2 px-4 py-2">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  Final Grade: {course.grades.total_degree || "N/A"}
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
