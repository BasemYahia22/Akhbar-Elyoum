import courseImg from "../assets/courseImg.png";

const CourseCard = ({ course, isSelected, onSelect, onCancel }) => {
  // Style variables
  const cardStyle = "flex flex-col items-center bg-white shadow-lg rounded-xl";
  const imageStyle = "object-cover w-full h-48 rounded-md";
  const contentStyle = "flex flex-col justify-between p-4 text-center";
  const titleStyle = "text-lg font-semibold";
  const detailStyle = "text-primary";
  const cancelButtonStyle = "px-10 py-2 text-white bg-red-500 rounded-md";
  const selectButtonStyle = "px-10 py-2 text-black bg-[#E6F1FF] rounded-md";

  return (
    <div className={cardStyle}>
      {/* Course image */}
      <img src={courseImg} alt={course.course_name} className={imageStyle} />

      {/* Course details */}
      <div className={contentStyle}>
        <h3 className={titleStyle}>{course.course_name}</h3>
        <p className={detailStyle}>Course Code: {course.course_code}</p>
        <p className={detailStyle}>Hours: {course.credit_hours} Credit Hours</p>

        {/* Action button */}
        <div className="mt-2">
          {isSelected ? (
            <button
              onClick={onCancel}
              className={cancelButtonStyle}
              aria-label={`Cancel ${course.course_name}`}
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={onSelect}
              className={selectButtonStyle}
              aria-label={`Select ${course.course_name}`}
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
