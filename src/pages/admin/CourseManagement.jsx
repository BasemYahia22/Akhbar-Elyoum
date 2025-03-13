import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import CreateCourseModal from "./CreateCourseModal";
import courseImage from "../../assets/courseImg.png";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Introduction to Computer Science",
      courseCode: "CS101",
      instructor: "Dr. John Doe",
      semester: "Fall",
      year: 2023,
      img: courseImage,
      courseHours: 3,
      isActive: true,
    },
    {
      id: 2,
      name: "Advanced Mathematics",
      courseCode: "MATH202",
      instructor: "Dr. Jane Smith",
      semester: "Spring",
      year: 2024,
      img: courseImage,
      courseHours: 4,
      isActive: true,
    },
  ]);

  const [filters, setFilters] = useState({
    semester: "",
    year: "",
    instructor: "",
  });
  const inputStyle = "p-2 border rounded-lg focus:outline-none";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Add or update a course
  const handleSubmit = (course) => {
    if (selectedCourse) {
      setCourses(
        courses.map((c) =>
          c.id === selectedCourse.id ? { ...course, id: c.id } : c
        )
      );
    } else {
      setCourses([...courses, { ...course, id: courses.length + 1 }]);
    }
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Delete a course
  const deleteCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  // Toggle active state of a course
  const toggleCourseActive = (id) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, isActive: !course.isActive } : course
      )
    );
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    return (
      (filters.semester === "" || course.semester === filters.semester) &&
      (filters.year === "" || course.year.toString() === filters.year) &&
      (filters.instructor === "" ||
        course.instructor
          .toLowerCase()
          .includes(filters.instructor.toLowerCase()))
    );
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Course Management</h1>

      {/* Filters and Add Button */}
      <div className="flex flex-col items-center justify-between mb-6 space-y-4 md:flex-row md:space-y-0">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <select
            value={filters.semester}
            onChange={(e) =>
              setFilters({ ...filters, semester: e.target.value })
            }
            className={inputStyle}
          >
            <option value="">All Semesters</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>
          <input
            type="number"
            placeholder="Year"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className={inputStyle}
          />
          <input
            type="text"
            placeholder="Instructor"
            value={filters.instructor}
            onChange={(e) =>
              setFilters({ ...filters, instructor: e.target.value })
            }
            className={inputStyle}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-white rounded-lg bg-third"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Course
        </button>
      </div>

      {/* Course Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg max-w-[18rem] md:max-w-full">
        {filteredCourses.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No courses found. Try adjusting your filters or add a new course.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Course Code</th>
                <th className="p-2">Instructor</th>
                <th className="p-2">Semester</th>
                <th className="p-2">Year</th>
                <th className="p-2">Course Hours</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="text-center border-b hover:bg-gray-50"
                >
                  <td className="p-2">
                    <img
                      src={course.img}
                      alt={course.name}
                      className="w-12 h-12 rounded-lg"
                    />
                  </td>
                  <td className="p-2 break-words">{course.name}</td>
                  <td className="p-2 break-words">{course.courseCode}</td>
                  <td className="p-2 break-words">{course.instructor}</td>
                  <td className="p-2">{course.semester}</td>
                  <td className="p-2">{course.year}</td>
                  <td className="p-2">{course.courseHours}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        course.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="flex items-center justify-center gap-2 p-4 md:flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsModalOpen(true);
                      }}
                      className="px-2 py-1 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="px-2 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      onClick={() => toggleCourseActive(course.id)}
                      className={`px-2 py-1 text-white rounded-lg ${
                        course.isActive
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={course.isActive ? faEye : faEyeSlash}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Course Modal */}
      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
        }}
        onSubmit={handleSubmit}
        course={selectedCourse}
      />
    </div>
  );
};

export default CourseManagement;
