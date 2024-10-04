import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

function BasicCRUD() {
  const [userId, setUserId] = useState('');

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/basic_crud">Basic CRUD</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/basic_crud/create_user">Create User</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/basic_crud/read_user">Read User</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/basic_crud/update_user">Update User</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/basic_crud/delete_user">Deletes User</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/basic_crud/inventory_items_crud">Inventory Items</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Render the nested routes here */}
      <Outlet />
    </div>
  );
}

export default BasicCRUD;