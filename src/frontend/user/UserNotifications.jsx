import React, { useState, useEffect } from 'react';
import './UserNotifications.css'; // Custom CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import UserToolbar from '../components/UserToolbar';
import UserSidebar from '../components/UserSidebar';
import globalVariable from '/src/backend/data/GlobalVariable'; // Import globalVariable
import { FaTrash } from 'react-icons/fa'; // Import delete icon

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const userId = globalVariable.getUserData().user_id; // Get user ID from globalVariable

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost/stock-nyu/src/backend/api/GetMessagesByRecieverId.php?reciever_id=${userId}`
        );
        const data = await response.json();
        if (data.status === 200) {
          const sortedMessages = data.messages.sort((a, b) => new Date(b.sent_date) - new Date(a.sent_date));
          setNotifications(sortedMessages);
        } else {
          console.error('Failed to fetch messages:', data.message);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleCardClick = (notification) => {
    if (selectedNotification && selectedNotification.message_id === notification.message_id) {
      setSelectedNotification(null); // Deselect if the same notification is clicked
    } else {
      setSelectedNotification(notification); // Select the clicked notification
    }
  };

  const handleDelete = async (message_id) => {
    try {
      const response = await fetch(`http://localhost/stock-nyu/src/backend/api/DeleteMessages.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message_id }),
      });
      const data = await response.json();
      if (data.status === 200) {
        setNotifications(notifications.filter(notification => notification.message_id !== message_id));
        if (selectedNotification?.message_id === message_id) {
          setSelectedNotification(null);
        }
      } else {
        console.error('Failed to delete message:', data.message);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <>
      <div className="scroll-container" style={{ overflowY: 'scroll', maxHeight: '100%' }}>
        <UserToolbar /> {/* Toolbar */}
        <div className="d-flex" style={{ paddingTop: '60px' }}>
          <UserSidebar /> {/* Sidebar */}

          <div className="notifications-container d-flex flex-grow-1">
            {/* Notifications list column */}
            <div
              className="notifications-list p-3"
              style={{
                width: '30%',
                borderRight: '1px solid #ccc',
                overflowY: 'scroll',
                maxHeight: '100%',
              }}
            >
              {notifications.map((notification) => (
                <div
                  className={`notification-item p-2 mb-2 ${
                    selectedNotification?.message_id === notification.message_id ? 'selected' : ''
                  }`}
                  key={notification.message_id}
                  onClick={() => handleCardClick(notification)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'none' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{notification.f_name} {notification.l_name}</h6>
                      <p className="small text-muted mb-0">
                        {notification.message.substring(0, 30)}...
                      </p>
                    </div>
                    <FaTrash
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.message_id);
                      }}
                      style={{ cursor: 'pointer', color: 'red' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected notification details */}
            <div className="notification-details p-4 card" style={{ width: '70%' , transition:'none' , transform:'none'}}>
              {selectedNotification ? (
                <>
                  <h4>From: {selectedNotification.f_name} {selectedNotification.l_name}</h4>
                  <p>{selectedNotification.message}</p>
                  <p className="small text-muted"> {selectedNotification.sent_date}</p>
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
