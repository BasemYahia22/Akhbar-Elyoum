import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faEye,
  faEyeSlash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import CreateCourseModal from "./CreateCourseModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../redux/slices/fetchCoursesSlice";
import { toggleCourseStatus } from "../../redux/slices/toggleCourseStatusSlice";
import Message from "../../components/Message";
import { addAndUpdateCourse } from "../../redux/slices/addAndUpdateCourseSlice";
import StatusMessage from "../../components/StatusMessage";
import { fetchProfessorInfo } from "../../redux/slices/fetchProfessorInfoSlice";
const CourseManagement = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { data, loading, error } = useSelector((state) => state.fetchCourses);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const inputStyle =
    "p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Add or update a course
  const handleSubmit = (operation, credentials) => {
    if (operation === "add") {
      dispatch(addAndUpdateCourse({ operation, credentials }))
        .unwrap()
        .then(() => {
          showMessage("added course Successfully!", "success");
          dispatch(fetchCourses());
        })
        .catch((error) => {
          showMessage(error, "error");
        });
    } else {
      dispatch(addAndUpdateCourse({ operation, credentials }))
        .unwrap()
        .then(() => {
          showMessage("updated course Successfully!", "success");
          dispatch(fetchCourses());
        })
        .catch((error) => {
          showMessage(error, "error");
        });
    }
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Toggle active state of a course
  const toggleCourseActive = (id, course_status) => {
    const credentials = {
      course_id: id,
      course_status: course_status === 1 ? 0 : 1,
    };
    console.log(credentials);
    dispatch(toggleCourseStatus(credentials))
      .unwrap()
      .then(() => {
        showMessage("Your Toggle Submited Successfully!", "success");
        dispatch(fetchCourses());
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  };
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };
  // Filter courses by name
  const filteredCourses = data?.course_management_data?.filter((course) =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!data) {
      dispatch(fetchCourses());
      dispatch(fetchProfessorInfo());
    }
  }, [dispatch, data]);
  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Course Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col items-center justify-between mb-6 space-y-4 md:flex-row md:space-y-0">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputStyle} w-full pl-10 `}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-2 text-white rounded-lg bg-third md:w-fit"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Course
        </button>
      </div>

      {/* Course Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg max-w-[18rem] md:max-w-full">
        {filteredCourses?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No courses found. Try adjusting your search or add a new course.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Code</th>
                <th className="p-2">Instructor</th>
                <th className="p-2">Department</th>
                <th className="p-2">Credit Hours</th>
                <th className="p-2">Semester</th>
                <th className="p-2">Squad</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses?.map((course) => {
                const status =
                  course.course_status === 0 ? "Active" : "Inactive";
                return (
                  <tr
                    key={course.course_id}
                    className="text-center border-b hover:bg-gray-50"
                  >
                    <td className="p-2 break-words">{course.course_name}</td>
                    <td className="p-2 break-words">{course.course_code}</td>
                    <td className="p-2 break-words">
                      {course.prof_info?.prof_name || course.prof_name}
                    </td>
                    <td className="p-2 break-words">
                      {course.prof_info?.prof_department || course.department}
                    </td>
                    <td className="p-2">{course.credit_hours}</td>
                    <td className="p-2">{course.semester_number}</td>
                    <td className="p-2">{course.squad_number}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          course.course_status === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
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
                        onClick={() =>
                          toggleCourseActive(
                            course.course_id,
                            course.course_status
                          )
                        }
                        className={`px-2 py-1 text-white rounded-lg ${
                          course.course_status === 0
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={course.course_status === 0 ? faEye : faEyeSlash}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
      {/* Message Component for displaying alerts */}
      {message && (
        <Message
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />
      )}
    </div>
  );
};

export default CourseManagement;
