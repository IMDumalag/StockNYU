// UserSidebar.jsx

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <div className="bg-light border-right vh-100" id="sidebar-wrapper">
      <div className="sidebar-heading">
        <a href="/login/user_dashboard" className="list-group-item list-group-item-action bg-light">Dashboard</a>
      </div>
      <div className="list-group list-group-flush">
        <a href="/login/user_viewstockinventory" className="list-group-item list-group-item-action bg-light">Stock Inventory</a>
        <a href="/login/user_reservation" className="list-group-item list-group-item-action bg-light">Stock Reservation</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">FAQ</a>
      </div>
    </div>
  );
};

export default Sidebar;
