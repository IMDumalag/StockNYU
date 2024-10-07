import React, { useEffect, useState } from 'react';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/UserSidebar';  // Import Sidebar component
import Toolbar from '../components/UserToolbar';  // Import Toolbar component

const UserDashboard = () => {
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
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserDashboard;
