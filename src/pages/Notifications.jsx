import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faTimes,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentNotifications,
  fetchProfessorNotifications,
  fetchAdminNotifications,
} from "../redux/slices/fetchNotificationsSlice";
import StatusMessage from "../components/StatusMessage";

const Notifications = () => {
  // Style constants
  const cardStyles = "p-4 bg-white rounded-lg shadow-md border-l-4";
  const textGray600 = "text-sm text-gray-600";
  const textGray700 = "text-base text-gray-700";
  const actionButtonStyles = "text-sm hover:text-gray-700";

  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch data from Redux
  const { data, loading, error } = useSelector(
    (state) => state.fetchNotifications
  );
  const { role } = useSelector((state) => state.auth);

  // Fetch notifications based on role
  useEffect(() => {
    switch (role) {
      case "Student":
        dispatch(fetchStudentNotifications());
        break;
      case "Professor":
        dispatch(fetchProfessorNotifications());
        break;
      case "Admin":
        dispatch(fetchAdminNotifications());
        break;
      default:
        navigate("/");
    }
  }, [dispatch, role, navigate]);

  // Update notifications when data is available
  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);
console.log(data);
  const handleClose = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.notification_id !== id)
    );
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notification_id === id
          ? { ...notification, is_read: 1 }
          : notification
      )
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Review":
        return { icon: faCheckCircle, color: "text-green-500" };
      case "Failed":
        return { icon: faTimesCircle, color: "text-red-500" };
      case "Warning":
        return { icon: faExclamationCircle, color: "text-yellow-500" };
      default:
        return { icon: faCheckCircle, color: "text-green-500" };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || error) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen font-crimson-text-regular">
      {/* Title with Icon */}
      <h1 className="flex items-center justify-center max-w-4xl p-3 mx-auto mb-6 space-x-2 text-2xl text-center text-white bg-primary rounded-t-2xl">
        <FontAwesomeIcon icon={faBell} />
        <span>Track Your Notifications & Upcoming Events</span>
      </h1>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-600">No notifications available</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const { icon, color } = getNotificationIcon(
              notification.notify_type
            );
            return (
              <div
                key={notification.notification_id}
                className={`${cardStyles} ${color}`}
              >
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <div className={`text-2xl ${color}`}>
                      <FontAwesomeIcon icon={icon} />
                    </div>
                    <div>
                      <h1 className="text-xl font-crimson-text-semibold">
                        {notification.receiver_name} -{" "}
                        {notification.notify_type}
                      </h1>
                      <div className={textGray600}>
                        <p>
                          From: {notification.sender_name} (
                          {notification.sender_email})
                        </p>
                        <p>
                          To: {notification.receiver_name} (
                          {notification.receiver_email})
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => handleClose(notification.notification_id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(notification.sent_at)}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <p className={`mt-2 ${textGray700}`}>{notification.message}</p>

                {/* Action Buttons */}
                <div className="flex items-center mt-3 space-x-4">
                  {notification.notify_type === "Review" && (
                    <Link
                      to={
                        role === "Student"
                          ? "/student/registration"
                          : role === "Professor"
                          ? "/professor/registration"
                          : "/admin/registration"
                      }
                      className={`${actionButtonStyles} text-green-600 hover:text-green-700`}
                    >
                      View Registration
                    </Link>
                  )}
                  {notification.is_read === 0 && (
                    <button
                      onClick={() =>
                        handleMarkAsRead(notification.notification_id)
                      }
                      className={`${actionButtonStyles} text-gray-600`}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
