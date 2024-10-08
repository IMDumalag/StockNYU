import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Sidebar from "../components/UserSidebar";
import Toolbar from "../components/UserToolbar";
import globalVariable from "/src/backend/data/GlobalVariable"; // Import globalVariable

const UserViewStockInventory = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [reservationDetails, setReservationDetails] = useState({
    user_id: globalVariable.getUserData().user_id || '', // Set this to the logged-in user's ID
    item_id: '',
    reservation_date_start: '',
    reservation_date_end: '',
    quantity_reserved: 1,
    total_reservation_price: 0,
    status: 'Reserved',
    reservation_id: ''
  });
  const [selectedItem, setSelectedItem] = useState(null);

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
      reservation_id: newReservationId,
    };
  
    console.log("Reservation Details:", reservationData);
  
    try {
      // Create the reservation
      const response = await axios.post(
        "http://localhost/stock-nyu/src/backend/api/CreateReservation.php",
        reservationData
      );
  
      if (response.data.status === 201) {
        alert("Reservation Created Successfully!");
  
        // Update the item's quantity on success
        const updatedQuantity = selectedItem.quantity - reservationDetails.quantity_reserved;
  
        try {
          const updateResponse = await axios.put(
            "http://localhost/stock-nyu/src/backend/api/UpdateItemQuantity.php",
            {
              item_id: selectedItem.item_id,
              quantity: updatedQuantity, // Reduced quantity
            }
          );
  
          if (updateResponse.data.status === 200) {
            fetchData(); // Refresh items to update quantity
            setShowModal(false); // Close modal after success
            // Reset reservation details
            setReservationDetails({
              user_id: globalVariable.getUserData().user_id || "",
              item_id: "",
              reservation_date_start: "",
              reservation_date_end: "",
              quantity_reserved: 1,
              total_reservation_price: 0,
              status: "Reserved",
              reservation_id: "",
            });
          } else {
            alert(updateResponse.data.message || "Failed to update item quantity.");
          }
        } catch (error) {
          console.error("Error updating item quantity:", error);
          alert("Failed to update item quantity. Please try again.");
        }
      } else {
        alert(response.data.message || "Reservation failed.");
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("Reservation failed. Please try again.");
    }
  };
  
  
  

  const fetchLatestReservationId = async () => {
    try {
      const response = await axios.get("http://localhost/stock-nyu/src/backend/api/GetLatestReservationId.php");
      if (response.data.status === 200) {
        return response.data.latest_reservation_id; // Ensure the backend returns the latest ID
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
    const latestReservationId = await fetchLatestReservationId(); // Fetch the latest reservation ID
    const currentYear = new Date().getFullYear();

    if (!latestReservationId) {
      // If no reservation ID exists, start from 000001
      return `R${currentYear}-000001`;
    } else {
      // Extract the numeric part of the last ID (e.g., '000001' from 'R2024-000001')
      const numericPart = latestReservationId.split('-')[1]; // Get the '000001' part
      const newNumber = String(parseInt(numericPart) + 1).padStart(6, '0'); // Increment the number and pad with zeros
      return `R${currentYear}-${newNumber}`;
    }
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
              <h2 className="mb-4">Available Stocks</h2>

              <table className="table table-bordered mt-5">
                <thead className="thead-dark">
                  <tr>
                    <th>Item Name</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.item_id}>
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
                      <td>{item.status}</td>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserViewStockInventory;
