import React, { useEffect, useState } from 'react';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/UserSidebar';  // Import Sidebar component
import Toolbar from '../components/UserToolbar';  // Import Toolbar component
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const UserDashboard = () => {
   const [userData, setUserData] = useState(globalVariable.getUserData());
   const navigate = useNavigate();  // Initialize useNavigate

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
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-3">
                  <Sidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-5 text-center">
                     <h1 className="text-center">Welcome {userData.f_name} {userData.l_name}</h1>
                     <div>
                        {/* Additional dashboard content can go here */}
                     </div>
                     <div className="row mt-4 justify-content-center"> {/* Apply the class here */}
                        {/* Card content */}
                        <div className="col-md-3">
                           <div className="card" onClick={() => handleNavigation('/login/user_viewstockinventory')}>
                              <div className="card-body">
                                 <h5 className="card-title">Stock Inventory</h5>
                                 <p className="card-text">Browse available stock of products.</p>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-3">
                           <div className="card" onClick={() => handleNavigation('/login/user_reservation')}>
                              <div className="card-body">
                                 <h5 className="card-title">Stock Reservations</h5>
                                 <p className="card-text">View and manage your item reservations.</p>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-3">
                           <div className="card" onClick={() => handleNavigation('/login/user_faqs')}>
                              <div className="card-body">
                                 <h5 className="card-title">FAQ</h5>
                                 <p className="card-text">Frequently asked questions and guides.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserDashboard;