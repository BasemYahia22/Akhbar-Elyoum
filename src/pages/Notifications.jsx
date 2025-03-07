// Notifications.js
import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faTimes,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { NotificationsContext } from "../context/NotificationsContext";

const Notifications = () => {
  const { notifications, handleClose, handleMarkAsRead } =
    useContext(NotificationsContext);

  // Get icon and color based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return { icon: faCheckCircle, color: "text-green-500" };
      case "failed":
        return { icon: faTimesCircle, color: "text-red-500" };
      case "warning":
        return { icon: faExclamationCircle, color: "text-yellow-500" };
      default:
        return { icon: faCheckCircle, color: "text-green-500" };
    }
  };

  return (
    <div className="min-h-screen font-crimson-text-regular">
      {/* Title with Icon */}
      <h1 className="max-w-4xl text-2xl mb-6 bg-primary text-white text-center p-3 mx-auto rounded-t-2xl flex items-center justify-center space-x-2">
        <FontAwesomeIcon icon={faBell} />
        <span>Track Your Notifications & Upcoming Events</span>
      </h1>

      {/* Notifications List */}
      <div className="mx-auto space-y-4 max-w-4xl">
        {notifications.map((notification) => {
          const { icon, color } = getNotificationIcon(notification.type);
          return (
            <div
              key={notification.id}
              className={`p-4 bg-white rounded-lg shadow-md border-l-4 ${color}`}
            >
              {/* Icon, Title, and Close Icon */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <div className={`text-2xl ${color}`}>
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <h2 className="text-xl font-crimson-text-semibold">
                    {notification.name}
                  </h2>
                </div>
                <button
                  onClick={() => handleClose(notification.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* Date */}
              <p className="text-sm text-gray-500 mt-1">{notification.date}</p>

              {/* Description */}
              <p className="text-gray-700 mt-2 text-base">
                {notification.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-3">
                <Link
                  to="/student/registration"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  View Registration
                </Link>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
