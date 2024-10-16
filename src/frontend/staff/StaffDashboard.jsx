import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import axios from 'axios';

const StaffDashboard = () => {
   const [userData, setUserData] = useState(globalVariable.getUserData());
   const [mostReservedItem, setMostReservedItem] = useState(null);
   const [mostCancelledItem, setMostCancelledItem] = useState(null);
   const [recentStockChanges, setRecentStockChanges] = useState([]);
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

   useEffect(() => {
      fetchMostReservedItem();
      fetchMostCancelledItem();
      fetchRecentStockChanges();
   }, []);

   const fetchMostReservedItem = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/AnalyticsMostReservedItem.php');
         if (response.data.status === 200) {
            setMostReservedItem(response.data.most_reserved_items);
         }
      } catch (error) {
         console.error('Error fetching most reserved item:', error);
      }
   };
   
   const fetchMostCancelledItem = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/AnalyticsMostItemReservationCancelled.php');
         if (response.data.status === 200) {
            setMostCancelledItem(response.data.most_cancelled_items);
         }
      } catch (error) {
         console.error('Error fetching most cancelled item:', error);
      }
   };
   

   const fetchRecentStockChanges = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/readStockChange.php');
         const sortedStockChanges = response.data.sort((a, b) => {
            const idA = parseInt(a.change_id.replace('SC-', ''), 10);
            const idB = parseInt(b.change_id.replace('SC-', ''), 10);
            return idB - idA;
         });
         setRecentStockChanges(sortedStockChanges.slice(0, 5)); // Get the 5 most recent stock changes
      } catch (error) {
         console.error('Error fetching recent stock changes:', error);
      }
   };

   const handleAnalyticsClick = () => {
      navigate('/login/staff_analytics', {
         state: {
            mostReservedItem,
            mostCancelledItem
         }
      });
   };

   const handleStockHistoryClick = () => {
      navigate('/login/staff_stockhistory');
   };

   return (
      <>
         <StaffToolbar />
         <div className="container-fluid" style={{ paddingTop: '100px'}}>
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-4" style={{ marginLeft: '100px'}}>
                     <h1>Welcome {userData.fname} {userData.lname}</h1>
                     <div className="row mt-4">
                        <div className="col-md-6">
                           <div className="card" onClick={handleAnalyticsClick} style={{ cursor: 'pointer' }}>
                              <div className="card-body">
                                 <h5 className="card-title">Staff Analytics</h5>
                                 <p className="card-text">View detailed analytics about staff activities.</p>
                                 {mostReservedItem && mostReservedItem.length > 0 && (
                                    <div>
                                       <h6>Top Reserved Item: {mostReservedItem[0].item_name}</h6>
                                       <p>Reservations: {mostReservedItem[0].reservation_count}</p>
                                    </div>
                                 )}

                                 {mostCancelledItem && mostCancelledItem.length > 0 && (
                                    <div>
                                       <h6>Top Cancelled Item: {mostCancelledItem[0].item_name}</h6>
                                       <p>Cancellations: {mostCancelledItem[0].cancellation_count}</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="card" onClick={handleStockHistoryClick} style={{ cursor: 'pointer' }}>
                              <div className="card-body">
                                 <h5 className="card-title">Stock History</h5>
                                 <p className="card-text">View the history of stock changes.</p>
                                 <ul>
                                    {recentStockChanges.map((change, index) => (
                                       <li key={index}>
                                          {change.item_name}: {change.quantity_added - change.quantity_subtracted} (at {new Date(change.created_at).toLocaleString()}) - Note: {change.note}
                                       </li>
                                    ))}
                                 </ul>
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
}

export default StaffDashboard;