import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faUpload } from "@fortawesome/free-solid-svg-icons";
import ScheduleModal from "../../components/ScheduleModal";

const ScheduleUpload = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState([ 
    {
      id: 1,
      name: "Schedule 1",
      department: "Computer Science",
      squadNumber: "third year",
      semesterNumber: "Semester 1",
    },
    {
      id: 2,
      name: "Schedule 2",
      department: "Electrical Engineering",
      squadNumber: "second year",
      semesterNumber: "Semester 2",
    },
    {
      id: 3,
      name: "Schedule 3",
      department: "Mechanical Engineering",
      squadNumber: "third year",
      semesterNumber: "Semester 3",
    },
    {
      id: 4,
      name: "Schedule 4",
      department: "Mechanical Engineering",
      squadNumber: "third year",
      semesterNumber: "Semester 1",
    },
    {
      id: 5,
      name: "Schedule 5",
      department: "Mechanical Engineering",
      squadNumber: "second year",
      semesterNumber: "Semester 3",
    },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    file: null,
    department: "",
    squadNumber: "",
    semesterNumber: "",
  });
  const [filter, setFilter] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = { ...formData, id: Date.now() };
    setSchedules([...schedules, newSchedule]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      file: null,
      department: "",
      squadNumber: "",
      semesterNumber: "",
    });
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleUpdate = (id) => {
    const scheduleToUpdate = schedules.find((schedule) => schedule.id === id);
    setFormData(scheduleToUpdate);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter schedules based on the filter value
  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.name.toLowerCase().includes(filter.toLowerCase()) ||
      schedule.department.toLowerCase().includes(filter.toLowerCase()) ||
      schedule.squadNumber.toLowerCase().includes(filter.toLowerCase()) ||
      schedule.semesterNumber.toLowerCase().includes(filter.toLowerCase())
  );

  // Style
  const tdAndThStyle = "px-4 py-2";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Input */}
        <div>
          <input
            type="text"
            placeholder="Filter by name, department, squad, or semester"
            value={filter}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
        </div>

        {/* Button to Open Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-white rounded bg-primary"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Upload Schedule
        </button>
      </div>

      {/* Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />

      {/* Table to Display Data */}
      <div className="mt-6 overflow-auto max-w-[18rem] md:max-w-full">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className={tdAndThStyle}>Name</th>
              <th className={tdAndThStyle}>Department</th>
              <th className={tdAndThStyle}>Squad Number</th>
              <th className={tdAndThStyle}>Semester Number</th>
              <th className={tdAndThStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id} className="text-center border-b hover:bg-gray-50">
                <td className={tdAndThStyle}>{schedule.name}</td>
                <td className={tdAndThStyle}>{schedule.department}</td>
                <td className={tdAndThStyle}>{schedule.squadNumber}</td>
                <td className={tdAndThStyle}>{schedule.semesterNumber}</td>
                <td className={tdAndThStyle}>
                  <button
                    onClick={() => handleUpdate(schedule.id)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleUpload;
