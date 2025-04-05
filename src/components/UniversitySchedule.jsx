import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faDownload,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import UniversityInfo from "./UniversityInfo";
import { useSelector } from "react-redux";

const UniversitySchedule = () => {
  const iconStyle = "p-3 text-2xl text-white rounded-lg bg-primary";
  const dateStyle = "text-sm text-gray-500";
  const containerStyle = "max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md";
  const scheduleH2Style = "text-sm font-semibold text-gray-800";
  const noDataStyle =
    "flex items-center p-4 text-yellow-600 bg-yellow-100 rounded-lg";
  const scheduleItemStyle = "py-3 mb-6 border-b-2 last:border-b-0";

  const { data } = useSelector((state) => state.studentHomepage);
  // Normalize subjects_link to always be an array
  const getSchedules = () => {
    if (!data?.subjects_link) return [];
    return Array.isArray(data.subjects_link)
      ? data.subjects_link
      : [data.subjects_link];
  };

  const schedules = getSchedules();
  const hasSchedules = schedules.length > 0;

  // Format the uploaded_at date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-100 ">
      <div className={`${containerStyle} mb-5`}>
        <h1 className="mb-6 text-2xl text-gray-800 font-crimson-text-bold">
          Schedules {hasSchedules && `(${schedules.length})`}
        </h1>

        {hasSchedules ? (
          <div>
            {schedules.map((schedule, index) => (
              <div key={index} className={scheduleItemStyle}>
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faCalendarAlt} className={iconStyle} />
                  <div>
                    <h2 className={scheduleH2Style}>
                      {schedule.file_name?.replace(".pdf", "")} Schedule
                      {schedule.department && ` - ${schedule.department}`}
                      {schedule.squad_number &&
                        ` - Squad ${schedule.squad_number}`}
                    </h2>
                    <p className={dateStyle}>
                      {formatDate(schedule.uploaded_at)}
                    </p>
                    <a
                      href={schedule.file_path}
                      download={schedule.file_name}
                      className="flex items-center space-x-2 text-blue-500 hover:underline"
                    >
                      <FontAwesomeIcon icon={faDownload} className="text-sm" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={noDataStyle}>
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
            <span>No schedule data available at the moment.</span>
          </div>
        )}
      </div>
      <UniversityInfo />
    </div>
  );
};

export default UniversitySchedule;
