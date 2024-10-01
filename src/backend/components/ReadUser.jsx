import React, { useState, useEffect } from 'react';

const ReadUser = () => {
   const [userId, setUserId] = useState('');
   const [userData, setUserData] = useState(null);
   const [userList, setUserList] = useState([]);
   const [error, setError] = useState(null);

   const fetchUser = async (id) => {
      try {
         const response = await fetch(`http://localhost/stock-nyu/src/backend/api/READUSER.PHP?user_id=${id}`);
         const data = await response.json();
         if (response.ok) {
            setUserData(data);
            setError(null);
         } else {
            setError(data.message);
            setUserData(null);
         }
      } catch (err) {
         setError('Error fetching user data');
         setUserData(null);
      }
   };

   const fetchUserList = async () => {
      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/ReadUser.php');
         const data = await response.json();
         if (response.ok) {
            setUserList(data.data);
            setError(null);
         } else {
            setError(data.message);
            setUserList([]);
         }
      } catch (err) {
         setError('Error fetching user list');
         setUserList([]);
      }
   };

   useEffect(() => {
      fetchUserList();
   }, []);

   const handleSearch = (e) => {
      e.preventDefault();
      if (userId.trim() !== '') {
         fetchUser(userId);
      }
   };

   return (
      <div>
         <h1>Read User</h1>
         <form onSubmit={handleSearch}>
            <input
               type="text"
               value={userId}
               onChange={(e) => setUserId(e.target.value)}
               placeholder="Enter User ID"
            />
            <button type="submit">Search User</button>
         </form>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         {userData && (
            <div>
               <h2>User Details</h2>
               <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
         )}
         <h2>User List</h2>
         <ul>
            {userList.map((user) => (
               <li key={user.user_id}>
                  {user.user_id}: {user.f_name} {user.l_name} - {user.email}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default ReadUser;