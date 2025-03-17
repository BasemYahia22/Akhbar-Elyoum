import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-xs p-6 bg-white rounded-lg shadow-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
          <button
            onClick={onClose} // Close modal
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <p className="mb-6 text-gray-600">
          If you’ve forgotten your password, follow these steps to reset it:
        </p>
        <ol className="space-y-4 list-decimal list-inside">
          <li>
            <strong className="font-semibold text-gray-700">
              Send an Email to the Admin:
            </strong>
            <ul className="pl-5 mt-2 space-y-2 list-disc list-inside">
              <li>
                Compose an email with the subject:{" "}
                <strong>"Forget Password"</strong>.
              </li>
              <li>
                In the body of the email, include:
                <ul className="pl-5 mt-2 space-y-2 list-inside list-circle">
                  <li>
                    Your <strong>registered email address</strong>.
                  </li>
                  <li>
                    Your <strong>student code</strong>.
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <strong className="font-semibold text-gray-700">
              Wait for a Response:
            </strong>
            <ul className="pl-5 mt-2 space-y-2 list-disc list-inside">
              <li>
                The admin will send you new password.
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
