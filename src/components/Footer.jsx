import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTelegram } from "@fortawesome/free-brands-svg-icons"; // Brand icons
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons"; // Solid icons
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  const socialLinkStyle = "transition duration-300";
  return (
    <footer
      className={`p-5 text-center ${
        isDarkMode ? "text-white bg-gray-800" : "text-white bg-primary"
      }`}
    >
      <p>
        Terms of Use | Privacy Policy | FAQ | Customer Service Character |
        Number of Visits: 134565
      </p>
      {/* Flex container for copyright and social links */}
      <div className="flex flex-col items-center justify-between md:flex-row">
        {/* Copyright Text - Centered */}
        <p className="flex-1 text-center font-crimson-text-regular">
          ©Akhbar Elyoum Academy 2020-2025
        </p>
        {/* Social Links - Aligned to the Right */}
        <div className="flex space-x-4">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${socialLinkStyle} ${
              isDarkMode
                ? "text-gray-300 hover:text-blue-400"
                : "text-white hover:text-blue-400"
            }`}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`${socialLinkStyle} ${
              isDarkMode
                ? "text-gray-300 hover:text-blue-500"
                : "text-white hover:text-blue-500"
            }`}
          >
            <FontAwesomeIcon icon={faTelegram} />
          </a>
          <a
            href="#"
            className={`${socialLinkStyle} ${
              isDarkMode
                ? "text-gray-300 hover:text-green-500"
                : "text-white hover:text-green-500"
            }`}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </a>
          <a
            href="tel:+1234567890"
            className={`${socialLinkStyle} ${
              isDarkMode
                ? "text-gray-300 hover:text-green-500"
                : "text-white hover:text-green-500"
            }`}
          >
            <FontAwesomeIcon icon={faPhoneAlt} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
