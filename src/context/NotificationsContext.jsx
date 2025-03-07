// NotificationsContext.js
import React, { createContext, useState } from "react";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "Course Registration Success",
      type: "success",
      date: "2023-10-25",
      description:
        "Your course registration for Fall 2024 has been approved. You are now registered for the following courses: Advanced Programming, Database Systems, and Web Development",
      isRead: false,
    },
    {
      id: 2,
      name: "Course Registration Failed",
      type: "failed",
      date: "2023-10-24",
      description:
        "Your course registration request has been rejected. Reason: Prerequisites not met for Software Engineering (CS403). Please review the course requirements and submit a new registration.",
      isRead: false,
    },
    {
      id: 3,
      name: "Upcoming Deadline",
      type: "warning",
      date: "2023-10-23",
      description:
        "The course registration deadline for the upcoming semester is approaching. Please complete your registration before September 30, 2024.",
      isRead: false,
    },
  ]);

  const handleClose = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    handleClose(id);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, handleClose, handleMarkAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
