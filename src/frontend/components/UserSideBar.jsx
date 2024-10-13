import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserSidebar.css'; 
import { Link } from 'react-router-dom'; 

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(true); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <>
      <button 
        className={`btn ${isOpen ? 'hamburger-open' : 'hamburger-closed'}`} 
        id="menu-toggle" 
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div className={`sidebar-wrapper ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <br></br>
        <div className="custom-bg vh-100">
          <div className="list-group list-group-flush">
            <Link to="/login/user_dashboard" className="list-group-item list-group-item-action custom-text">Dashboard</Link>

            <hr className="menu-divider" />

            <Link to="/login/user_viewstockinventory" className="list-group-item list-group-item-action custom-text">Stock Inventory</Link>

            <hr className="menu-divider" />

            <Link to="/login/user_reservation" className="list-group-item list-group-item-action custom-text">Stock Reservation</Link>

            <hr className="menu-divider" />

            <Link to="/login/user_faqs" className="list-group-item list-group-item-action custom-text">FAQ</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
