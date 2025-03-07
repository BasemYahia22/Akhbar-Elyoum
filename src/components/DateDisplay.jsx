import React from "react";

const DateDisplay = () => {
  // Get the current date
  const today = new Date();

  // Format the date as desired (e.g., "Monday, October 9, 2023")
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString(undefined, options);

  return (
    <div>
      <p className="text-lg text-gray-200">{formattedDate}</p>
    </div>
  );
};

export default DateDisplay;
