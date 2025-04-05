import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AddAssignmentModal = ({
  isOpen,
  onClose,
  onAddAssignment,
  onEditAssignment,
  assignmentToEdit,
  coursesInfo = [],
}) => {
  // State management
  const [formData, setFormData] = useState({
    assignment_name: "",
    course_code: "",
    file_upload_link: "",
    squad_number: "",
    department: "",
    semester_number: "",
    description: "",
    assignment_date: "",
  });
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Style variables
  const modalContainerStyle =
    "fixed inset-0 z-20 flex items-center justify-center p-5 bg-black bg-opacity-50 md:p-0";
  const modalContentStyle =
    "p-6 bg-white rounded-lg max-w-[28rem] lg:mt-10 md:mt-16 mt-10 w-full md:max-w-2xl";
  const inputStyle = "w-full p-2 bg-gray-100 focus:outline-none";
  const labelStyle = "my-auto text-2xl font-crimson-text-regular";
  const selectStyle = `${inputStyle} appearance-none`;
  const errorStyle = "p-4 mb-4 text-red-700 bg-red-100 rounded-lg";
  const cancelButtonStyle =
    "px-8 py-1 mr-2 text-black border border-black rounded-lg";
  const submitButtonStyle = "px-10 py-1 text-white rounded-lg bg-third";
  const formRowStyle = "mb-4 md:flex md:gap-4";
  const formColumnStyle = "mb-4 md:w-1/2 md:mb-0";

  // Handle course selection
  const handleCourseChange = (e) => {
    const selectedCourseCode = e.target.value;
    const selectedCourse = coursesInfo.find(
      (course) => course.course_code === selectedCourseCode
    );

    setFormData((prev) => ({
      ...prev,
      course_code: selectedCourseCode,
      department: selectedCourse?.department || "",
      semester_number: selectedCourse?.semester_number || "",
      squad_number: selectedCourse?.squad_number || "",
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file_upload_link: file
        ? URL.createObjectURL(file)
        : assignmentToEdit?.file_link || "",
    }));
  };

  // Update form when assignmentToEdit changes
  useEffect(() => {
    if (assignmentToEdit) {
      setIsEditing(true);
      setFormData({
        assignment_name: assignmentToEdit.assignment_name || "",
        course_code: assignmentToEdit.course_code || "",
        file_upload_link: assignmentToEdit.file_link || "",
        squad_number: assignmentToEdit.squad_number || "",
        department: assignmentToEdit.department || "",
        semester_number: assignmentToEdit.semester_number || "",
        description: assignmentToEdit.description || "",
        assignment_date: assignmentToEdit.deadline || "",
      });
    } else {
      setIsEditing(false);
      setFormData({
        assignment_name: "",
        course_code: "",
        file_upload_link: "",
        squad_number: "",
        department: "",
        semester_number: "",
        description: "",
        assignment_date: "",
      });
    }
    setFileInputKey(Date.now());
  }, [assignmentToEdit]);

  // Handle form submission
  const handleSubmit = () => {
    const {
      assignment_name,
      course_code,
      file_upload_link,
      squad_number,
      department,
      semester_number,
      description,
      assignment_date,
    } = formData;

    // Validation
    if (
      !assignment_name ||
      !course_code ||
      !squad_number ||
      !department ||
      !semester_number ||
      !description ||
      !assignment_date
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!isEditing && !file_upload_link) {
      setError("Please select a file for the assignment.");
      return;
    }

    const today = new Date();
    const selectedDate = new Date(assignment_date);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Assignment date cannot be earlier than today.");
      return;
    }

    setError("");

    const assignmentData = {
      ...formData,
      file_upload_link:
        isEditing && !file_upload_link
          ? assignmentToEdit.file_link
          : file_upload_link,
    };

    if (isEditing) {
      onEditAssignment({
        ...assignmentData,
        assignment_id: assignmentToEdit.assignment_id,
      });
    } else {
      onAddAssignment(assignmentData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={modalContainerStyle}>
      <div className={modalContentStyle}>
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Assignment" : "Add New Assignment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Error Message */}
        {error && <div className={errorStyle}>{error}</div>}

        {/* Form Rows */}
        {/* Assignment Name and Course Code */}
        <div className={formRowStyle}>
          <div className={formColumnStyle}>
            <label htmlFor="assignment_name" className={labelStyle}>
              Assignment Name:
            </label>
            <input
              type="text"
              id="assignment_name"
              placeholder="Assignment Name"
              value={formData.assignment_name}
              onChange={handleInputChange}
              className={inputStyle}
              required
            />
          </div>
          <div className={formColumnStyle}>
            <label htmlFor="course_code" className={labelStyle}>
              Course Code:
            </label>
            <select
              id="course_code"
              value={formData.course_code}
              onChange={handleCourseChange}
              className={selectStyle}
              required
            >
              <option value="">Select Course</option>
              {coursesInfo.map((course) => (
                <option key={course.course_id} value={course.course_code}>
                  {course.course_code} - {course.course_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department and Squad Number */}
        <div className={formRowStyle}>
          <div className={formColumnStyle}>
            <label htmlFor="department" className={labelStyle}>
              Department:
            </label>
            <input
              type="text"
              id="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleInputChange}
              className={inputStyle}
              required
            />
          </div>
          <div className={formColumnStyle}>
            <label htmlFor="squad_number" className={labelStyle}>
              Squad Number:
            </label>
            <input
              type="text"
              id="squad_number"
              placeholder="Squad Number"
              value={formData.squad_number}
              onChange={handleInputChange}
              className={inputStyle}
              required
            />
          </div>
        </div>

        {/* File Upload and Semester Number */}
        <div className={formRowStyle}>
          <div className={formColumnStyle}>
            <label htmlFor="file_upload_link" className={labelStyle}>
              Attachment:
            </label>
            <input
              key={fileInputKey}
              type="file"
              id="file_upload_link"
              onChange={handleFileChange}
              className={inputStyle}
              required={!isEditing}
            />
            {isEditing && formData.file_upload_link && (
              <p className="mt-2 text-sm text-gray-500">
                Current file: {formData.file_upload_link.split("/").pop()}
              </p>
            )}
          </div>
          <div className={formColumnStyle}>
            <label htmlFor="semester_number" className={labelStyle}>
              Semester Number:
            </label>
            <input
              type="number"
              id="semester_number"
              placeholder="Semester Number"
              value={formData.semester_number}
              onChange={handleInputChange}
              className={inputStyle}
              required
            />
          </div>
        </div>

        {/* Description and Assignment Date */}
        <div className={formRowStyle}>
          <div className={formColumnStyle}>
            <label htmlFor="description" className={labelStyle}>
              Description:
            </label>
            <textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className={inputStyle}
              required
            />
          </div>
          <div className={formColumnStyle}>
            <label htmlFor="assignment_date" className={labelStyle}>
              Assignment Date:
            </label>
            <input
              type="date"
              id="assignment_date"
              value={formData.assignment_date}
              onChange={handleInputChange}
              className={inputStyle}
              required
            />
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end mt-2">
          <button onClick={onClose} className={cancelButtonStyle}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={submitButtonStyle}>
            {isEditing ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentModal;
