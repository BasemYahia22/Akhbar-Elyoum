import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const StudentGrades = () => {
  const [grades, setGrades] = useState({
    midterm: "15/15",
    project: "15/15",
    yearwork: "15/15",
    assignments: "15/15",
    final: "15/15",
  });

  const [review, setReview] = useState({
    email: "",
    message: "",
  });

  // Create refs for each input field
  const midtermRef = useRef(null);
  const projectRef = useRef(null);
  const finalRef = useRef(null);
  const yearworkRef = useRef(null);
  const assignmentsRef = useRef(null);

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setGrades({
      ...grades,
      [name]: value,
    });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({
      ...review,
      [name]: value,
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log("Review Submitted:", review);
  };

  // Function to focus on the input field when the edit icon is clicked
  const handleEditClick = (ref) => {
    ref.current.focus();
  };

  // Function to handle submission of all grades
  const handleSubmitGrades = () => {
    console.log("Grades Submitted:", grades);
    // You can add additional logic here, such as sending the grades to an API
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Icon + Title */}
      <div className="flex items-center justify-center mb-6">
        <span className="mr-2 text-2xl">🎓</span>
        <h1 className="text-2xl font-bold">Student Detailed Result</h1>
      </div>

      {/* Student Information */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Name: John Doe</h2>
          <p className="p-2 text-sm text-blue-500 bg-gray-100">
            Result Will Published on 12:30 AM | 22 September 2023
          </p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg text-gray-600 font-crimson-text-bold">
            ID: 123456
          </p>
          <p className="px-8 py-1 text-[16px] text-green-600 bg-green-100 rounded-lg font-crimson-text-semibold">
            Passed
          </p>
          <p className="px-8 py-1 text-[16px] text-green-600 bg-green-100 rounded-lg font-crimson-text-semibold">
            Points: 3.1
          </p>
        </div>
        <p className="text-lg text-gray-600 font-crimson-text-bold">
          Level: Senior
        </p>
        <p className="text-lg text-gray-600 font-crimson-text-bold">
          Department: Computer Science
        </p>
        <p className="text-lg text-gray-600 font-crimson-text-bold">
          Email: john.doe@example.com
        </p>
      </div>

      {/* Grades Inputs and Review Form in the Same Row */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        {/* Grades Inputs */}
        <div>
          {Object.keys(grades).map((grade) => {
            // Assign the correct ref based on the grade type
            let inputRef;
            switch (grade) {
              case "midterm":
                inputRef = midtermRef;
                break;
              case "project":
                inputRef = projectRef;
                break;
              case "final":
                inputRef = finalRef;
                break;
              case "yearwork":
                inputRef = yearworkRef;
                break;
              case "assignments":
                inputRef = assignmentsRef;
                break;
              default:
                inputRef = null;
            }

            return (
              <div key={grade} className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {grade.charAt(0).toUpperCase() + grade.slice(1)} Grade
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name={grade}
                    value={grades[grade]}
                    onChange={handleGradeChange}
                    className="w-full p-2 mr-2 border rounded-lg"
                    placeholder={`Enter ${grade} grade`}
                    ref={inputRef} // Attach the ref to the input
                  />
                  <button
                    type="button"
                    className="p-2 text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(inputRef)} // Focus the input on click
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              </div>
            );
          })}
          {/* Submit Button for All Grades */}
          <button
            type="button"
            onClick={handleSubmitGrades}
            className="w-full p-2 mt-4 text-white rounded-lg bg-third"
          >
            Submit All Grades
          </button>
        </div>

        {/* Review Form */}
        <form
          onSubmit={handleSubmitReview}
          className="p-4 rounded-lg shadow-sm bg-gray-50"
        >
          <h2 className="mb-4 text-lg font-semibold">Submit a Review</h2>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={review.email}
              onChange={handleReviewChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Your Review
            </label>
            <textarea
              name="message"
              value={review.message}
              onChange={handleReviewChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your review"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white rounded-lg bg-third"
          >
            Send Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentGrades;
