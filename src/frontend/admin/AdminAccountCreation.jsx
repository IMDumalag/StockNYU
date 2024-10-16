import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { googleLogout } from "@react-oauth/google";
import { useCookies } from 'react-cookie';

const AdminAccountCreation = () => {
   const [users, setUsers] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [newAccessId, setNewAccessId] = useState('');
   const [selectedUserId, setSelectedUserId] = useState('');
   const itemsPerPage = 5;
   const navigate = useNavigate(); // Initialize useNavigate
   const [cookies, setCookie, removeCookie] = useCookies(["user_token"]); // Initialize useCookies

   useEffect(() => {
      fetchUsers();
   }, []);

   const fetchUsers = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src//backend/google/ReadGoogleUsers.php');
         setUsers(response.data.data);
      } catch (error) {
         console.error('Error fetching users:', error);
      }
   };

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const handleAccessIdChange = (e) => {
      setNewAccessId(e.target.value);
   };

   const handleUserSelect = (userId) => {
      setSelectedUserId(userId);
   };

   const handleUpdateAccessId = async () => {
      try {
         const response = await axios.post('http://localhost/stock-nyu/src//backend/google/UpdateAccessId.php', {
            user_id: selectedUserId,
            new_access_id: newAccessId,
         });
         if (response.data.status === 200) {
            alert('Access ID updated successfully');
            fetchUsers();
         } else {
            alert('Failed to update Access ID');
         }
      } catch (error) {
         console.error('Error updating Access ID:', error);
      }
   };

   const handleLogout = () => {
      googleLogout();
      removeCookie("user_token");
      navigate('/');
   };

   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

   return (
      <div>
         <h1>Admin Account Creation</h1>
         <button onClick={handleLogout}>Logout</button> {/* Add Logout Button */}
         <table>
            <thead>
               <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Access ID</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {currentUsers.map((user) => (
                  <tr key={user.user_id}>
                     <td>{user.user_id}</td>
                     <td>{user.email}</td>
                     <td>{user.f_name}</td>
                     <td>{user.l_name}</td>
                     <td>{user.access_id}</td>
                     <td>
                        <button onClick={() => handleUserSelect(user.user_id)}>Change Access ID</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div>
            {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, index) => (
               <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
               </button>
            ))}
         </div>
         {selectedUserId && (
            <div>
               <h2>Update Access ID for User: {selectedUserId}</h2>
               <input
                  type="text"
                  value={newAccessId}
                  onChange={handleAccessIdChange}
                  placeholder="Enter new Access ID"
               />
               <button onClick={handleUpdateAccessId}>Update Access ID</button>
            </div>
         )}
      </div>
   );
};

export default AdminAccountCreation;