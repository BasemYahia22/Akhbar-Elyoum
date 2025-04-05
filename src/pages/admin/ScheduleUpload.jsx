import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faUpload,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import ScheduleModal from "./ScheduleModal";
import { fetchschedules } from "../../redux/slices/fetchSchedulesSlice";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import { addAndUpdateAndRemoveSchedule } from "../../redux/slices/addAndUpdateAndRemoveScheduleSlice";
import StatusMessage from "../../components/StatusMessage";

const ScheduleUpload = () => {
  // State management
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [filter, setFilter] = useState("");

  // Redux state
  const { data, loading, error } = useSelector((state) => state.fetchschedules);
  const dispatch = useDispatch();

  // Style variables
  const tdAndThStyle = "px-4 py-2";
  const filterInputStyle =
    "w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
  const addButtonStyle =
    "w-full px-4 py-2 text-white rounded bg-primary md:w-fit";
  const downloadButtonStyle = "mr-2 text-green-500 hover:text-green-700";
  const editButtonStyle =
    "px-2 py-1 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600";
  const deleteButtonStyle =
    "px-2 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600";
  const actionCellStyle = `${tdAndThStyle} flex justify-center space-x-2`;

  // Message handler
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  // Form submission handler
  const handleSubmit = (operation, credentials) => {
    dispatch(addAndUpdateAndRemoveSchedule({ operation, credentials }))
      .unwrap()
      .then(() => {
        showMessage(
          `${operation === "add" ? "Added" : "Updated"} schedule successfully!`,
          "success"
        );
        dispatch(fetchschedules());
      })
      .catch((error) => {
        showMessage(error, "error");
      });

    setIsModalOpen(false);
  };

  // Delete handler
  const handleDelete = (id) => {
    dispatch(
      addAndUpdateAndRemoveSchedule({
        operation: "remove",
        credentials: { id },
      })
    )
      .unwrap()
      .then(() => {
        showMessage("Removed schedule successfully!", "success");
        dispatch(fetchschedules());
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  };

  // Update handler
  const handleUpdate = (id) => {
    const scheduleToUpdate = data?.data.find((schedule) => schedule.id === id);
    setCurrentSchedule(scheduleToUpdate);
    setIsModalOpen(true);
  };

  // Filter handler
  const handleFilterChange = (e) => setFilter(e.target.value);

  // Download handler
  const handleDownload = (filePath) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter schedules
  const filteredSchedules =
    data?.data?.filter((schedule) => {
      if (!schedule) return false;
      const filterLower = filter.toLowerCase();
      return (
        schedule.file_name?.toLowerCase().includes(filterLower) ||
        schedule.department?.toLowerCase().includes(filterLower) ||
        schedule.squad_number?.toString().includes(filterLower) ||
        schedule.semester_info?.semester_number
          ?.toString()
          .includes(filterLower)
      );
    }) || [];

  // Fetch data on mount
  useEffect(() => {
    if (!data) {
      dispatch(fetchschedules());
    }
  }, [dispatch, data]);

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div>
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Input */}
        <div className="w-full md:w-fit">
          <input
            type="text"
            placeholder="Filter by name, department, squad, or semester"
            value={filter}
            onChange={handleFilterChange}
            className={filterInputStyle}
          />
        </div>

        {/* Add Schedule Button */}
        <button
          onClick={() => {
            setCurrentSchedule(null);
            setIsModalOpen(true);
          }}
          className={addButtonStyle}
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Add Schedule
        </button>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        schedule={currentSchedule}
      />

      {/* Schedules Table */}
      <div className="mt-6 overflow-auto max-w-[18rem] md:max-w-full">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className={tdAndThStyle}>File Name</th>
              <th className={tdAndThStyle}>Department</th>
              <th className={tdAndThStyle}>Squad Number</th>
              <th className={tdAndThStyle}>Semester</th>
              <th className={tdAndThStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No schedules found. Try adjusting your search or add a new
                  schedule.
                </td>
              </tr>
            ) : (
              filteredSchedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="text-center border-b hover:bg-gray-50"
                >
                  <td className={tdAndThStyle}>{schedule.file_name}</td>
                  <td className={tdAndThStyle}>{schedule.department || "-"}</td>
                  <td className={tdAndThStyle}>
                    {schedule.squad_number || "-"}
                  </td>
                  <td className={tdAndThStyle}>
                    {schedule.semester_info?.semester_name || "-"}
                  </td>
                  <td className={actionCellStyle}>
                    <button
                      onClick={() => handleDownload(schedule.file_path)}
                      className={downloadButtonStyle}
                      title="Download"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      onClick={() => handleUpdate(schedule.id)}
                      className={editButtonStyle}
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className={deleteButtonStyle}
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Message */}
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

export default ScheduleUpload;
