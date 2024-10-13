import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './StaffSidebar.css'; 
import { Link } from 'react-router-dom'; 

const StaffSidebar = () => {
  const [isOpen, setIsOpen] = useState(true); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <>
      <button className="btn btn-primary" id="menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar-wrapper ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="custom-bg vh-100">
          <div className="list-group list-group-flush">
            <Link to="/login/user_dashboard" className="list-group-item list-group-item-action custom-text">Dashboard</Link>
            <Link to="/login/user_viewstockinventory" className="list-group-item list-group-item-action custom-text">Stock Inventory</Link>
            <Link to="/login/user_reservation" className="list-group-item list-group-item-action custom-text">Stock Reservation</Link>
            <Link to="/login/user_faqs" className="list-group-item list-group-item-action custom-text">FAQ</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffSidebar;
