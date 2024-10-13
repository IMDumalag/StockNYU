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

            <Link to="/login/staff_dashboard" className="list-group-item list-group-item-action custom-text">Dashboard</Link>
            <Link to="/login/staff_inventorymanagement" className="list-group-item list-group-item-action custom-text">Stock Inventory</Link>
            <Link to="/login/staff_stockhistory" className="list-group-item list-group-item-action custom-text">Stock History</Link>
            <Link to="/login/staff_faqsandannouncement" className="list-group-item list-group-item-action custom-text">FAQs and Announcement</Link>
            <Link to="#" className="list-group-item list-group-item-action custom-text">Analytics</Link>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffSidebar;
