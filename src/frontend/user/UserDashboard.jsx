import React, { useEffect, useState } from 'react';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/UserSidebar';  // Import Sidebar component
import Toolbar from '../components/UserToolbar';  // Import Toolbar component
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const [userData, setUserData] = useState(globalVariable.getUserData());
    const navigate = useNavigate();

    useEffect(() => {
        const updateListener = () => {
            setUserData(globalVariable.getUserData());
        };
        globalVariable.subscribe(updateListener); // Subscribe to global variable updates
        return () => {
            globalVariable.unsubscribe(updateListener); // Unsubscribe when component unmounts
        };
    }, []);

    const handleNavigation = (path) => {
        navigate(path);  // Navigate to the specified path
    };

    return (
        <>
            <Toolbar />
            <div className="dashboard-container">
                <Sidebar />
                <div className="content-wrapper">
                    <div className="background-image"></div>
                    <div className="line-box"></div>
                    <h1 className="text-center welcome-text">
                        Welcome <strong className="highlighted-text">{userData.fname}</strong> <strong className="highlighted-text">{userData.lname} !</strong>
                    </h1>
                    <br></br>
                    <div className="dashboard-cards">
                        <div className="dashboard-card" onClick={() => handleNavigation('/login/user_viewstockinventory')}>
                            <img src="/src/assets/inventory icon.png" alt="Inventory Icon" className="card-image" />
                            <h5 className="card-title">Stock Inventory</h5>
                            <p className="card-text">Browse available stock of products.</p>
                        </div>
                        <div className="dashboard-card" onClick={() => handleNavigation('/login/user_reservation')}>
                            <img src="/src/assets/reservation icon.png" alt="Reservation Icon" className="card-image" />
                            <h5 className="card-title">Stock Reservations</h5>
                            <p className="card-text">View and manage your item reservations.</p>
                        </div>
                        <div className="dashboard-card" onClick={() => handleNavigation('/login/user_faqs')}>
                            <img src="/src/assets/faq icon.png" alt="FAQ Icon" className="card-image" />
                            <h5 className="card-title">FAQ</h5>
                            <p className="card-text">Frequently asked questions and guides.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDashboard;
