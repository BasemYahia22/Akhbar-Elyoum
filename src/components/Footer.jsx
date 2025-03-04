import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTelegram } from "@fortawesome/free-brands-svg-icons"; // Brand icons
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons"; // Solid icons

const Footer = () => {
  const socialLinkStyle = "text-white transition duration-300";
  return (
    <footer className="p-5 text-center text-white bg-primary">
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
            className={`${socialLinkStyle} hover:text-blue-400`}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`${socialLinkStyle} hover:text-blue-500`}
          >
            <FontAwesomeIcon icon={faTelegram} />
          </a>
          <a href="#" className={`${socialLinkStyle} hover:text-green-500`}>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </a>
          <a
            href="tel:+1234567890"
            className={`${socialLinkStyle} hover:text-green-500`}
          >
            <FontAwesomeIcon icon={faPhoneAlt} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
