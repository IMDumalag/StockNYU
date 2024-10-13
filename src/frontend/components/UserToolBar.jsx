import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person'; // Using PersonIcon for a clearer profile icon
import { useNavigate } from 'react-router-dom';
import globalVariable from '/src/backend/data/GlobalVariable';
import './UserToolbar.css';

const Toolbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Clear global variable user data
        globalVariable.setUserData({});
        globalVariable.setCurrentItem({});
        // Redirect to Home page
        navigate('/home');
        setAnchorEl(null);
    };

    return (
        <nav className="navbar navbar-expand-lg toolbar-gradient border-bottom">
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                    {/* Bell icon */}
                    <li className="nav-item">
                        <IconButton className="message-inbox" color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                    </li>
                    <li className="nav-item user-profile">
                        <IconButton color="inherit" className="profile-icon">
                            <Avatar>
                                <PersonIcon /> 
                            </Avatar>
                        </IconButton>
                        <span className="username">user_student</span>
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
            </div>
        </nav>
    );
};

export default Toolbar;
