import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CreateCourseModal = ({ isOpen, onClose, onSubmit, course }) => {
  const [formData, setFormData] = useState(
    course || {
      name: "",
      courseCode: "",
      instructor: "",
      semester: "",
      year: "",
      courseHours: "",
    }
  );

  const inputStyle = "w-full p-2 border rounded-lg focus:outline-none";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-2xl p-6 bg-white rounded-lg shadow-lg">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Course Name"
            value={formData.name}
            onChange={handleChange}
            className={inputStyle}
            required
          />
          <input
            type="text"
            name="courseCode"
            placeholder="Course Code"
            value={formData.courseCode}
            onChange={handleChange}
            className={inputStyle}
            required
          />
          <input
            type="text"
            name="instructor"
            placeholder="Instructor"
            value={formData.instructor}
            onChange={handleChange}
            className={inputStyle}
            required
          />
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className={inputStyle}
            required
          >
            <option value="">Select Semester</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className={inputStyle}
            required
          />
          <input
            type="number"
            name="courseHours"
            placeholder="Course Hours"
            value={formData.courseHours}
            onChange={handleChange}
            className={inputStyle}
            required
          />
          <div className="flex justify-end space-x-2">
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
