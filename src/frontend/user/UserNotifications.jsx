import React, { useState } from 'react';
import './UserNotifications.css'; // Import the CSS file for Notifications
import 'bootstrap/dist/css/bootstrap.min.css';
import UserToolbar from '../components/UserToolbar'; // Import the UserToolbar component
import UserSidebar from '../components/UserSidebar'; // Import the UserSidebar component

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifications = [...Array(10)].map((_, index) => ({
    id: index + 1,
    title: `Notification ${index + 1}`,
    content: `This is the content of notification ${index + 1}.`
  }));

  const handleCardClick = (notification) => {
    if (selectedNotification && selectedNotification.id === notification.id) {
      setSelectedNotification(null); // Deselect if the same notification is clicked
    } else {
      setSelectedNotification(notification); // Select the clicked notification
    }
  };

  return (
    <div>
      <UserToolbar /> {/* Add the toolbar */}
      <div className="d-flex">
        <UserSidebar /> {/* Add the sidebar */}
        <div className="notifications-container flex-grow-1">
          <div className="scrollable-column">
            {notifications.map((notification) => (
              <div
                className="card mb-3"
                key={notification.id}
                onClick={() => handleCardClick(notification)}
                style={{ cursor: 'pointer', margin: 0 }} // Ensure no margin on cards
              >
                <div className="card-body">
                  <h5 className="card-title">{notification.title}</h5>
                  <p className="card-text">{notification.content}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedNotification && (
            <div className="main-content">
              <div className="selected-notification">
                <h1>{selectedNotification.title}</h1>
                <p>{selectedNotification.content}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;