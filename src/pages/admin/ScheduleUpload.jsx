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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { data, loading, error } = useSelector((state) => state.fetchschedules);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null); // Changed from formData to currentSchedule
  const [filter, setFilter] = useState("");

  const handleSubmit = (operation, credentials) => {
    console.log(credentials);
    if (operation === "add") {
      dispatch(addAndUpdateAndRemoveSchedule({ operation, credentials }))
        .unwrap()
        .then(() => {
          showMessage("added schedule Successfully!", "success");
          dispatch(fetchschedules());
        })
        .catch((error) => {
          console.log(error);
          showMessage(error, "error");
        });
    } else {
      dispatch(addAndUpdateAndRemoveSchedule({ operation, credentials }))
        .unwrap()
        .then(() => {
          showMessage("updated schedule Successfully!", "success");
          dispatch(fetchschedules());
        })
        .catch((error) => {
          showMessage(error, "error");
        });
    }

    setIsModalOpen(false);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleDelete = (id) => {
    const credentials = {
      id: id,
    };
    dispatch(
      addAndUpdateAndRemoveSchedule({ operation: "remove", credentials })
    )
      .unwrap()
      .then(() => {
        showMessage("removed schedule Successfully!", "success");
        dispatch(fetchschedules());
      })
      .catch((error) => {
        console.log(error);
        showMessage(error, "error");
      });
  };

  const handleUpdate = (id) => {
    const scheduleToUpdate = data?.data.find((schedule) => schedule.id === id);
    setCurrentSchedule(scheduleToUpdate);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDownload = (filePath) => {
    // Create a temporary link to download the file
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter schedules based on the filter value
  const filteredSchedules =
    data?.data?.filter((schedule) => {
      if (!schedule) return false;
      return (
        schedule.file_name?.toLowerCase().includes(filter.toLowerCase()) ||
        schedule.department?.toLowerCase().includes(filter.toLowerCase()) ||
        schedule.squad_number?.toString().includes(filter.toLowerCase()) ||
        schedule.semester_info?.semester_number
          ?.toString()
          .includes(filter.toLowerCase())
      );
    }) || [];

  useEffect(() => {
    if (!data) {
      dispatch(fetchschedules());
    }
  }, [dispatch, data]);

 if (loading || error) {
   return <StatusMessage loading={loading} error={error} />;
 }

  // Style
  const tdAndThStyle = "px-4 py-2";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Input */}
        <div className="w-full md:w-fit">
          <input
            type="text"
            placeholder="Filter by name, department, squad, or semester"
            value={filter}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button to Open Modal */}
        <button
          onClick={() => {
            setCurrentSchedule(null); // Clear current schedule for add mode
            setIsModalOpen(true);
          }}
          className="w-full px-4 py-2 text-white rounded bg-primary md:w-fit"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Add Schedule
        </button>
      </div>

      {/* Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        schedule={currentSchedule} // Changed from formData to schedule
      />

      {/* Table to Display Data */}
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
            {filteredSchedules?.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No Schedules found. Try adjusting your search or add a new
                  Schedule.
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
                    {schedule.semester_info?.semester_name}
                  </td>
                  <td className={`${tdAndThStyle} flex justify-center space-x-2`}>
                    <button
                      onClick={() => handleDownload(schedule.file_path)}
                      className="mr-2 text-green-500 hover:text-green-700"
                      title="Download"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      onClick={() => handleUpdate(schedule.id)}
                      className="px-2 py-1 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="px-2 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600"
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

export default ScheduleUpload;
