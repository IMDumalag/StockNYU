import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';

const StaffInventoryManagement = () => {
   const [items, setItems] = useState([]);
   const [item, setItem] = useState({
      item_id: "",
      item_name: "",
      item_image: "",
      description: "",
      quantity: "",
      price: "",
      reservation_price_perday: "",
      status: "Available",
   });
   const [editMode, setEditMode] = useState(false);
   const [showModal, setShowModal] = useState(false);
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

   // Fetch the latest item ID from the backend
   const fetchLatestItemId = async () => {
      try {
         const response = await axios.get("http://localhost/stock-nyu/src/backend/api/GetLatestItemId.php");
         if (response.data.status === 200) {
            return response.data.latest_item_id;
         } else {
            console.error("Error fetching latest item ID", response.data.message);
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
        return `NUD-M00001`;
      } else {
        // Extract the numeric part of the last ID (e.g., '000001' from 'NUD-M00001')
        const numericPart = latestItemId.split('-')[1]; // Get the '000001' part
        const newNumber = String(parseInt(numericPart) + 1).padStart(5, '0'); // Increment the number and pad with zeros
        return `NUD-M${newNumber}`;
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
                  reservation_price_perday: "",
                  status: "Available",
               });
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
         reservation_price_perday: "",
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
                              <th>Price</th>
                              <th>Reservation Price/Day</th>
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
                                    <td>{item?.price}</td>
                                    <td>{item?.reservation_price_perday}</td>
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
                                 <td colSpan="9">No items available.</td>
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
                                 />
                              </div>
                              <div className="form-group">
                                 <label>Price</label>
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
                                 <label>Reservation Price Per Day</label>
                                 <input
                                    type="number"
                                    step="0.01"
                                    name="reservation_price_perday"
                                    value={item.reservation_price_perday}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Reservation Price Per Day"
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