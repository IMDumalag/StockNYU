import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserSidebar from '../components/UserSidebar';
import UserToolbar from '../components/UserToolbar';
import globalVariable from '/src/backend/data/GlobalVariable'; // Import globalVariable

const UserReservation = () => {
   const [items, setItems] = useState([]);
   const [reservations, setReservations] = useState([]); // State for user reservations
   const [currentReservationPage, setCurrentReservationPage] = useState(1); // State for reservation pagination
   const reservationsPerPage = 5; // Items per page for reservations

   useEffect(() => {
      const fetchData = async () => {
         await fetchItems();
      };
      fetchData();
   }, []);
   
   useEffect(() => {
      if (items.length > 0) {
         fetchUserReservations(); // Fetch user reservations after items are fetched
      }
   }, [items]); // Depend on the items array

   const fetchItems = async () => {
      try {
         const response = await axios.get("http://localhost/stock-nyu/src/backend/api/ReadInventoryItems.php");
         if (response.data.status === 200) {
            setItems(response.data.data);
         } else {
            console.error("Error fetching items:", response.data.message);
         }
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   };

   const fetchUserReservations = async () => {
      try {
         const response = await axios.get(`http://localhost/stock-nyu/src/backend/api/ReadUserReservationsById.php?user_id=${globalVariable.getUserData().user_id}`);
         if (response.data.status === 200) {
            const reservationsWithDetails = response.data.reservations
               .filter(reservation => reservation.status !== 'cancelled') // Filter out cancelled reservations
               .map(reservation => {
                  const item = items.find(item => item.item_id === reservation.item_id);
                  return {
                     ...reservation,
                     item_name: item ? item.item_name : 'Unknown',
                     item_image: item ? item.item_image : '',
                     total_price: item ? (item.price * reservation.quantity_reserved).toFixed(2) : '0.00' // Calculate total price
                  };
               });
            setReservations(reservationsWithDetails);
         } else {
            console.error("Error fetching reservations:", response.data.message);
         }
      } catch (error) {
         console.error("Error fetching reservations:", error);
      }
   };

   const paginateReservations = (pageNumber) => {
      setCurrentReservationPage(pageNumber);
   };

   const filteredReservations = reservations.filter(reservation => reservation.status !== 'Cancelled');
   const currentReservations = filteredReservations.slice((currentReservationPage - 1) * reservationsPerPage, currentReservationPage * reservationsPerPage);

   const handleCancelReservation = async (reservation_id) => {
      try {
         const response = await axios.post("http://localhost/stock-nyu/src/backend/api/CancelReservation.php", { reservation_id });
         if (response.data.status === 200) {
            alert("Reservation Cancelled Successfully!");

            // Find the canceled reservation
            const canceledReservation = reservations.find(reservation => reservation.reservation_id === reservation_id);
            if (canceledReservation) {
               // Find the corresponding item
               const item = items.find(item => item.item_id === canceledReservation.item_id);
               if (item) {
                  // Update the item's quantity
                  const updatedQuantity = parseInt(item.quantity) + parseInt(canceledReservation.quantity_reserved);
                  try {
                     const updateResponse = await axios.put(
                        "http://localhost/stock-nyu/src/backend/api/UpdateItemQuantity.php",
                        {
                           item_id: item.item_id,
                           quantity: updatedQuantity, // Increased quantity
                        }
                     );

                     if (updateResponse.data.status === 200) {
                        fetchItems(); // Refresh items to update quantity
                        fetchUserReservations(); // Refresh user reservations
                     } else {
                        alert(updateResponse.data.message || "Failed to update item quantity.");
                     }
                  } catch (error) {
                     console.error("Error updating item quantity:", error);
                     alert("Failed to update item quantity. Please try again.");
                  }
               }
            }
         } else {
            alert(response.data.message || "Cancellation failed.");
         }
      } catch (error) {
         console.error("Error cancelling reservation:", error);
         alert("Cancellation failed. Please try again.");
      }
   };

   return (
      <>
         <UserToolbar />
         <div className="scroll-container" style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
         <div style={{width:'2000px', background: 'radial-gradient(circle, #7b7865, #444f66, #000f29)', backgroundSize: '200% 200%', minHeight: '100vh', paddingTop: '20px', animation: 'bouncyMovement 20s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite'}}>
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-3">
                  <UserSidebar />
               </div>
               <div className="col-md-9" style={{marginTop:'100px'}}>
                  <div className="container mt-5" style={{width:'4000px', marginLeft:"-100px"}}>
                     <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Your Reservation:</h2>
                     {filteredReservations.length === 0 ? (
                        <p style={{ color: '#fff', textAlign: 'center' }}>No reservations found.</p>
                     ) : (
                        <>
                           <table className="table table-bordered" style={{ backgroundColor: '#fff' }}>
                              <thead className="thead-dark">
                                 <tr>
                                    <th>Reservation ID</th>
                                    <th>Item Name</th>
                                    <th>Image</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Quantity Reserved</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {currentReservations.map(reservation => (
                                    <tr key={reservation.reservation_id}>
                                       <td>{reservation.reservation_id}</td>
                                       <td>{reservation.item_name}</td>
                                       <td>
                                          <img
                                             src={reservation.item_image}
                                             alt={reservation.item_name}
                                             style={{ width: "100px", height: "100px", cursor: "pointer", display: "block", margin: "0 auto" }}
                                          />
                                       </td>
                                       <td>{reservation.reservation_date_start}</td>
                                       <td>{reservation.reservation_date_end}</td>
                                       <td>{reservation.quantity_reserved}</td>
                                       <td>${reservation.total_price}</td>
                                       <td>{reservation.status}</td>
                                       <td>
                                          {reservation.status !== 'cancelled' && (
                                             <button
                                                className="btn btn-danger"
                                                onClick={() => handleCancelReservation(reservation.reservation_id)}
                                             >
                                                Cancel
                                             </button>
                                          )}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>

                           {/* Pagination */}
                           <nav className="d-flex justify-content-center mt-4">
                              <ul className="pagination">
                                 <li className={`page-item ${currentReservationPage === 1 ? "disabled" : ""}`}>
                                    <button
                                       onClick={() => paginateReservations(1)}
                                       className="page-link"
                                       disabled={currentReservationPage === 1}
                                    >
                                       First
                                    </button>
                                 </li>
                                 <li className={`page-item ${currentReservationPage === 1 ? "disabled" : ""}`}>
                                    <button
                                       onClick={() => paginateReservations(currentReservationPage - 1)}
                                       className="page-link"
                                       disabled={currentReservationPage === 1}
                                    >
                                       Previous
                                    </button>
                                 </li>

                                 {Array.from({ length: Math.ceil(filteredReservations.length / reservationsPerPage) }, (_, index) => (
                                    <li key={index + 1} className={`page-item ${currentReservationPage === index + 1 ? "active" : ""}`}>
                                       <button
                                          onClick={() => paginateReservations(index + 1)}
                                          className="page-link"
                                          disabled={currentReservationPage === index + 1}
                                       >
                                          {index + 1}
                                       </button>
                                    </li>
                                 ))}

                                 <li
                                    className={`page-item ${currentReservationPage === Math.ceil(filteredReservations.length / reservationsPerPage) ? "disabled" : ""}`}
                                 >
                                    <button
                                       onClick={() => paginateReservations(currentReservationPage + 1)}
                                       className="page-link"
                                       disabled={currentReservationPage === Math.ceil(filteredReservations.length / reservationsPerPage)}
                                    >
                                       Next
                                    </button>
                                 </li>
                                 <li
                                    className={`page-item ${currentReservationPage === Math.ceil(filteredReservations.length / reservationsPerPage) ? "disabled" : ""}`}
                                 >
                                    <button
                                       onClick={() => paginateReservations(Math.ceil(filteredReservations.length / reservationsPerPage))}
                                       className="page-link"
                                       disabled={currentReservationPage === Math.ceil(filteredReservations.length / reservationsPerPage)}
                                    >
                                       Last
                                    </button>
                                 </li>
                              </ul>
                           </nav>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>
         </div>
      </div>
      </>
   );
};

export default UserReservation;
