// UserToolandSideBar.jsx

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable

const UserToolandSideBar = ({ children }) => {
   const [userData, setUserData] = useState(globalVariable.getUserData());

   useEffect(() => {
      const updateListener = () => {
         setUserData(globalVariable.getUserData());
      };

      globalVariable.subscribe(updateListener); // Subscribe to global variable updates

      return () => {
         globalVariable.unsubscribe(updateListener); // Unsubscribe when component unmounts
      };
   }, []);

   return (
      <div className="d-flex" id="wrapper">
         {/* Sidebar */}
         <div className="bg-light border-right" id="sidebar-wrapper">
            <div className="sidebar-heading">
            <a href="/login/user_dashboard" className="list-group-item list-group-item-action bg-light">Dashboard</a>
            </div>
            <div className="list-group list-group-flush">
               <a href="/login/user_viewstockinventory" className="list-group-item list-group-item-action bg-light">Stock Inventory</a>
               <a href="#" className="list-group-item list-group-item-action bg-light">Stock Reservation</a>
               <a href="#" className="list-group-item list-group-item-action bg-light">FAQ</a>
            </div>
         </div>
         {/* /#sidebar-wrapper */}

         {/* Page Content */}
         <div id="page-content-wrapper">
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

            <div className="container-fluid mt-4 d-flex justify-content-center">
               <div>
                  {children}
               </div>
            </div>
         </div>
         {/* /#page-content-wrapper */}
      </div>
   );
};

export default UserToolandSideBar;
