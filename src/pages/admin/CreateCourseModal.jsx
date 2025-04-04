import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfessorInfo } from "../../redux/slices/fetchProfessorInfoSlice";

const CreateCourseModal = ({ isOpen, onClose, onSubmit, course }) => {
  // Get professor and course data from Redux store
  const { data, loading, error } = useSelector(
    (state) => state.fetchProfessorInfo
  );
  const dispatch = useDispatch();
console.log(course);
  // Form state management
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    credit_hours: "",
    semester_number: "",
    squad_number: "",
    department: "",
    prof_id: "",
    prerequisite_id: "",
  });

  // CSS class for consistent input styling
  const inputStyle = "w-full p-2 border rounded-lg focus:outline-none";

  // Initialize form with course data when editing
  useEffect(() => {
    if (course) {
      setFormData({
        course_code: course.course_code || "",
        course_name: course.course_name || "",
        credit_hours: course.credit_hours || "",
        semester_number: course.semester_number || "",
        squad_number: course.squad_number || "",
        department: course.department || "",
        prof_id: course.prof_info?.prof_id || "",
        prerequisite_id: course.prerequisite_id || 0,
        course_id: course.course_id || "",
        course_status: course.course_status || "",
        Final_grade: course.Final_grade || 60,
        mitterm_grade: course.mitterm_grade || 30,
        assigments_grades: course.assigments_grades || 20,
        points: course.points || "1",
      });
    } else {
      // Reset form when adding new course
      setFormData({
        course_code: "",
        course_name: "",
        credit_hours: "",
        semester_number: "",
        squad_number: "",
        department: "",
        prof_id: "",
        prerequisite_id: "",
      });
    }
  }, [course]);

  // Fetch professor and course data when component mounts
  useEffect(() => {
    if (!data) {
      dispatch(fetchProfessorInfo());
    }
  }, [dispatch, data]);

  // Show loading/error status if needed
  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data for submission with proper types
    const submissionData = {
      ...formData,
      credit_hours: parseInt(formData.credit_hours),
      semester_number: parseInt(formData.semester_number),
      squad_number: parseInt(formData.squad_number),
      prof_id: parseInt(formData.prof_id),
    };
    // Call parent component's submit handler
    onSubmit(course ? "update" : "add", submissionData);
    onClose(); // Close modal after submission
  };

  // Don't render if modal isn't open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        {/* Modal header with close button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {course ? "Edit Course" : "Add New Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Main form content */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            {/* Course Code */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Course Code *
              </label>
              <input
                type="text"
                name="course_code"
                placeholder="CS-101"
                value={formData.course_code}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            {/* Course Name */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Course Name *
              </label>
              <input
                type="text"
                name="course_name"
                placeholder="Introduction to Programming"
                value={formData.course_name}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            {/* Credit Hours */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Credit Hours *
              </label>
              <input
                type="number"
                name="credit_hours"
                placeholder="3"
                value={formData.credit_hours}
                onChange={handleChange}
                className={inputStyle}
                min="1"
                required
              />
            </div>

            {/* Semester Number */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Semester *
              </label>
              <input
                type="number"
                name="semester_number"
                placeholder="1-8"
                value={formData.semester_number}
                onChange={handleChange}
                className={inputStyle}
                min="1"
                max="8"
                required
              />
            </div>

            {/* Squad Number */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Squad Number *
              </label>
              <input
                type="number"
                name="squad_number"
                placeholder="1"
                value={formData.squad_number}
                onChange={handleChange}
                className={inputStyle}
                min="1"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Department *
              </label>
              <input
                type="text"
                name="department"
                placeholder="Computer Science"
                value={formData.department}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            {/* Professor Select Dropdown */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Professor *
              </label>
              <select
                name="prof_id"
                value={formData.prof_id}
                onChange={handleChange}
                className={inputStyle}
                required
              >
                <option value="">Select Professor</option>
                {data?.prof_info?.map((professor) => (
                  <option key={professor.prof_id} value={professor.prof_id}>
                    {professor.prof_name} ({professor.prof_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Prerequisite Course Select Dropdown */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Prerequisite Course
              </label>
              <select
                name="prerequisite_id"
                value={formData.prerequisite_id}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="0">0</option>
                {data?.courses
                  ?.filter((c) => c.course_code !== formData.course_code) // Exclude current course
                  .map((course) => (
                    <option key={course.course_id} value={course.course_code}>
                      {course.course_name} ({course.course_code})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-lg bg-third"
            >
              {course ? "Update Course" : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;
