import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AddAssignmentModal = ({
  isOpen,
  onClose,
  onAddAssignment,
  onEditAssignment,
  assignmentToEdit,
}) => {
  const [title, setTitle] = useState(
    assignmentToEdit ? assignmentToEdit.title : ""
  );
  const [files, setFiles] = useState(
    assignmentToEdit ? assignmentToEdit.files : []
  );
  const [startDate, setStartDate] = useState(
    assignmentToEdit ? assignmentToEdit.startDate : ""
  );
  const [endDate, setEndDate] = useState(
    assignmentToEdit ? assignmentToEdit.endDate : ""
  );

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = () => {
    if (!title || !startDate || !endDate || files.length === 0) {
      alert("Please fill all fields and upload at least one file.");
      return;
    }

    const newAssignment = {
      title,
      files,
      startDate,
      endDate,
      id: assignmentToEdit ? assignmentToEdit.id : Date.now(),
    };

    if (assignmentToEdit) {
      onEditAssignment(newAssignment);
    } else {
      onAddAssignment(newAssignment);
    }
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = "w-full p-2 mb-2 bg-gray-100 focus:outline-none";
  const labelStyle = "my-auto text-2xl font-crimson-text-regular";
  return (
    <div className="fixed inset-0 flex items-center justify-center p-5 bg-black bg-opacity-50 md:p-0">
      <div className="p-6 bg-white rounded-lg max-w-[28rem] lg:mt-10 md:mt-16 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {assignmentToEdit ? "Edit Assignment" : "Add New Assignment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <label
          htmlFor=""
          className={labelStyle}
        >
          Title:
        </label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputStyle}
        />
        <label
          htmlFor=""
          className={labelStyle}
        >
          Attachment:
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className={inputStyle}
        />

        <label
          htmlFor=""
          className={labelStyle}
        >
          Start Date:
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputStyle}
        />
        <label
          htmlFor=""
          className={labelStyle}
        >
          End Date:
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputStyle}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={onClose}
            className="px-8 py-1 mr-2 text-black border border-black rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-10 py-1 text-white rounded-lg bg-third"
          >
            {assignmentToEdit ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentModal;
