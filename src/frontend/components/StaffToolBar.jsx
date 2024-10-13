import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, useLocation } from 'react-router-dom';
import globalVariable from '/src/backend/data/GlobalVariable';
import './StaffToolbar.css';

const StaffToolbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const location = useLocation();

    const [dashboardText, setDashboardText] = useState('DASHBOARD');

    useEffect(() => {
        switch (location.pathname) {
            case '/login/staff_dashboard':
                setDashboardText('DASHBOARD');
                break;
            case '/login/staff_inventorymanagement':
                setDashboardText('INVENTORY MANAGEMENT');
                break;
            case '/login/staff_stockhistory':
                setDashboardText('STOCK HISTORY');
                break;
            case '/login/staff_faqsandannouncement':
                setDashboardText('FAQS AND ANNOUNCEMENT');
                break;
            case '/login/staff_faqs':
                setDashboardText('FAQS');
                break;
            case '/login/staff_announcement':
                setDashboardText('ANNOUNCEMENT');
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

    const handleNotificationsClick = () => {
        navigate('/login/staff_notifications');
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