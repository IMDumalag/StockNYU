import React, { useState } from 'react';
import '../components/css/Notifications.css'; // Import the CSS file for Notifications

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifications = [...Array(10)].map((_, index) => ({
    id: index + 1,
    title: `Notification ${index + 1}`,
    content: `This is the content of notification ${index + 1}.`
  }));

  const handleCardClick = (notification) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="notifications-container">
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
      <div className="main-content">
        {selectedNotification ? (
          <div className="selected-notification">
            <h1>{selectedNotification.title}</h1>
            <p>{selectedNotification.content}</p>
          </div>
        ) : (
          <div className="placeholder">
            <h1>Main Content</h1>
            <p>Select a notification to view its content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;