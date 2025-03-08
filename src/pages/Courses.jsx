import UserDataSection from "../components/UserDataSection";
import CourseCardWithGrades from "../components/CourseCardWithGrades";
import ReviewGrades from "../components/ReviewGrades";
const CoursesData = [
  {
    id: 1,
    name: "Advanced Mathematics",
    instructor: "Dr. John Doe",
    prerequisite: "CS350",
    midtermGrade: 92,
    yearworkGrade: 88,
    finalGrade: 95,
    assignments: [
      { name: "Assignment 1", grade: 95 },
      { name: "Assignment 2", grade: 87 },
      { name: "Assignment 3", grade: 90 },
    ],
  },
  {
    id: 2,
    name: "Advanced Mathematics",
    instructor: "Dr. John Doe",
    prerequisite: "CS350",
    midtermGrade: 92,
    yearworkGrade: 88,
    finalGrade: 95,
    assignments: [
      { name: "Assignment 1", grade: 95 },
      { name: "Assignment 2", grade: 87 },
      { name: "Assignment 3", grade: 90 },
    ],
  },
  {
    id: 3,
    name: "Advanced Mathematics",
    instructor: "Dr. John Doe",
    prerequisite: "CS350",
    midtermGrade: 92,
    yearworkGrade: 88,
    finalGrade: 95,
    assignments: [
      { name: "Assignment 1", grade: 95 },
      { name: "Assignment 2", grade: 87 },
      { name: "Assignment 3", grade: 90 },
    ],
  },
  {
    id: 4,
    name: "Advanced Mathematics",
    instructor: "Dr. John Doe",
    prerequisite: "CS350",
    midtermGrade: 92,
    yearworkGrade: 88,
    finalGrade: 95,
    assignments: [
      { name: "Assignment 1", grade: 95 },
      { name: "Assignment 2", grade: 87 },
      { name: "Assignment 3", grade: 90 },
    ],
  },
  {
    id: 5,
    name: "Advanced Mathematics",
    instructor: "Dr. John Doe",
    prerequisite: "CS350",
    midtermGrade: 92,
    yearworkGrade: 88,
    finalGrade: 95,
    assignments: [
      { name: "Assignment 1", grade: 95 },
      { name: "Assignment 2", grade: 87 },
      { name: "Assignment 3", grade: 90 },
    ],
  },
];
const Courses = () => {
  return (
    <section>
      <UserDataSection />
      <div className="grid gap-5 mt-10 lg:grid-cols-3 md:grid-cols-2">
        {CoursesData.map((course) => {
          return <CourseCardWithGrades course={course} key={course.id} />;
        })}
      </div>
      <ReviewGrades />
    </section>
  );
};

export default Courses;
