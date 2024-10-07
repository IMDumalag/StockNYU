// UserToolbar.jsx

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Toolbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <a className="nav-link" href="#">User Profile</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Message Inbox</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Toolbar;
