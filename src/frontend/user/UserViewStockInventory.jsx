// UserViewStockInventory.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import UserToolandSideBar from "../components/UserToolandSideBar";

const UserViewStockInventory = () => {
   const [items, setItems] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [selectedImage, setSelectedImage] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;

   // Fetch data from the backend
   const fetchData = async () => {
      try {
         const response = await axios.get("http://localhost/stock-nyu/src/backend/api/ReadInventoryItems.php");
         if (response.data.status === 200) {
            setItems(response.data.data);
         } else {
            console.error("Error fetching data", response.data.message);
         }
      } catch (error) {
         console.error("Error fetching data", error);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   // Handle image click
   const handleImageClick = (image) => {
      setSelectedImage(image);
      setShowModal(true);
   };

   // Handle modal close
   const handleCloseModal = () => {
      setShowModal(false);
   };

   // Handle pagination
   const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const currentItems = items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   return (
    <>
      <UserToolandSideBar>
         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
         <div className="container mt-5 text-center">
             <h2 className="mb-4">Available Stocks</h2>

             <table className="table table-bordered mt-5">
                  <thead className="thead-dark">
                      <tr>
                           <th>Item ID</th>
                           <th>Item Name</th>
                           <th>Image</th>
                           <th>Description</th>
                           <th>Quantity</th>
                           <th>Price</th>
                           <th>Reservation Price/Day</th>
                           <th>Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {currentItems.map((item) => (
                           <tr key={item.item_id}>
                               <td>{item.item_id}</td>
                               <td>{item.item_name}</td>
                               <td>
                                    <img
                                        src={item.item_image}
                                        alt={item.item_name}
                                        style={{ width: "100px", height: "100px", cursor: "pointer", display: "block", margin: "0 auto" }}
                                        onClick={() => handleImageClick(item.item_image)}
                                    />
                               </td>
                               <td>{item.description}</td>
                               <td>{item.quantity}</td>
                               <td>{item.price}</td>
                               <td>{item.reservation_price_perday}</td>
                               <td>{item.status}</td>
                           </tr>
                      ))}
                  </tbody>
             </table>

             <nav className="d-flex justify-content-center mt-4">
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

             <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                      <Modal.Title>Image Preview</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <img src={selectedImage} alt="Selected" className="img-fluid" style={{ display: "block", margin: "0 auto" }} />
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModal}>
                           Close
                      </Button>
                  </Modal.Footer>
             </Modal>
         </div>
         </div>
      </UserToolandSideBar>
      </>
   );
};

export default UserViewStockInventory;
