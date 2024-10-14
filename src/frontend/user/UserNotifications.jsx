import React, { useState } from 'react';
import './UserNotifications.css'; // Custom CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import UserToolbar from '../components/UserToolbar';
import UserSidebar from '../components/UserSidebar';

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifications = [...Array(10)].map((_, index) => ({
    id: index + 1,
    title: `Notification ${index + 1}`,
    content: `This is the content of notification ${index + 1}.`,
  }));

  const handleCardClick = (notification) => {
    if (selectedNotification && selectedNotification.id === notification.id) {
      setSelectedNotification(null); // Deselect if the same notification is clicked
    } else {
      setSelectedNotification(notification); // Select the clicked notification
    }
  };

  return (
    <>
      <div className="scroll-container" style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
        <UserToolbar /> {/* Toolbar */}
        <div className="d-flex" style={{ paddingTop: '60px' }}>
          <UserSidebar /> {/* Sidebar */}

          <div className="notifications-container d-flex flex-grow-1">
            {/* Notifications list column */}
            <div className="notifications-list p-3" style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'scroll', maxHeight: '80vh' }}>
              {notifications.map((notification) => (
                <div
                  className={`notification-item p-2 mb-2 ${selectedNotification?.id === notification.id ? 'selected' : ''}`}
                  key={notification.id}
                  onClick={() => handleCardClick(notification)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  <h6 className="mb-1">{notification.title}</h6>
                  <p className="small text-muted mb-0">{notification.content.substring(0, 30)}...</p>
                </div>
              ))}
            </div>

            {/* Selected notification details */}
            <div className="notification-details p-4" style={{ width: '70%' }}>
              {selectedNotification ? (
                <>
                  <h4>{selectedNotification.title}</h4>
                  <p>{selectedNotification.content}</p>
                </>
              ) : (
                <div className="text-muted">Select a notification to view details</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
