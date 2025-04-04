import { useState, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ScheduleModal = ({ isOpen, onClose, onSubmit, schedule }) => {
  // Form state initialization
  const [formData, setFormData] = useState({
    file_name: "",
    file_path: "",
    department: "",
    squad_number: "",
    semester_id: "",
  });

  // Static dropdown options
  const departmentOptions = [
    "IS",
    "CS",
    "IT",
    "Electrical Engineering",
    "Mechanical Engineering",
  ];
  const squadNumberOptions = [1, 2, 3, 4];
  const semesterOptions = [1, 2];

  // Initialize form when schedule prop changes (edit mode)
  useEffect(() => {
    if (schedule) {
      setFormData({
        file_name: schedule.file_name || "",
        file_path: schedule.file_path || "",
        department: schedule.department || "",
        squad_number: schedule.squad_number?.toString() || "",
        semester_id: schedule.semester_info?.semester_number?.toString() || "",
        id: schedule.id || "",
      });
    }
  }, [schedule]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      squad_number: parseInt(formData.squad_number),
      semester_id: parseInt(formData.semester_id),
    };
    onSubmit(schedule ? "update" : "add", submissionData);
    onClose();
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg w-96">
        {/* Modal header */}
        <div className="flex items-start justify-between">
          <h2 className="mb-4 text-xl font-bold">
            {schedule ? "Update Schedule" : "Add Schedule"}
          </h2>
          <button type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit}>
          {/* File Name Input */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">File Name</label>
            <input
              type="text"
              name="file_name"
              value={formData.file_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* File Upload Input */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">File</label>
            <input
              type="file"
              name="file_path"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required={!schedule}
            />
            {schedule && (
              <p className="mt-1 text-xs text-gray-500">
                Current file: {schedule.file_name || "No file selected"}
              </p>
            )}
          </div>

          {/* Department Dropdown */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Department</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Squad Number Dropdown */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Squad Number
            </label>
            <select
              name="squad_number"
              value={formData.squad_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Squad</option>
              {squadNumberOptions.map((squad) => (
                <option key={squad} value={squad}>
                  {squad}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Dropdown */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Semester Number
            </label>
            <select
              name="semester_id"
              value={formData.semester_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Semester</option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded bg-primary"
            >
              {schedule ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
