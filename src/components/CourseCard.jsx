const CourseCard = ({ course, isSelected, onSelect, onCancel }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-xl">
      <img
        src={course.image}
        alt={course.name}
        className="object-cover w-full h-48 rounded-md"
      />
      <div className="flex flex-col justify-between p-4 text-center">
        <h3 className="text-lg font-semibold">{course.name}</h3>
        <p className="text-primary ">Course Code: {course.code}</p>
        <p className="text-primary ">Hours: {course.hours} Credit Hours</p>
        <p className=" text-primary">Prerequisites: {course.prerequisites}</p>
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