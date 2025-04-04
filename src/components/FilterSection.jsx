import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { fetchStudentGrades } from "../redux/slices/searchGradesSlice";

const FilterSection = () => {
  // State for selected filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // Redux dispatch hook
  const dispatch = useDispatch();

  // Style constants
  const dropdownStyle = "flex flex-col gap-1";
  const selectStyle = "p-2 border rounded-lg border-primary focus:outline-none";

  /**
   * Handles search button click by dispatching fetch action with current filters
   */
  const handleSearch = () => {
    const credentials = {
      squad_number: selectedYear,
      semester_name: selectedSemester,
    };
    dispatch(fetchStudentGrades(credentials));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-sm">
      {/* Year Selection Dropdown */}
      <div className={dropdownStyle}>
        <label htmlFor="year" className="sr-only">
          Select Year
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={selectStyle}
        >
          <option value="">Select Year</option>
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
          <option value="4">Fourth Year</option>
        </select>
      </div>

      {/* Semester Selection Dropdown */}
      <div className={dropdownStyle}>
        <label htmlFor="semester" className="sr-only">
          Select Semester
        </label>
        <select
          id="semester"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className={selectStyle}
        >
          <option value="">Select Semester</option>
          <option value="first semester">Semester 1</option>
          <option value="second semester">Semester 2</option>
        </select>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 px-4 py-2 text-white rounded-md bg-primary focus:outline-none"
        aria-label="Search for grades"
      >
        <FontAwesomeIcon icon={faSearch} />
        <span>View Results</span>
      </button>
    </div>
  );
};

export default FilterSection;
