import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
const FilterSection = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
const dropdownStyle = "flex flex-col gap-1";
const selectStyle = "p-2 border rounded-lg border-primary focus:outline-none";
  const handleSearch = () => {
    // Add your logic to filter results based on selectedYear and selectedSemester
    console.log("Selected Year:", selectedYear);
    console.log("Selected Semester:", selectedSemester);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-sm">
      {/* Year Dropdown */}
      <div className={dropdownStyle}>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={selectStyle}
        >
          <option value="">Select Year</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>

      {/* Semester Dropdown */}
      <div className={dropdownStyle}>
        <select
          id="semester"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className={selectStyle}
        >
          <option value="">Select Semester</option>
          <option value="all">All Semesters</option>
          <option value="sem1">Semester 1</option>
          <option value="sem2">Semester 2</option>
        </select>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 px-4 py-2 text-white rounded-md bg-primary focus:outline-none "
      >
        <FontAwesomeIcon icon={faSearch} />
        <span>View Results</span>
      </button>
    </div>
  );
};

export default FilterSection;
