import { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../redux/slices/registerCoursesSlice";
import Message from "../../components/Message";
import StatusMessage from "../../components/StatusMessage";

const Registration = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.registerCourses);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };
  const hideMessage = () => setMessage("");

  useEffect(() => {
    if (!data) {
      dispatch(fetchCourses({ type: "GET" }));
    }
  }, [dispatch, data]);

  const handleSelect = (id) => {
    const course = data?.available_courses.find((c) => c.course_id === id);
    if (!course) return;

    const currentCreditHours = selectedCourses.reduce((acc, courseId) => {
      const c = data?.available_courses.find((c) => c.course_id === courseId);
      return acc + (c ? c.credit_hours : 0);
    }, 0);

    if (
      currentCreditHours + course.credit_hours >
      data?.semester_info?.credit_hours
    ) {
      showMessage(
        `Cannot exceed semester limit of ${data?.semester_info?.credit_hours} credit hours`,
        "error"
      );
      return;
    }

    setSelectedCourses((prev) => [...prev, id]);
  };

  const handleCancel = (id) => {
    setSelectedCourses((prev) => prev.filter((courseId) => courseId !== id));
  };

  const totalSelectedCreditHours = selectedCourses.reduce((acc, id) => {
    const course = data?.available_courses.find((c) => c.course_id === id);
    return acc + (course ? course.credit_hours : 0);
  }, 0);

  const handleSubmit = async () => {
    if (totalSelectedCreditHours === 0) {
      showMessage("Please select at least one course", "error");
      return;
    }

    const credentials = {
      course_ids: selectedCourses,
    };

    dispatch(fetchCourses({ type: "POST", courseIds: credentials }))
      .unwrap()
      .then(() => {
        showMessage("Registration successful", "success");
      })
      .catch((error) => {
        showMessage(`${error.message}. Please try again.`, "error");
      });
  };

  if (loading) {
    return <StatusMessage loading={loading} />;
  }

  return (
    <div className="flex flex-col min-h-screen gap-6 bg-gray-100 lg:gap-10 md:flex-row">
      <div className="h-full p-4 overflow-y-auto bg-white shadow-md md:w-1/4 rounded-xl">
        <div className="flex flex-wrap items-center justify-center gap-6 md:flex-col">
          {["Available", "Semester", "Selected"].map((label, index) => {
            const value =
              label === "Available"
                ? `${data?.semester_info?.available_hours}`
                : label === "Semester"
                ? `${data?.semester_info?.credit_hours}`
                : totalSelectedCreditHours;

            return (
              <div key={index} className="flex flex-col items-center">
                <p className="mb-5 text-lg text-primary font-crimson-text-regular">
                  {label} Credit Hours
                </p>
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke={
                        label === "Selected"
                          ? totalSelectedCreditHours >
                            data?.semester_info?.credit_hours
                            ? "#EF4444"
                            : "#FFC756"
                          : "#34D399"
                      }
                      strokeWidth="8"
                      strokeDasharray="314"
                      strokeDashoffset={314 - (value / 18) * 314}
                      fill="none"
                    />
                  </svg>
                  <span className="absolute w-full font-semibold text-center text-black transform -translate-x-1/2 -translate-y-1/2 text- top-1/2 left-1/2">
                    {value} hours
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-lg font-crimson-text-bold text-primary">
          Supervisor: TA/Ahmed Ali
        </p>
        <p className="mt-2 text-sm text-primary">
          Contacts: aliahmed12@gmail.com.
        </p>
      </div>

      <div className="p-5 overflow-x-auto bg-white md:w-3/4 lg:p-10 rounded-xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-crimson-text-bold">
            Course Registration
          </h1>
          <p className="text-lg font-crimson-text-regular">
            Second Semester 2024-2025
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
          {data?.available_courses.map((course) => {
            const isSelected = selectedCourses.includes(course.course_id);
            const wouldExceedLimit =
              totalSelectedCreditHours + course.credit_hours >
              data?.semester_info?.credit_hours;
            const hasFailedPrerequisite =
              course.prerequisite && !course.prerequisite.passed;

            return (
              <CourseCard
                key={course.course_id}
                course={course}
                isSelected={isSelected}
                onSelect={() => handleSelect(course.course_id)}
                onCancel={() => handleCancel(course.course_id)}
                disabled={
                  !isSelected && (wouldExceedLimit || hasFailedPrerequisite)
                }
                failedPrerequisite={hasFailedPrerequisite}
              />
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={
              selectedCourses.length === 0 ||
              totalSelectedCreditHours > data?.semester_info?.credit_hours
            }
            className={`px-16 py-2 text-black rounded-md font-crimson-text-regular text-lg ${
              selectedCourses.length === 0 ||
              totalSelectedCreditHours > data?.semester_info?.credit_hours
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#E6F1FF] hover:bg-[#D0E2FF]"
            }`}
          >
            Submit
          </button>
        </div>
      </div>

      <Message message={message} type={messageType} onClose={hideMessage} />
    </div>
  );
};

export default Registration;
