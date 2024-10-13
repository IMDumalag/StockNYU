import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable

const StaffInventoryManagement = () => {
   const [items, setItems] = useState([]);
   const [item, setItem] = useState({
      item_id: "",
      item_name: "",
      item_image: "",
      description: "",
      quantity: "",
      price: "",
      status: "Available",
   });
   const [editMode, setEditMode] = useState(false);
   const [showModal, setShowModal] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;

   // Get user data from global variable
   const userData = globalVariable.getUserData();
   const userId = userData.user_id;  // Assuming user_id is the key for user ID

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

   // Fetch the latest item ID from the backend
   const fetchLatestItemId = async () => {
      try {
         const response = await axios.get("http://localhost/stock-nyu/src/backend/api/GetLatestItemId.php");
   
         // Check if the response contains the expected structure
         if (response && response.data && response.data.status === 200) {
            return response.data.latest_item_id;
         } else {
            console.error("Error: Unexpected response structure", response.data);
            return null;
         }
      } catch (error) {
         console.error("Error fetching latest item ID", error);
         return null;
      }
   };

   const generateNextItemId = async () => {
      const latestItemId = await fetchLatestItemId();
   
      if (!latestItemId) {
         return `NUD-M00001`;  // Fallback if there's no latest item
      } else {
         // Ensure the item ID follows the expected format before processing
         const parts = latestItemId.split('-');  // Split by '-'
         if (parts.length === 2 && parts[1].length > 0) {
            const numericPart = parts[1].replace(/\D/g, ''); // Remove any non-numeric characters
            const newNumber = String(parseInt(numericPart, 10) + 1).padStart(5, '0'); // Increment and pad with zeros
            return `NUD-M${newNumber}`;
         } else {
            console.error("Unexpected item ID format:", latestItemId);
            return `NUD-M00001`; // Fallback if the format is unexpected
         }
      }
   };

   // Fetch the latest stock change ID from the backend
   const fetchLatestStockChangeId = async () => {
      try {
         const response = await axios.get("http://localhost/stock-nyu/src/backend/api/GetLatestStockChangeId.php");
         if (response && response.data && response.data.status === 200) {
            return response.data.latest_stock_change_id;
         } else {
            console.error("Error: Unexpected response structure", response.data);
            return null;
         }
      } catch (error) {
         console.error("Error fetching latest stock change ID", error);
         return null;
      }
   };

   const generateNextStockChangeId = async () => {
      const latestStockChangeId = await fetchLatestStockChangeId();
   
      if (!latestStockChangeId) {
         return `SC-00001`;  // Fallback if there's no latest stock change
      } else {
         // Ensure the stock change ID follows the expected format before processing
         const parts = latestStockChangeId.split('-');  // Split by '-'
         if (parts.length === 2 && parts[1].length > 0) {
            const numericPart = parts[1].replace(/\D/g, ''); // Remove any non-numeric characters
            const newNumber = String(parseInt(numericPart, 10) + 1).padStart(5, '0'); // Increment and pad with zeros
            return `SC-${newNumber}`;
         } else {
            console.error("Unexpected stock change ID format:", latestStockChangeId);
            return `SC-00001`; // Fallback if the format is unexpected
         }
      }
   };

   // Function to send stock change data to the backend
   const sendStockChange = async (changeData) => {
      try {
         const response = await axios.post("http://localhost/stock-nyu/src/backend/api/CreateStockChange.php", changeData);
         if (response.data.status !== 201) {
            console.error("Error recording stock change", response.data.message);
         }
      } catch (error) {
         console.error("Error recording stock change", error);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   // Handle input change
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setItem({ ...item, [name]: value });
   };

   // Handle form submission
   const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      console.log("Payload being sent:", item); // Verify that `item.status` has the correct value
      
      if (editMode) {
         try {
            const response = await axios.put("http://localhost/stock-nyu/src/backend/api/UpdateInventoryItems.php", item);
            if (response.data.status === 200) {
               const updatedItems = items.map((i) => (i.item_id === item.item_id ? item : i));
               setItems(updatedItems);
               setEditMode(false);
               setShowModal(false);

               // Send stock change data
               const changeData = {
                  change_id: await generateNextStockChangeId(), // Generate the next stock change ID
                  item_id: item.item_id,
                  user_id: userId, // Use the actual user ID
                  quantity_before: item.quantity_before, // Add quantity_before
                  quantity_added: item.quantity_added, // Add quantity_added
                  quantity_subtracted: item.quantity_subtracted, // Add quantity_subtracted
                  quantity_current: item.quantity, // Use the current quantity
                  note: "Stock updated",
                  created_at: new Date().toISOString(),
               };
               sendStockChange(changeData);
            } else {
               console.error("Error updating item", response.data.message);
            }
         } catch (error) {
            console.error("Error updating item", error);
         }
      } else {
         try {
            const nextItemId = await generateNextItemId();
            const newItem = { ...item, item_id: nextItemId };
            const response = await axios.post("http://localhost/stock-nyu/src/backend/api/CreateInventoryItems.php", newItem);
            if (response.data.status === 201) {
               setItems([...items, newItem]);
               setShowModal(false);
               setItem({
                  item_id: "",
                  item_name: "",
                  item_image: "",
                  description: "",
                  quantity: "",
                  price: "",
                  status: "Available",
               });

               // Send stock change data
               const changeData = {
                  change_id: await generateNextStockChangeId(), // Generate the next stock change ID
                  item_id: newItem.item_id,
                  user_id: userId, // Use the actual user ID
                  quantity_before: 0, // Initial quantity before adding new item
                  quantity_added: newItem.quantity, // Quantity added
                  quantity_subtracted: 0, // No quantity subtracted
                  quantity_current: newItem.quantity, // Use the current quantity
                  note: "New stock added",
                  created_at: new Date().toISOString(),
               };
               sendStockChange(changeData);
            } else {
               console.error("Error adding item", response.data.message);
            }
         } catch (error) {
            console.error("Error adding item", error);
         }
      }
   };

   // Handle delete item
   const handleDelete = async (id) => {
      try {
         const response = await axios.delete(`http://localhost/stock-nyu/src/backend/api/DeleteInventoryItem.php?item_id=${id}`);
         if (response.data.status === 200) {
            const filteredItems = items.filter((i) => i.item_id !== id);
            setItems(filteredItems);
         } else {
            console.error("Error deleting item", response.data.message);
         }
      } catch (error) {
         console.error("Error deleting item", error);
      }
   };

   // Handle edit item
   const handleEdit = (item) => {
      setItem({ ...item, status: item.status || "Available" });
      setEditMode(true);
      setShowModal(true); // Open the modal when editing
   };

   // Handle open popup for adding item
   const handleAddItem = async () => {
      const nextItemId = await generateNextItemId();
      setItem({
         item_id: nextItemId,
         item_name: "",
         item_image: "",
         description: "",
         quantity: "",
         price: "",
         status: "Available",
      });
      setEditMode(false);
      setShowModal(true); // Open the modal for adding new item
   };

   // Handle image click
   const handleImageClick = () => {
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

   // Open popup for image upload
   const openPopup = () => {
      window.open('https://postimages.org', 'popupWindow', 'width=800,height=900,scrollbars=yes,resizable=no');
   };

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
                     <h2 className="mb-4">Inventory Management</h2>

                     <Button variant="primary" onClick={handleAddItem}>
                        Add Item
                     </Button>

                     <table className="table table-bordered mt-5">
                        <thead className="thead-dark">
                           <tr>
                              <th>Item ID</th>
                              <th>Item Name</th>
                              <th>Image</th>
                              <th>Description</th>
                              <th>Quantity</th>
                              <th>Price (₱)</th>
                              <th>Status</th>
                              <th>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {currentItems && currentItems.length > 0 ? (
                              currentItems.map((item) => (
                                 <tr key={item?.item_id || Math.random()}>
                                    <td>{item?.item_id}</td>
                                    <td>{item?.item_name}</td>
                                    <td>
                                       <img
                                          src={item?.item_image}
                                          alt={item?.item_name}
                                          style={{ width: "100px", height: "100px", cursor: "pointer", display: "block", margin: "0 auto" }}
                                          onClick={() => handleImageClick(item?.item_image)}
                                       />
                                    </td>
                                    <td>{item?.description}</td>
                                    <td>{item?.quantity}</td>
                                    <td>₱{item?.price}</td>
                                    <td>{item?.status}</td>
                                    <td>
                                       <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(item)}>
                                          Edit
                                       </button>
                                       <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item?.item_id)}>
                                          Delete
                                       </button>
                                    </td>
                                 </tr>
                              ))
                           ) : (
                              <tr>
                                 <td colSpan="8">No items available.</td>
                              </tr>
                           )}
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
                           <Modal.Title>{editMode ? "Update Item" : "Add Item"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <form onSubmit={handleFormSubmit}>
                              <div className="form-group">
                                 <label>Item ID</label>
                                 <input
                                    type="text"
                                    name="item_id"
                                    value={item.item_id}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Item ID"
                                    required
                                    disabled={editMode}
                                 />
                              </div>
                              <div className="form-group">
                                 <label>Item Name</label>
                                 <input
                                    type="text"
                                    name="item_name"
                                    value={item.item_name}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Item Name"
                                    required
                                 />
                              </div>
                              <div className="form-group">
                                 <label>Image URL</label>
                                 <input
                                    type="text"
                                    name="item_image"
                                    value={item.item_image}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Direct Link"
                                    required
                                 />
                              </div>
                              <div className="form-group">
                                 <label>Description</label>
                                 <input
                                    type="text"
                                    name="description"
                                    value={item.description}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Description"
                                    required
                                 />
                              </div>
                              <div className="form-group">
                                 <label>Quantity</label>
                                 <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Quantity"
                                    required
                                    disabled={editMode} // Disable quantity input in edit mode
                                 />
                              </div>
                              <div className="form-group">
                                 <label>Price (₱)</label>
                                 <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={item.price}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Price"
                                    required
                                 />
                              </div>
                              <div className="form-group">
                                 <label>Status</label>
                                 <select
                                    name="status"
                                    value={item.status}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                 >
                                    <option value="Available">Available</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                 </select>
                              </div>
                              <div className="form-group d-flex justify-content-between">
                                 <button type="button" className="btn btn-primary" onClick={openPopup}>
                                    Upload Image
                                 </button>
                                 <Button type="submit" className="btn btn-primary">
                                    {editMode ? "Update Item" : "Add Item"}
                                 </Button>
                              </div>
                           </form>
                        </Modal.Body>
                     </Modal>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffInventoryManagement;
