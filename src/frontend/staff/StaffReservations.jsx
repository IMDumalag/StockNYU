import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import { Modal, Button } from 'react-bootstrap';
import globalVariable from '/src/backend/data/GlobalVariable';

const StaffReservations = () => {
   const [reservations, setReservations] = useState([]);
   const [items, setItems] = useState([]);
   const [users, setUsers] = useState([]);
   const [currentReservationPage, setCurrentReservationPage] = useState(1);
   const reservationsPerPage = 5;
   const [showModal, setShowModal] = useState(false);
   const [message, setMessage] = useState('');
   const [selectedReservation, setSelectedReservation] = useState(null);
   const [userData, setUserData] = useState(globalVariable.getUserData());
   const [showPurchaseModal, setShowPurchaseModal] = useState(false);
   const [purchaseData, setPurchaseData] = useState({
      purchase_id: '',
      reservation_id: '',
      user_id: '',
      item_id: '',
      purchase_date: '',
      quantity_purchased: '',
      total_price: '',
      sold_by: ''
   });

   useEffect(() => {
      fetchAllReservations();
      fetchItems();
      fetchUsers();
   }, []);

   useEffect(() => {
      const updateListener = () => {
        setUserData(globalVariable.getUserData());
      };
  
      globalVariable.subscribe(updateListener);
  
      return () => {
        globalVariable.unsubscribe(updateListener);
      };
    }, []);

   const fetchAllReservations = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/ReadReservations.php');
         setReservations(response.data);
      } catch (error) {
         console.error('Error fetching reservations:', error);
      }
   };

   const fetchItems = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/ReadInventoryItems.php');
         setItems(response.data.data);
      } catch (error) {
         console.error('Error fetching items:', error);
      }
   };

   const fetchUsers = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/ReadUser.php');
         setUsers(response.data);
      } catch (error) {
         console.error('Error fetching users:', error);
      }
   };

   const fetchLatestPurchaseId = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/GetLatestPurchaseId.php');
         return response.data.latest_purchase_id;
      } catch (error) {
         console.error('Error fetching latest purchase ID:', error);
         return null;
      }
   };

   const generatePurchaseId = async () => {
      const latestPurchaseId = await fetchLatestPurchaseId();
      const currentYear = new Date().getFullYear();
      let newPurchaseId = `P${currentYear}-000001`;

      if (latestPurchaseId) {
         const latestIdNumber = parseInt(latestPurchaseId.split('-')[1]) + 1;
         newPurchaseId = `P${currentYear}-${latestIdNumber.toString().padStart(6, '0')}`;
      }

      return newPurchaseId;
   };

   const paginateReservations = (pageNumber) => {
      setCurrentReservationPage(pageNumber);
   };

   const handleCancelReservation = (reservation) => {
      setSelectedReservation(reservation);
      setShowModal(true);
   };

   const sendMessageAndCancelReservation = async () => {
      if (!selectedReservation) return;

      try {
         // Send message to the owner of the reservation
         await axios.post('http://localhost/stock-nyu/src/backend/api/CreateMessages.php', {
            reciever_id: selectedReservation.user_id,
            message,
            sender_id: userData.user_id // Replace with actual staff ID
         });

         // Proceed to cancel the reservation
         const response = await axios.post('http://localhost/stock-nyu/src/backend/api/CancelReservation.php', {
            reservation_id: selectedReservation.reservation_id,
            new_status: 'Cancelled'
         });

         if (response.data.status === 200) {
            alert("Reservation Cancelled Successfully!");

            // Find the canceled reservation
            const canceledReservation = reservations.find(reservation => reservation.reservation_id === selectedReservation.reservation_id);
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
                        fetchAllReservations(); // Refresh reservations
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
         console.error('Error cancelling reservation:', error);
         alert("Cancellation failed. Please try again.");
      } finally {
         setShowModal(false);
         setMessage('');
         setSelectedReservation(null);
      }
   };

   const handleCreatePurchaseHistory = async () => {
      const newPurchaseId = await generatePurchaseId();
      setPurchaseData({ ...purchaseData, purchase_id: newPurchaseId });
      setShowPurchaseModal(true);
   };

   const createPurchaseHistory = async () => {
      try {
         const response = await axios.post('http://localhost/stock-nyu/src/backend/api/CreatePurchaseHistory.php', purchaseData);
         if (response.data.status === 201) {
            alert('Purchase history created successfully!');
            setShowPurchaseModal(false);
            setPurchaseData({
               purchase_id: '',
               reservation_id: '',
               user_id: '',
               item_id: '',
               purchase_date: '',
               quantity_purchased: '',
               total_price: '',
               sold_by: ''
            });
         } else {
            alert(response.data.message || 'Failed to create purchase history.');
         }
      } catch (error) {
         console.error('Error creating purchase history:', error);
         alert('Failed to create purchase history. Please try again.');
      }
   };

   useEffect(() => {
      if (purchaseData.reservation_id) {
         const selectedReservation = reservations.find(reservation => reservation.reservation_id === purchaseData.reservation_id);
         if (selectedReservation) {
            const item = items.find(item => item.item_id === selectedReservation.item_id);
            const totalPrice = item ? (item.price * selectedReservation.quantity_reserved).toFixed(2) : '0.00';
            setPurchaseData({
               ...purchaseData,
               user_id: selectedReservation.user_id,
               item_id: selectedReservation.item_id,
               quantity_purchased: selectedReservation.quantity_reserved,
               total_price: totalPrice,
               sold_by: userData.user_id // Assuming the current user is the one who sold the item
            });
         }
      }
   }, [purchaseData.reservation_id, reservations, items, userData.user_id]);

   const filteredReservations = reservations.filter(reservation => reservation.status == 'Reserved');
   const currentReservations = filteredReservations.slice((currentReservationPage - 1) * reservationsPerPage, currentReservationPage * reservationsPerPage);

   return (
      <>
         <StaffToolbar />
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-5">
                     <h2 className="mt-5 mb-4">Staff Reservations</h2>

                     {filteredReservations.length === 0 ? (
                        <p>No reservations found.</p>
                     ) : (
                        <>
                           <table className="table table-bordered">
                              <thead className="thead-dark">
                                 <tr>
                                    <th>Reservation ID</th>
                                    <th>Item Name</th>
                                    <th>Image</th>
                                    <th>Quantity Reserved</th>
                                    <th>Total Price</th> {/* Add Total Price column */}
                                    <th>Status</th>
                                    <th>Reserved By</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {currentReservations.map(reservation => {
                                    const item = items.find(item => item.item_id === reservation.item_id);
                                    const totalPrice = item ? (item.price * reservation.quantity_reserved).toFixed(2) : '0.00'; // Calculate total price
                                    return (
                                       <tr key={reservation.reservation_id}>
                                          <td>{reservation.reservation_id}</td>
                                          <td>{item ? item.item_name : 'Unknown'}</td>
                                          <td>
                                             {item && (
                                                <img
                                                   src={item.item_image}
                                                   alt={item.item_name}
                                                   style={{ width: "100px", height: "100px", cursor: "pointer", display: "block", margin: "0 auto" }}
                                                />
                                             )}
                                          </td>
                                          <td>{reservation.quantity_reserved}</td>
                                          <td>${totalPrice}</td> {/* Display Total Price */}
                                          <td>{reservation.status}</td>
                                          <td>{reservation ? reservation.f_name +" "+ reservation.l_name : 'Unknown'}</td>
                                          <td>
                                             {reservation.status !== 'Cancelled' && (
                                                <button
                                                   className="btn btn-danger"
                                                   onClick={() => handleCancelReservation(reservation)}
                                                >
                                                   Cancel
                                                </button>
                                             )}
                                          </td>
                                       </tr>
                                    );
                                 })}
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

                           {/* Create Purchase History Button */}
                           <div className="d-flex justify-content-center mt-4">
                              <Button variant="primary" onClick={handleCreatePurchaseHistory}>
                                 Create Purchase History
                              </Button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Modal for sending message */}
         <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Send Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                     id="message"
                     className="form-control"
                     rows="4"
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
               </Button>
               <Button variant="primary" onClick={sendMessageAndCancelReservation}>
                  Send Message and Cancel Reservation
               </Button>
            </Modal.Footer>
         </Modal>

         {/* Modal for creating purchase history */}
         <Modal show={showPurchaseModal} onHide={() => setShowPurchaseModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Create Purchase History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="form-group">
                  <label htmlFor="purchase_id">Purchase ID</label>
                  <input
                     type="text"
                     id="purchase_id"
                     className="form-control"
                     value={purchaseData.purchase_id}
                     readOnly
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="reservation_id">Reservation ID</label>
                  <select
                     id="reservation_id"
                     className="form-control"
                     value={purchaseData.reservation_id}
                     onChange={(e) => setPurchaseData({ ...purchaseData, reservation_id: e.target.value })}>
                     <option value="">None</option>
                     {filteredReservations.map(reservation => (
                        <option key={reservation.reservation_id} value={reservation.reservation_id}>
                           {reservation.reservation_id}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="form-group">
                  <label htmlFor="user_id">User ID</label>
                  <input
                     type="text"
                     id="user_id"
                     className="form-control"
                     value={purchaseData.user_id}
                     onChange={(e) => setPurchaseData({ ...purchaseData, user_id: e.target.value })}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="item_id">Item ID</label>
                  <input
                     type="text"
                     id="item_id"
                     className="form-control"
                     value={purchaseData.item_id}
                     onChange={(e) => setPurchaseData({ ...purchaseData, item_id: e.target.value })}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="purchase_date">Purchase Date</label>
                  <input
                     type="date"
                     id="purchase_date"
                     className="form-control"
                     value={purchaseData.purchase_date}
                     onChange={(e) => setPurchaseData({ ...purchaseData, purchase_date: e.target.value })}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="quantity_purchased">Quantity Purchased</label>
                  <input
                     type="number"
                     id="quantity_purchased"
                     className="form-control"
                     value={purchaseData.quantity_purchased}
                     onChange={(e) => setPurchaseData({ ...purchaseData, quantity_purchased: e.target.value })}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="total_price">Total Price</label>
                  <input
                     type="number"
                     id="total_price"
                     className="form-control"
                     value={purchaseData.total_price}
                     readOnly
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="sold_by">Sold By</label>
                  <input
                     type="text"
                     id="sold_by"
                     className="form-control"
                     value={purchaseData.sold_by}
                     onChange={(e) => setPurchaseData({ ...purchaseData, sold_by: e.target.value })}
                  />
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
                  Close
               </Button>
               <Button variant="primary" onClick={createPurchaseHistory}>
                  Create Purchase History
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default StaffReservations;