import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGradesDetails } from "../../redux/slices/fetchStudentGradesDetailsSlice";
import { useLocation, useParams } from "react-router-dom";
import { updateStudentGrades } from "../../redux/slices/updateStudentGradesSlice";
import Message from "../../components/Message";
import { sendReview } from "../../redux/slices/sendReviewSlice";
import StatusMessage from "../../components/StatusMessage";

const StudentGrades = () => {
  // State management
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseData, setSelectedCourseData] = useState(null);
  const [grades, setGrades] = useState({
    midterm_grade: "",
    year_work: "",
    assignment_grade: "",
    final_grade: "",
    total_degree: "",
  });
  const [review, setReview] = useState({
    email: "",
    message: "",
    grade_type: "",
    course_code: "",
    course_name: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Refs for grade inputs
  const inputRefs = {
    midterm_grade: useRef(null),
    final_grade: useRef(null),
    year_work: useRef(null),
    assignment_grade: useRef(null),
    total_degree: useRef(null),
  };

  // Router and Redux setup
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.fetchStudentGradesDetails
  );
  const location = useLocation();
  const { semester_number, squad_number } = location.state || {};
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "Admin";

  // Style variables
  const inputStyle =
    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none";
  const buttonStyle =
    "w-full p-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const selectStyle =
    "w-full p-3 pl-4 pr-10 text-base border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const statusStyle = (status) =>
    status === "Passed"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  const infoTextStyle = "text-lg text-gray-600 font-crimson-text-bold";
  const sectionTitleStyle = "mb-4 text-lg font-semibold";
  const labelStyle = "block mb-1 text-sm font-medium text-gray-700";
  const infoCardStyle = "p-4 rounded-lg bg-gray-50";

  // Handle course selection
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);

    const selectedCourseData = data?.courses_grades?.find(
      (course) => course.course_id.toString() === courseId.toString()
    );

    setSelectedCourseData(selectedCourseData);

    if (selectedCourseData) {
      setGrades({
        midterm_grade: selectedCourseData?.grades.midterm_grade || "",
        year_work: selectedCourseData?.grades.year_work || "",
        assignment_grade: selectedCourseData?.grades.assignment_grade || "",
        final_grade: selectedCourseData?.grades.final_grade || "",
        total_degree: selectedCourseData?.grades.total_degree || "",
      });

      setReview((prev) => ({
        ...prev,
        course_code: selectedCourseData.course_code,
        course_name: selectedCourseData.course_name,
      }));
    } else {
      setGrades({
        midterm_grade: "",
        year_work: "",
        assignment_grade: "",
        final_grade: "",
        total_degree: "",
      });
    }
  };

  // Handle input changes
  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setGrades({ ...grades, [name]: value });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  // Submit review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    const reviewData = {
      student_email: review.email,
      review_text: review.message,
      review_type: review.grade_type,
      course_code: review.course_code,
    };

    dispatch(sendReview(reviewData))
      .unwrap()
      .then(() => showMessage("Your review submitted successfully!", "success"))
      .catch((error) => showMessage(error, "error"));
  };

  // Focus on grade input
  const handleEditClick = (ref) => {
    ref.current.focus();
  };

  // Submit grades
  const handleSubmitGrades = () => {
    if (!selectedCourse) {
      showMessage("Please select a course first", "error");
      return;
    }

    const gradesData = {
      student_id: id,
      course_id: selectedCourse,
      ...grades,
    };

    dispatch(updateStudentGrades(gradesData))
      .unwrap()
      .then(() => {
        showMessage("Grades submitted successfully!", "success");
        dispatch(fetchStudentGradesDetails({ role, student_id: id }));
      })
      .catch((error) => showMessage(error, "error"));
  };

  // Show message helper
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  // Fetch data on mount
  useEffect(() => {
    const credentials = {
      student_id: id,
      squad_number,
      semester_number,
    };
    dispatch(fetchStudentGradesDetails({ role, credentials }));
  }, [dispatch, id, role, squad_number, semester_number]);

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div className="p-3 bg-white rounded-lg shadow-md md:p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center">
          <span className="mr-2 text-2xl">🎓</span>
          <h1 className="text-2xl font-bold">Student Detailed Result</h1>
        </div>
      </div>

      {/* Student Info */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Name: {data?.first_name} {data?.last_name}
          </h2>
          <p className="p-2 text-sm text-blue-500 bg-gray-100">
            Result Will Published on 12:30 AM | 22 September 2023
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className={infoTextStyle}>ID: {data?.student_id}</p>
          <p className="px-8 py-1 text-[16px] text-green-600 bg-green-100 rounded-lg font-crimson-text-semibold">
            GPA: {data?.GPA}
          </p>
        </div>
        <p className={infoTextStyle}>Level: {data?.squad}</p>
        <p className={infoTextStyle}>Department: {data?.department}</p>
        <p className={infoTextStyle}>Email: {data?.student_email}</p>
      </div>

      {/* Course Selection */}
      <div className="flex items-center justify-between w-full gap-3 my-4">
        <div>
          <label className={labelStyle}>Select Course</label>
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={handleCourseChange}
              className={selectStyle}
              required
            >
              <option value="">-- Select a Course --</option>
              {data?.courses_grades?.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name} ({course.course_code})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Course Status */}
        {selectedCourseData?.grades?.pass_status !== undefined ? (
          <p
            className={`px-8 py-1 text-[16px] rounded-lg font-crimson-text-semibold ${statusStyle(
              selectedCourseData?.grades?.pass_status
            )}`}
          >
            {selectedCourseData?.grades?.pass_status}
          </p>
        ) : (
          <p className="px-8 py-1 text-[16px] text-gray-600 bg-gray-100 rounded-lg font-crimson-text-semibold">
            No Status
          </p>
        )}
      </div>

      {/* Grades and Review Section */}
      {selectedCourse && (
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          {/* Grades Input */}
          <div>
            <h2 className={sectionTitleStyle}>
              Grades for {selectedCourseData?.course_name}
            </h2>
            {Object.keys(grades).map((grade) => (
              <div key={grade} className="mb-4">
                <label className={labelStyle}>
                  {grade.charAt(0).toUpperCase() +
                    grade.slice(1).replace("_", " ")}{" "}
                  Grade
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name={grade}
                    value={grades[grade]}
                    onChange={handleGradeChange}
                    className={inputStyle}
                    placeholder={`Enter ${grade.replace("_", " ")} grade`}
                    ref={inputRefs[grade]}
                  />
                  {!isAdmin && (
                    <button
                      type="button"
                      className="p-3 ml-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(inputRefs[grade])}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!isAdmin && (
              <button
                type="button"
                onClick={handleSubmitGrades}
                className={buttonStyle}
              >
                Submit All Grades
              </button>
            )}
          </div>

          {/* Review Form or Course Info */}
          {!isAdmin ? (
            <form onSubmit={handleSubmitReview} className={infoCardStyle}>
              <h2 className={sectionTitleStyle}>Submit a Review</h2>

              <div className="mb-4">
                <label className={labelStyle}>Course</label>
                <input
                  type="text"
                  value={selectedCourseData?.course_name || ""}
                  className={`${inputStyle} bg-gray-100`}
                  readOnly
                />
                <input
                  type="hidden"
                  name="course_code"
                  value={selectedCourseData?.course_code || ""}
                />
              </div>

              <div className="mb-4">
                <label className={labelStyle}>Grade Type</label>
                <select
                  name="grade_type"
                  value={review.grade_type}
                  onChange={handleReviewChange}
                  className={inputStyle}
                  required
                >
                  <option value="">Select Grade Type</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="assignment">Assignment</option>
                  <option value="year_work">Year Work</option>
                </select>
              </div>

              <div className="mb-4">
                <label className={labelStyle}>Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={review.email}
                  onChange={handleReviewChange}
                  className={inputStyle}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className={labelStyle}>Your Review</label>
                <textarea
                  name="message"
                  value={review.message}
                  onChange={handleReviewChange}
                  className={inputStyle}
                  placeholder="Enter your review"
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className={buttonStyle}>
                Send Review
              </button>
            </form>
          ) : (
            <div className={infoCardStyle}>
              <h2 className={sectionTitleStyle}>Course Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Course Code
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedCourseData?.course_code}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Course Name
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedCourseData?.course_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Academic Year
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedCourseData?.academic_year || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Semester
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedCourseData?.semester || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Message Component */}
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

export default StudentGrades;
