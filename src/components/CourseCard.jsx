import courseImg from "../assets/courseImg.png";

// Card component to display course information with select/cancel options
const CourseCard = ({ course, isSelected, onSelect, onCancel }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-xl">
      {/* Course image */}
      <img
        src={courseImg}
        alt={course.CourseName}
        className="object-cover w-full h-48 rounded-md"
      />

      {/* Course details */}
      <div className="flex flex-col justify-between p-4 text-center">
        <h3 className="text-lg font-semibold">{course.CourseName}</h3>
        <p className="text-primary">Course Code: {course.CourseCode}</p>
        <p className="text-primary">Hours: {course.CreditHours} Credit Hours</p>

        {/* Toggle between Select/Cancel button */}
        <div className="mt-2">
          {isSelected ? (
            <button
              onClick={onCancel}
              className="px-10 py-2 text-white bg-red-500 rounded-md"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={onSelect}
              className="px-10 py-2 text-black bg-[#E6F1FF] rounded-md"
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