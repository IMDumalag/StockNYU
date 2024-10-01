import React, { useState } from 'react';

const DeleteUser = () => {
   const [userId, setUserId] = useState('');
   const [responseMessage, setResponseMessage] = useState('');

   const handleDelete = async () => {
      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/DeleteUser.php', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
         });

         if (!response.ok) {
            throw new Error('Network response was not ok');
         }

         const data = await response.json();
         setResponseMessage(data.message);
      } catch (error) {
         console.error('Error:', error);
         setResponseMessage('An error occurred while deleting the user.');
      }
   };

   return (
      <div>
         <h2>Delete User</h2>
         <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
         />
         <button onClick={handleDelete}>Delete User</button>
         {responseMessage && <p>{responseMessage}</p>}
      </div>
   );
};

export default DeleteUser;