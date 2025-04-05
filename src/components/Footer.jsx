import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  // Get current theme mode
  const { isDarkMode } = useContext(ThemeContext);

  // Style constants
  const socialLinkStyle = "transition duration-300";
  const footerBgStyle = isDarkMode ? "bg-gray-800" : "bg-primary";
  const socialIconColor = isDarkMode ? "text-gray-300" : "text-white";

  return (
    <footer className={`p-5 text-center text-white ${footerBgStyle}`}>
      {/* Footer links and visit counter */}
      <p>
        Terms of Use | Privacy Policy | FAQ | Customer Service Character |
        Number of Visits: 134565
      </p>

      {/* Footer bottom section - copyright and social links */}
      <div className="flex flex-col items-center justify-between md:flex-row">
        {/* Copyright text */}
        <p className="flex-1 text-center font-crimson-text-regular">
          ©Akhbar Elyoum Academy 2020-2025
        </p>

        {/* Social media and contact links */}
        <div className="flex space-x-4">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${socialLinkStyle} ${socialIconColor} hover:text-blue-400`}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>

          {/* Telegram */}
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`${socialLinkStyle} ${socialIconColor} hover:text-blue-500`}
          >
            <FontAwesomeIcon icon={faTelegram} />
          </a>

          {/* Location */}
          <a
            href="#"
            className={`${socialLinkStyle} ${socialIconColor} hover:text-green-500`}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </a>
          
          {/* Phone */}
          <a
            href="tel:+1234567890"
            className={`${socialLinkStyle} ${socialIconColor} hover:text-green-500`}
          >
            <FontAwesomeIcon icon={faPhoneAlt} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
