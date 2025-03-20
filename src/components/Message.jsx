import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Message = ({ message, type, onClose }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (message) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 600); // Allow time for bounce-out animation before closing
      }, 3000); // Hide the message after 3 seconds
    }
  }, [message, onClose]);

  // Define a mapping between type and icon
  const iconMap = {
    success: faCheckCircle,
    error: faTimesCircle,
    warning: faExclamationCircle,
  };

  // Get the icon based on the type
  const icon = iconMap[type] || faExclamationCircle; // Default to warning icon if type is not recognized

  return (
    message && (
      <div
        className={`bg-white w-fit fixed z-20 top-4 right-4 p-4 flex items-center justify-between px-5 rounded-lg shadow-lg transition-all duration-500 ${
          show ? "animate-bounceIn" : "animate-bounceOut"
        }`}
      >
        <div
          className={`flex items-center w-full p-3 rounded-lg justify-between ${
            type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          <span>
            <FontAwesomeIcon icon={icon} className="mr-2" />
            {message}
          </span>
          <button onClick={onClose} className="ml-5 text-black">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    )
  );
};

export default Message;
