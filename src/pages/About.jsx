import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faUsers } from "@fortawesome/free-solid-svg-icons";
import aboutImage1 from "../assets/aboutImage1.png";
import aboutImage2 from "../assets/aboutImage2.png";
const About = () => {
  const statisticStyle =
    "font-crimson-text-bold md:text-2xl leading-10 text-xl";
  const containerQuestionStyle =
    "flex items-center justify-between md:gap-10 flex-wrap md:flex-nowrap";
  const questionStyle = "md:text-2xl text-third font-crimson-text-semibold text-xl";
  const answerStyle = "md:text-xl font-crimson-text-regular text-lg";

  return (
    <div>
      <section className="p-4 text-center text-white rounded-lg md:p-8 bg-primary">
        <h1 className="text-3xl md:text-4xl font-crimson-text-bold">
          Let’s Collaborate
        </h1>
        <p className="mx-auto text-lg text-gray-400 md:w-1/2 lg:w-2/3 font-crimson-text-regular">
          Donec dapibus mauris id odio ornare tempus. Duis sit amet accumsan
          justo, quis tempor ligulauisque quis pharetra felis.
        </p>
        <div className="flex flex-wrap items-center justify-around gap-5 mt-8">
          <div className={statisticStyle}>
            <FontAwesomeIcon icon={faCheckDouble} className="text-4xl" />
            <p>789</p>
            <p>Projects Done</p>
          </div>
          <div className={statisticStyle}>
            <FontAwesomeIcon icon={faUsers} className="text-4xl" />
            <p>457</p>
            <p>Students</p>
          </div>
          <div className={statisticStyle}>
            <FontAwesomeIcon icon={faUsers} className="text-4xl" />
            <p>1024</p>
            <p>Graduates</p>
          </div>
        </div>
      </section>
      <section className="mt-5">
        <h2 className="mb-5 text-2xl text-center text-gray-400 md:text-3xl font-crimson-text-bold">
          CREDIT HOURS SYSTEM
        </h2>
        <div className={`mb-5 ${containerQuestionStyle}`}>
          <div className="w-1/1 md:w-1/2">
            <h3 className={questionStyle}>What is Credit Hours system?</h3>
            <p className={answerStyle}>
              Simply you are required to get done with a number of credit hours
              across your year of study level or time .
            </p>
          </div>
          <img
            src={aboutImage1}
            alt="aboutImage1"
            className="hidden md:block"
          />
        </div>
        <div className={`mb-5 ${containerQuestionStyle}`}>
          <img
            src={aboutImage2}
            alt="aboutImage1"
            className="hidden md:block"
          />
          <div className="w-1/1 md:w-1/2">
            <h3 className={questionStyle}>
              What is the meaning of a “Credit hour”?
            </h3>
            <p className={answerStyle}>
              A Credit hour is a unit that gives weight to the value, level or
              time requirements of an academic course taken. The number of
              credit hours for each university.
            </p>
          </div>
        </div>
        <div className={containerQuestionStyle}>
          <div className="md:w-3/4 w-1/1">
            <h3 className={questionStyle}>
              How many credit hours am I going to study per semester?
            </h3>
            <p className={answerStyle}>
              If you are supposed to finish university in 5 years you will study
              18 credit hours per semester, unless your GPA gets lower than 2.00
              so you will study only 14 which means that more than semester
              below 2.00 will definitely mean that you are going to graduate
              later than your friends!
            </p>
          </div>
          <img
            src={aboutImage1}
            alt="aboutImage1"
            className="hidden md:block"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
