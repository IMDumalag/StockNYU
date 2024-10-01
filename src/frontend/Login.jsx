import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
   const [user_id, setUserId] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleLogin = async (e) => {
   e.preventDefault();
   setError('');

   try {
      const response = await axios.post('http://localhost/stock-nyu/backend/api/Login.php', {
         user_id,
         email,
         password
      });

      const data = response.data;

      if (data.status === 200) {
         if (data.data.access_id === 1) {
            navigate('/login/user_dashboard');
         } else if (data.data.access_id === 2) {
            navigate('/login/staff_dashboard');
         } else {
            setError('Invalid access ID');
         }
      } else {
         setError(data.message);
      }
   } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
   }
};

   return (
      <div>
         <h2>Login</h2>
         <form onSubmit={handleLogin}>
            <div>
               <label>User ID:</label>
               <input
                  type="text"
                  value={user_id}
                  onChange={(e) => setUserId(e.target.value)}
                  required
               />
            </div>
            <div>
               <label>Email:</label>
               <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
            </div>
            <div>
               <label>Password:</label>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
         </form>
      </div>
   );
};

export default Login;