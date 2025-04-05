import UserDataSection from "../../components/UserDataSection";
import CourseCardWithGrades from "../../components/CourseCardWithGrades";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentCourses } from "../../redux/slices/fetchStudentCoursesSlice";
import Message from "../../components/Message"; // Import the Message component
import ReviewGradesModal from "./ReviewGradesModal";
import StatusMessage from "../../components/StatusMessage";

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.fetchStudentCourses
  );

  useEffect(() => {
    if (!data) {
      dispatch(fetchStudentCourses());
    }
  }, [dispatch, data]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const hideMessage = () => setMessage("");

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <section>
      <UserDataSection />
      {/* CourseCardWithGrades */}
      <div className="grid gap-5 mt-10 lg:grid-cols-3 md:grid-cols-2">
        {data?.result.courses.map((course) => {
          return (
            <CourseCardWithGrades course={course} key={course.course_id} />
          );
        })}
      </div>
      {/* Button to Open Modal */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-white rounded-md bg-primary"
        >
          Review Grades
        </button>
      </div>
      {/* Review Grades Modal */}
      <ReviewGradesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showMessage={showMessage} // Pass the showMessage function
      />
      {/* Display the message in the Courses component */}
      <Message message={message} type={messageType} onClose={hideMessage} />
    </section>
  );
};

export default Courses;
