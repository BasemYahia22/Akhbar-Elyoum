import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Font Awesome component
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; // Email icon

const ReviewGrades = () => {
  const [email, setEmail] = useState("");
  const [gradeType, setGradeType] = useState("");
  const [course, setCourse] = useState("");
  const [review, setReview] = useState("");
  const labelStyle = "block text-sm font-medium text-gray-700";
  const inputStyle =
    "block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none";

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ email, gradeType, course, review });
    alert("Review submitted successfully!");
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-5 bg-white rounded-lg shadow-md sm:max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-center">Review Grades</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input with Font Awesome Icon */}
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
              {/* Font Awesome Email Icon */}
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

        {/* Grade Type Dropdown */}
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

        {/* Course Dropdown */}
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
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>
        </div>

        {/* Review Text Area */}
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
          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-md bg-primary focus:outline-none"
          >
            Send Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewGrades;
