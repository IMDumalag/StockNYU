// UserReservation.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserSidebar from '../components/UserSidebar';
import UserToolbar from '../components/UserToolbar';
import { Modal, Button } from 'react-bootstrap';

const UserReservation = () => {
   const [items, setItems] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;
   const [showModal, setShowModal] = useState(false);
   const [reservationDetails, setReservationDetails] = useState({
      user_id: 'ST2022-170002', // Set this to the logged-in user's ID
      item_id: '',
      reservation_date_start: '',
      reservation_date_end: '',
      quantity_reserved: 1,
      total_reservation_price: 0,
      status: 'Reserved',
      reservation_id: ''
   });
   const [selectedItem, setSelectedItem] = useState(null);

   useEffect(() => {
      fetchItems();
   }, []);

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

   const fetchLatestReservationId = async () => {
      try {
         const response = await axios.get("http://localhost/stock-nyu/src/backend/api/GetLatestReservationId.php");
         if (response.data.status === 200) {
            return response.data.latest_id;
         } else {
            console.error("Error fetching latest reservation ID:", response.data.message);
            return null;
         }
      } catch (error) {
         console.error("Error fetching latest reservation ID:", error);
         return null;
      }
   };

   const generateNewReservationId = async () => {
      const latestId = await fetchLatestReservationId();
      const currentYear = new Date().getFullYear();
      if (!latestId) {
         return `R${currentYear}-0001`;
      }
      const [prefix, year, number] = latestId.match(/(R)(\d{4})-(\d{4})/).slice(1);
      if (parseInt(year) === currentYear) {
         const newNumber = String(parseInt(number) + 1).padStart(4, '0');
         return `R${currentYear}-${newNumber}`;
      } else {
         return `R${currentYear}-0001`;
      }
   };

   const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   const handleReserveClick = (item) => {
      setSelectedItem(item);
      setReservationDetails({
         ...reservationDetails,
         item_id: item.item_id,
      });
      setShowModal(true);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setReservationDetails({ ...reservationDetails, [name]: value });
   };

   const calculateTotalPrice = () => {
      const { reservation_date_start, reservation_date_end, quantity_reserved } = reservationDetails;
      const start = new Date(reservation_date_start);
      const end = new Date(reservation_date_end);
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1; // Calculate number of days
      const total_price = days * selectedItem.reservation_price_perday * quantity_reserved;
      return total_price;
   };

   const validateReservation = () => {
      const { reservation_date_start, reservation_date_end, quantity_reserved } = reservationDetails;
      if (!reservation_date_start || !reservation_date_end) {
         alert("Please select both start and end dates.");
         return false;
      }
      const start = new Date(reservation_date_start);
      const end = new Date(reservation_date_end);
      if (end < start) {
         alert("End date cannot be before start date.");
         return false;
      }
      if (quantity_reserved < 1) {
         alert("Quantity must be at least 1.");
         return false;
      }
      if (quantity_reserved > selectedItem.quantity) {
         alert(`Only ${selectedItem.quantity} items are available.`);
         return false;
      }
      return true;
   };

   const handleReserve = async () => {
      if (!validateReservation()) return;

      const total_reservation_price = calculateTotalPrice();
      const newReservationId = await generateNewReservationId();
      const reservationData = {
         ...reservationDetails,
         total_reservation_price,
         reservation_id: newReservationId
      };

      console.log("Reservation Details:", reservationData); // Log reservation details

      try {
         const response = await axios.post("http://localhost/stock-nyu/src/backend/api/CreateReservation.php", reservationData);
         if (response.data.status === 201) {
            alert("Reservation Created Successfully!");
            fetchItems(); // Refresh items to update quantity
            setShowModal(false); // Close modal after success
            // Reset reservation details
            setReservationDetails({
               user_id: 'ST2022-170002',
               item_id: '',
               reservation_date_start: '',
               reservation_date_end: '',
               quantity_reserved: 1,
               total_reservation_price: 0,
               status: 'Reserved',
               reservation_id: ''
            });
         } else {
            alert(response.data.message || "Reservation failed.");
         }
      } catch (error) {
         console.error("Error creating reservation:", error);
         alert("Reservation failed. Please try again.");
      }
   };

   return (
      <>
         <UserToolbar />
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-3">
                  <UserSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-5">
                     <h2 className="mb-4">Reserve an Item</h2>

                     <table className="table table-bordered">
                        <thead className="thead-dark">
                           <tr>
                              <th>Item Name</th>
                              <th>Image</th>
                              <th>Description</th>
                              <th>Quantity Available</th>
                              <th>Price/Day</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {currentItems.map(item => (
                              <tr key={item.item_id}>
                                 <td>{item.item_name}</td>
                                 <td>
                                    <img
                                       src={item.item_image}
                                       alt={item.item_name}
                                       style={{ width: "100px", height: "100px", cursor: "pointer", display: "block", margin: "0 auto" }}
                                    />
                                 </td>
                                 <td>{item.description}</td>
                                 <td>{item.quantity}</td>
                                 <td>${parseFloat(item.reservation_price_perday).toFixed(2)}</td>
                                 <td>
                                    <button
                                       className="btn btn-primary"
                                       onClick={() => handleReserveClick(item)}
                                    >
                                       Reserve
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>

                     <nav className="d-flex justify-content-center">
                        <ul className="pagination">
                           {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, index) => (
                              <li key={index + 1} className="page-item">
                                 <button onClick={() => paginate(index + 1)} className="page-link">
                                    {index + 1}
                                 </button>
                              </li>
                           ))}
                        </ul>
                     </nav>
                  </div>
               </div>
            </div>
         </div>

         {/* Reservation Modal */}
         <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Reserve Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {selectedItem && (
                  <div>
                     <p><strong>Item Name:</strong> {selectedItem.item_name}</p>
                     <p><strong>Description:</strong> {selectedItem.description}</p>
                     <p><strong>Price Per Day:</strong> ${parseFloat(selectedItem.reservation_price_perday).toFixed(2)}</p>
                     <img
                        src={selectedItem.item_image}
                        alt={selectedItem.item_name}
                        style={{ width: "100%", height: "auto", display: "block", margin: "0 auto" }}
                     />
                     <div className="form-group mt-3">
                        <label htmlFor="reservation_date_start">Start Date</label>
                        <input
                           type="date"
                           id="reservation_date_start"
                           name="reservation_date_start"
                           className="form-control"
                           onChange={handleInputChange}
                           value={reservationDetails.reservation_date_start}
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="reservation_date_end">End Date</label>
                        <input
                           type="date"
                           id="reservation_date_end"
                           name="reservation_date_end"
                           className="form-control"
                           onChange={handleInputChange}
                           value={reservationDetails.reservation_date_end}
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="quantity_reserved">Quantity</label>
                        <input
                           type="number"
                           id="quantity_reserved"
                           name="quantity_reserved"
                           className="form-control"
                           min="1"
                           max={selectedItem.quantity}
                           value={reservationDetails.quantity_reserved}
                           onChange={handleInputChange}
                        />
                     </div>
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
               </Button>
               <Button variant="primary" onClick={handleReserve}>
                  Reserve
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default UserReservation;
