// StaffSidebar.jsx

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffSidebar = () => {
  return (
    <div className="bg-light border-right vh-100" id="sidebar-wrapper">
      <div className="sidebar-heading">
        <a href="/login/staff_dashboard" className="list-group-item list-group-item-action bg-light">Dashboard</a>
      </div>
      <div className="list-group list-group-flush">
        <a href="/login/staff_inventorymanagement" className="list-group-item list-group-item-action bg-light">Stock Inventory</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Stock History</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">FAQs and Announcement</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Analytics</a>
      </div>
    </div>
  );
};

export default StaffSidebar;
