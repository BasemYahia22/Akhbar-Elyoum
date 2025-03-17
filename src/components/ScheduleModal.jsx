import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ScheduleModal = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onFileChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg w-96">
        <div className="flex items-start justify-between">
          <h2 className="mb-4 text-xl font-bold">Upload Schedule</h2>
          <button type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">File</label>
            <input
              type="file"
              name="file"
              onChange={onFileChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={onInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Squad Number
            </label>
            <input
              type="text"
              name="squadNumber"
              value={formData.squadNumber}
              onChange={onInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Semester Number
            </label>
            <input
              type="text"
              name="semesterNumber"
              value={formData.semesterNumber}
              onChange={onInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
