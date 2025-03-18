import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faDownload } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons
import UniversityInfo from "./UniversityInfo";

const UniversitySchedule = () => {
  const iconStyle = "p-3 text-2xl text-white rounded-lg bg-primary";
  const dateStyle = "text-sm text-gray-500";
  const containerStyle = "max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md";
  const scheduleH2Style = "text-sm font-semibold text-gray-800";

  // Replace these with the actual paths to your PDF files
  const lecturesSchedulePdf = "/path/to/lectures-schedule.pdf";
  const midtermSchedulePdf = "/path/to/midterm-schedule.pdf";

  return (
    <div className="bg-gray-100 ">
      <div className={`${containerStyle} mb-5`}>
        <h1 className="mb-6 text-2xl text-gray-800 font-crimson-text-bold">
          Schedules 2025-2026
        </h1>

        {/* Lectures and Sections Schedule */}
        <div className="py-3 mb-6 border-y-2">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faCalendarAlt} className={iconStyle} />
            <div>
              <h2 className={scheduleH2Style}>Lectures, Sections Schedule</h2>
              <p className={dateStyle}>04 May, 09:20 AM</p>
              <a
                href={lecturesSchedulePdf}
                download="Lectures-Schedule.pdf"
                className="flex items-center space-x-2 text-blue-500 hover:underline"
              >
                <FontAwesomeIcon icon={faDownload} className="text-sm" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </div>

        {/* Midterm Schedule */}
        <div>
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faCalendarAlt} className={iconStyle} />
            <div>
              <h2 className={scheduleH2Style}>Midterm Schedule</h2>
              <p className={dateStyle}>04 May, 09:20 AM</p>
              <a
                href={midtermSchedulePdf}
                download="Midterm-Schedule.pdf"
                className="flex items-center space-x-2 text-blue-500 hover:underline"
              >
                <FontAwesomeIcon icon={faDownload} className="text-sm" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <UniversityInfo />
    </div>
  );
};

export default UniversitySchedule;
