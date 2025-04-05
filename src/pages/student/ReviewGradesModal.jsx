import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendReview } from "../../redux/slices/sendReviewSlice";
import StatusMessage from "../../components/StatusMessage";

const ReviewGradesModal = ({ isOpen, onClose, showMessage }) => {
  // State for form fields
  const [email, setEmail] = useState("");
  const [gradeType, setGradeType] = useState("");
  const [course, setCourse] = useState("");
  const [review, setReview] = useState("");

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.fetchStudentCourses);
  const { loading, error } = useSelector((state) => state.sendReview);

  // Style variables to avoid repetition
  const labelStyle = "block text-sm font-medium text-gray-700";
  const inputStyle =
    "block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none";
  const buttonStyle =
    "w-full px-4 py-2 text-white rounded-md bg-primary focus:outline-none";
  const iconButtonStyle =
    "absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none";

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = {
      prof_email: email,
      grade_type: gradeType,
      course_code: course,
      review_text: review,
    };

    dispatch(sendReview(credentials))
      .unwrap()
      .then(() => {
        showMessage("Your Review sent successfully", "success");
        onClose();
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  };

  // Show loading/error status if needed
  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  // Don't render if modal isn't open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-w-md p-6 mx-auto bg-white rounded-lg shadow-md sm:max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-center">Review Grades</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="w-5 h-5 text-primary"
                />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputStyle} py-2 pl-10 pr-3`}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Grade Type Select */}
          <div>
            <label htmlFor="gradeType" className={labelStyle}>
              Select Grade Type
            </label>
            <select
              id="gradeType"
              value={gradeType}
              onChange={(e) => setGradeType(e.target.value)}
              className={`${inputStyle} block w-full px-3 py-2 mt-1`}
              required
            >
              <option value="" disabled>
                Choose a grade type
              </option>
              <option value="assignment">Assignment</option>
              <option value="yearWork">Year Work</option>
              <option value="midterm">Midterm</option>
            </select>
          </div>

          {/* Course Select */}
          <div>
            <label htmlFor="course" className={labelStyle}>
              Select Course
            </label>
            <select
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className={`${inputStyle} px-3 py-2 mt-1`}
              required
            >
              <option value="" disabled>
                Choose a course
              </option>
              {data?.result.courses.map((course) => (
                <option key={course.course_code} value={course?.course_code}>
                  {course?.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Review Textarea */}
          <div>
            <label htmlFor="review" className={labelStyle}>
              Your Review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              className={`${inputStyle} px-3 py-2 mt-1`}
              placeholder="Write your review here..."
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className={buttonStyle}>
              Send Review
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button onClick={onClose} className={iconButtonStyle}>
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ReviewGradesModal;
