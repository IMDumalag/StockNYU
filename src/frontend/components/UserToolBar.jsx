import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import globalVariable from '/src/backend/data/GlobalVariable';
import './UserToolbar.css';

const Toolbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const location = useLocation(); // Get current route

    // State to hold the dashboard text
    const [dashboardText, setDashboardText] = useState('DASHBOARD');


    useEffect(() => {
        switch (location.pathname) {
            case '/login/user_dashboard':
                setDashboardText('DASHBOARD');
                break;
            case '/login/user_viewstockinventory':
                setDashboardText('STOCK INVENTORY');
                break;
            case '/login/user_reservation':
                setDashboardText('STOCK RESERVATION');
                break;
            case '/login/user_faqs':
                setDashboardText('FAQ');
                break;
                case '/login/user_notifications':
            setDashboardText('NOTIFICATIONS');
                break;
            default:
                setDashboardText('DASHBOARD'); // Default text
                break;
        }
    }, [location.pathname]); // Run effect when pathname changes

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

    const handleNotificationsClick = () => {
        navigate('/login/user_notifications'); // Navigate to UserNotifications
    };

    return (
        <nav className="navbar navbar-expand-lg toolbar-gradient border-bottom">
            <img src="/src/assets/nu_bulldogs_logo-removebg-preview 3.png" alt="Logo" className="logo" />

            <div className="navbar-text">
                {dashboardText}
            </div>

            <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                <li className="nav-item">
                    <IconButton className="message-inbox" color="inherit" onClick={handleNotificationsClick}>
                        <NotificationsIcon />
                    </IconButton>
                </li>
                <li className="nav-item user-profile">
                    <Avatar className="avatar">
                        <img src="/src/assets/Male User.png" alt="Profile Icon" className="profile-image" />
                    </Avatar>
                    <span className="username">user</span>
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

export default Toolbar;