import React, { useEffect, useState } from 'react';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';

const StaffDashboard = () => {
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
         <StaffToolbar />
         <div className="container-fluid" style={{ paddingTop: '100px'}}>
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-4" style={{ marginLeft: '-200px'}}>
                     <h1>Welcome {userData.f_name} {userData.l_name}</h1>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}

export default StaffDashboard;
