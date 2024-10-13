import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable
import './styles.css'

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
   const [previousQuantity, setPreviousQuantity] = useState(0); // State to store previous quantity

   const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
   const [quantityToAdd, setQuantityToAdd] = useState(0);
   const [selectedItem, setSelectedItem] = useState(null);

   const handleOpenAddQuantityModal = (item) => {
      setSelectedItem(item);
      setShowAddQuantityModal(true);
   };

   const handleCloseAddQuantityModal = () => {
      setShowAddQuantityModal(false);
      setQuantityToAdd(0);
   };

   const handleAddQuantitySubmit = async () => {
      if (quantityToAdd && !isNaN(quantityToAdd) && quantityToAdd > 0) {
         const newQuantity = parseInt(selectedItem.quantity) + parseInt(quantityToAdd);
         const updatedItem = { ...selectedItem, quantity: newQuantity };

         try {
            const response = await axios.put("http://localhost/stock-nyu/src/backend/api/UpdateInventoryItems.php", updatedItem);
            if (response.data.status === 200) {
               const updatedItems = items.map((i) => (i.item_id === updatedItem.item_id ? updatedItem : i));
               setItems(updatedItems);

               const changeData = {
                  change_id: await generateNextStockChangeId(),
                  item_id: updatedItem.item_id,
                  user_id: userId,
                  quantity_before: selectedItem.quantity,
                  quantity_added: quantityToAdd,
                  quantity_subtracted: 0,
                  quantity_current: newQuantity,
                  note: "Quantity added",
                  created_at: new Date().toISOString(),
               };
               sendStockChange(changeData);
               handleCloseAddQuantityModal();
            } else {
               console.error("Error updating item", response.data.message);
            }
         } catch (error) {
            console.error("Error updating item", error);
         }
      } else {
         alert("Invalid quantity entered.");
      }
   };

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
   
      // Automatically update status based on the quantity
      const updatedStatus = item.quantity <= 0 ? "Out of Stock" : "Available";
      const updatedItem = { ...item, status: updatedStatus };
   
      console.log("Payload being sent:", updatedItem); // Verify the updated item with correct status
      
      if (editMode) {
         try {
            const response = await axios.put("http://localhost/stock-nyu/src/backend/api/UpdateInventoryItems.php", updatedItem);
            if (response.data.status === 200) {
               const updatedItems = items.map((i) => (i.item_id === updatedItem.item_id ? updatedItem : i));
               setItems(updatedItems);
               setEditMode(false);
               setShowModal(false);
   
               const quantityAdded = Math.max(0, updatedItem.quantity - previousQuantity);
               const quantitySubtracted = Math.max(0, previousQuantity - updatedItem.quantity);
   
               const changeData = {
                  change_id: await generateNextStockChangeId(),
                  item_id: updatedItem.item_id,
                  user_id: userId,
                  quantity_before: previousQuantity,
                  quantity_added: quantityAdded,
                  quantity_subtracted: quantitySubtracted,
                  quantity_current: updatedItem.quantity,
                  note: "Details updated",
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
            const newItem = { ...updatedItem, item_id: nextItemId };
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
   
               const changeData = {
                  change_id: await generateNextStockChangeId(),
                  item_id: newItem.item_id,
                  user_id: userId,
                  quantity_before: 0,
                  quantity_added: newItem.quantity,
                  quantity_subtracted: 0,
                  quantity_current: newItem.quantity,
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
      // First, delete the stock change related to the item
      const deleteStockChangeResponse = await axios.delete(`http://localhost/stock-nyu/src/backend/api/DeleteStockChange.php`, {
         data: { item_id: id }
      });

      if (deleteStockChangeResponse.data.status === 200) {
         // If stock change deletion is successful, proceed to delete the item
         const deleteItemResponse = await axios.delete(`http://localhost/stock-nyu/src/backend/api/DeleteInventoryItem.php?item_id=${id}`);
         if (deleteItemResponse.data.status === 200) {
            const filteredItems = items.filter((i) => i.item_id !== id);
            setItems(filteredItems);
         } else {
            console.error("Error deleting item", deleteItemResponse.data.message);
         }
      } else {
         console.error("Error deleting stock change", deleteStockChangeResponse.data.message);
      }
   } catch (error) {
      console.error("Error deleting item or stock change", error);
   }
};

   // Handle edit item
   const handleEdit = (item) => {
      setItem({ ...item, status: item.status || "Available" });
      setPreviousQuantity(item.quantity); // Store the previous quantity before editing
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

   // Handle add quantity
   const handleAddQuantity = async (item) => {
      const quantityToAdd = prompt("Enter quantity to add:");
      if (quantityToAdd && !isNaN(quantityToAdd) && quantityToAdd > 0) {
         const newQuantity = parseInt(item.quantity) + parseInt(quantityToAdd);
         const updatedItem = { ...item, quantity: newQuantity };

         try {
            const response = await axios.put("http://localhost/stock-nyu/src/backend/api/UpdateInventoryItems.php", updatedItem);
            if (response.data.status === 200) {
               const updatedItems = items.map((i) => (i.item_id === updatedItem.item_id ? updatedItem : i));
               setItems(updatedItems);

               const changeData = {
                  change_id: await generateNextStockChangeId(),
                  item_id: updatedItem.item_id,
                  user_id: userId,
                  quantity_before: item.quantity,
                  quantity_added: quantityToAdd,
                  quantity_subtracted: 0,
                  quantity_current: newQuantity,
                  note: "Quantity added",
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
         alert("Invalid quantity entered.");
      }
   };

   return (
      <>
         <StaffToolbar />
         <div className="container-fluid custom-margin-top-1">
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
                                          <button className="btn btn-success btn-sm mr-2" onClick={() => handleOpenAddQuantityModal(item)}>
                                            Add Quantity
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

                     <Modal show={showAddQuantityModal} onHide={handleCloseAddQuantityModal}>
                        <Modal.Header closeButton>
                           <Modal.Title>Add Quantity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <form onSubmit={(e) => { e.preventDefault(); handleAddQuantitySubmit(); }}>
                              <div className="form-group">
                                 <label>Quantity to Add</label>
                                 <input
                                    type="number"
                                    name="quantityToAdd"
                                    value={quantityToAdd}
                                    onChange={(e) => setQuantityToAdd(e.target.value)}
                                    className="form-control"
                                    placeholder="Enter quantity"
                                    required
                                 />
                              </div>
                              <Button type="submit" className="btn btn-primary">
                                 Add Quantity
                              </Button>
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
