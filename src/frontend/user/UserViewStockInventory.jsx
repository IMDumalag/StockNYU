import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Sidebar from "../components/UserSidebar";
import Toolbar from "../components/UserToolbar";
import globalVariable from "/src/backend/data/GlobalVariable"; // Import globalVariable
import axios from "axios";
import { useState, useEffect } from "react";

const UserViewStockInventory = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state
  const itemsPerPage = 5;

  const [reservationDetails, setReservationDetails] = useState({
    user_id: globalVariable.getUserData().user_id || '',
    item_id: '',
    reservation_date_start: '',
    reservation_date_end: '',
    quantity_reserved: 1,
    status: 'Reserved',
    reservation_id: ''
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState({});

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost/stock-nyu/src/backend/api/ReadInventoryItems.php");
      if (response.data.status === 200) {
        setItems(response.data.data);
        fetchNotificationPreferences(response.data.data);
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchNotificationPreferences = async (items) => {
    try {
      const userId = globalVariable.getUserData().user_id;
      const preferences = {};
      for (const item of items) {
        const response = await axios.get(`http://localhost/stock-nyu/src/backend/api/GetNotificationPreferences.php?user_id=${userId}&item_id=${item.item_id}`);
        if (response.data.status === 200 && response.data.preferences.length > 0) {
          preferences[item.item_id] = response.data.preferences[0].notify_on_restock;
        } else {
          // Create a new notification preference if none exists
          const createResponse = await axios.post("http://localhost/stock-nyu/src/backend/api/CreateNotificationPreferences.php", {
            user_id: userId,
            item_id: item.item_id,
            notify_on_restock: false
          });
          if (createResponse.data.status === 201) {
            preferences[item.item_id] = false;
          } else {
            console.error("Failed to create notification preference");
          }
        }
      }
      setNotificationPreferences(preferences);
    } catch (error) {
      console.error("Error fetching notification preferences", error);
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReserveClick = (item) => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7);

    setSelectedItem(item);
    setReservationDetails({
      ...reservationDetails,
      item_id: item.item_id,
      reservation_date_start: now.toISOString().split('T')[0],
      reservation_date_end: endDate.toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationDetails({ ...reservationDetails, [name]: value });
  };

  const validateReservation = () => {
    const { reservation_date_start, reservation_date_end, quantity_reserved } = reservationDetails;
    if (!reservation_date_start || !reservation_date_end) {
      alert("Please select reservation dates.");
      return false;
    }
    const start = new Date(reservation_date_start);
    const end = new Date(reservation_date_end);
    if (end < start) {
      alert("End date cannot be before start date.");
      return false;
    }
    if (quantity_reserved < 1) {
      alert("Quantity reserved must be at least 1.");
      return false;
    }
    if (quantity_reserved > selectedItem.quantity) {
      alert("Quantity reserved cannot exceed available quantity.");
      return false;
    }
    return true;
  };

  const handleReserve = async () => {
    if (!validateReservation()) return;
  
    const newReservationId = await generateNewReservationId();
    const reservationData = {
      ...reservationDetails,
      reservation_id: newReservationId,
    };
  
    console.log("Reservation Details:", reservationData);
  
    try {
      // Create the reservation
      const response = await axios.post("http://localhost/stock-nyu/src/backend/api/CreateReservation.php", reservationData);
      if (response.data.status === 201) {
        // Subtract reserved quantity from item's available quantity
        const newQuantity = selectedItem.quantity - reservationDetails.quantity_reserved;
  
        // Update item quantity in the backend
        await updateItemQuantity(selectedItem.item_id, newQuantity);
  
        alert("Reservation created successfully!");
        setShowModal(false);
        fetchData(); // Refresh the items list
      } else {
        alert("Failed to create reservation.");
      }
    } catch (error) {
      console.error("Error creating reservation", error);
      alert("An error occurred while creating the reservation.");
    }
  };
  

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const response = await axios.put("http://localhost/stock-nyu/src/backend/api/UpdateItemQuantity.php", {
        item_id: itemId,
        quantity: newQuantity
      });
      if (response.data.status === 200) {
        console.log("Item quantity updated successfully");
      } else {
        console.error("Failed to update item quantity");
      }
    } catch (error) {
      console.error("Error updating item quantity", error);
    }
  };

  const fetchLatestReservationId = async () => {
    try {
      const response = await axios.get("http://localhost/stock-nyu/src/backend/api/GetLatestReservationId.php");
      if (response.data.status === 200) {
        return response.data.latest_reservation_id;
      } else {
        console.error("Failed to fetch latest reservation ID");
        return null;
      }
    } catch (error) {
      console.error("Error fetching latest reservation ID", error);
      return null;
    }
  };

  const generateNewReservationId = async () => {
    const latestReservationId = await fetchLatestReservationId(); // Fetch the latest reservation ID
    const currentYear = new Date().getFullYear();

    if (!latestReservationId) {
      return `R${currentYear}-000001`;
    } else {
      const latestIdNumber = parseInt(latestReservationId.split('-')[1], 10);
      const newIdNumber = latestIdNumber + 1;
      return `R${currentYear}-${newIdNumber.toString().padStart(6, '0')}`;
    }
  };

  const handleCheckboxChange = async (itemId) => {
    const userId = globalVariable.getUserData().user_id;
    const newPreference = !notificationPreferences[itemId];

    try {
      const response = await axios.put("http://localhost/stock-nyu/src/backend/api/UpdateNotificationPreferences.php", {
        user_id: userId,
        item_id: itemId,
        notify_on_restock: newPreference
      });

      if (response.data.status === 200) {
        setNotificationPreferences({
          ...notificationPreferences,
          [itemId]: newPreference
        });
      } else {
        console.error("Failed to update notification preference");
      }
    } catch (error) {
      console.error("Error updating notification preference", error);
    }
  };

  return (
    <>
      <Toolbar />
      <div style={{width:'4000px', background: 'radial-gradient(circle, #7b7865, #444f66, #000f29)', backgroundSize: '200% 200%', minHeight: '100vh', paddingTop: '20px', animation: 'bouncyMovement 20s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite'}}>
      <div className="scroll-container" style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
        <div className="container-fluid" style={{marginTop:'60px'}}>
          <div className="row">
            <div className="col-md-3">
              <Sidebar />
            </div>
            <div className="col-md-9" style={{marginLeft:"-1400px"}}>
              <div className="container mt-5 text-center" >
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />

                <table className="table table-bordered mt-5">
                  <thead className="thead-dark">
                    <tr>
                      <th>Notify on Restock</th>
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
                        <td>
                          <input
                            type="checkbox"
                            checked={!!notificationPreferences[item.item_id]}
                            onChange={() => handleCheckboxChange(item.item_id)}
                          />
                        </td>
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
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        onClick={() => paginate(1)}
                        className="page-link"
                        disabled={currentPage === 1}
                      >
                        First
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className="page-link"
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button
                          onClick={() => paginate(index + 1)}
                          className="page-link"
                          disabled={currentPage === index + 1}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${currentPage === Math.ceil(filteredItems.length / itemsPerPage) ? "disabled" : ""}`}
                    >
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className="page-link"
                        disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                      >
                        Next
                      </button>
                    </li>
                    <li
                      className={`page-item ${currentPage === Math.ceil(filteredItems.length / itemsPerPage) ? "disabled" : ""}`}
                    >
                      <button
                        onClick={() => paginate(Math.ceil(filteredItems.length / itemsPerPage))}
                        className="page-link"
                        disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                      >
                        Last
                      </button>
                    </li>
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
                            readOnly
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
                            readOnly
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
                        <p><strong>Note:</strong> Your reservation will expire on {reservationDetails.reservation_date_end}.</p>
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
      </div>
      </div>
    </>
  );
};

export default UserViewStockInventory;
