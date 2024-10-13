import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import globalVariable from '/src/backend/data/GlobalVariable';
import './StaffToolbar.css'; // Make sure to create and import the CSS file

const StaffToolbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const [dashboardText, setDashboardText] = useState('DASHBOARD');

  useEffect(() => {
    switch (location.pathname) {
      case '/staff/dashboard':
        setDashboardText('DASHBOARD');
        break;
      case '/staff/inventory':
        setDashboardText('INVENTORY');
        break;
      case '/staff/reservations':
        setDashboardText('RESERVATIONS');
        break;
      case '/staff/faqs':
        setDashboardText('FAQ');
        break;
      case '/staff/notifications':
        setDashboardText('NOTIFICATIONS');
        break;
      default:
        setDashboardText('DASHBOARD');
        break;
    }
  }, [location.pathname]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    globalVariable.setUserData({});
    globalVariable.setCurrentItem({});
    navigate('/home');
    setAnchorEl(null);
  };

  return (
    <nav className="navbar navbar-expand-lg toolbar-gradient border-bottom">
      <img src="/src/assets/nu_bulldogs_logo-removebg-preview 3.png" alt="Logo" className="logo" />

      <div className="navbar-text">
        {dashboardText}
      </div>

      <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
        <li className="nav-item user-profile">
          <Avatar className="avatar">
            <img src="/src/assets/Male User.png" alt="Profile Icon" className="profile-image" />
          </Avatar>
          <span className="username">staff</span>
          <IconButton onClick={handleClick} color="inherit">
            <img src="/src/assets/Expand Arrow.png" alt="Expand Arrow" className="dropdown-arrow" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </li>
      </ul>

      <img src="/src/assets/bulldog icon.png" alt="Bulldog Logo" className="bulldog-logo" />
    </nav>
  );
};

export default StaffToolbar;
