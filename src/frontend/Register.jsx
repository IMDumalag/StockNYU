import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';

function Register({ onCreate }) { // Removed onSwitchToLogin from props since we're handling it here
   const [formData, setFormData] = useState({
      nu_given_identifier: '',
      f_name: '',
      m_name: '',
      l_name: '',
      email: '',
      password: '',
      access_id: '',
      date_of_birth: '',
      gender: '',
      address: '',
      profile_picture: '',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Current timestamp
      user_id: ''
   });

   const navigate = useNavigate(); // Initialize useNavigate hook

   // Generate user ID whenever access_id or nu_given_identifier changes
   useEffect(() => {
      if (formData.access_id && formData.nu_given_identifier) {
         const userId = generateUserId(formData.access_id, formData.nu_given_identifier);
         setFormData((prevData) => ({ ...prevData, user_id: userId }));
      }
   }, [formData.access_id, formData.nu_given_identifier]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   // Generate user ID based on access_id and nu_given_identifier
   const generateUserId = (access_id, nu_given_identifier) => {
      const prefix = access_id === '1' ? 'US' : access_id === '2' ? 'ST' : '';
      return `${prefix}${nu_given_identifier}`;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post('http://localhost/stock-nyu/src/backend/api/CreateUser.php', formData, {
            headers: {
               'Content-Type': 'application/json'
            }
         });
         onCreate(response.data);
         alert('User Created Successfully');
      } catch (error) {
         console.error('Error creating user:', error);
         alert('Error creating user. Please try again.');
      }
   };

   // Function to navigate to the login page
   const handleSwitchToLogin = () => {
      navigate('/login');
   };

   return (
      <div className="container mt-5">
         <div className="row justify-content-center">
            <div className="col-md-6">
               <div className="card">
                  <div className="card-header">
                     <h2>Register</h2>
                  </div>
                  <div className="card-body">
                     <form onSubmit={handleSubmit} className="register-form">
                        <div className="mb-3">
                           <label className="form-label">NU Given Identifier</label>
                           <input
                              type="text"
                              className="form-control"
                              name="nu_given_identifier"
                              value={formData.nu_given_identifier}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">First Name</label>
                           <input
                              type="text"
                              className="form-control"
                              name="f_name"
                              value={formData.f_name}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Middle Name</label>
                           <input
                              type="text"
                              className="form-control"
                              name="m_name"
                              value={formData.m_name}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Last Name</label>
                           <input
                              type="text"
                              className="form-control"
                              name="l_name"
                              value={formData.l_name}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Email</label>
                           <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Password</label>
                           <input
                              type="password"
                              className="form-control"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Access ID (1 for USER, 2 for STAFF)</label>
                           <select
                              className="form-control"
                              name="access_id"
                              value={formData.access_id}
                              onChange={handleChange}
                              required
                           >
                              <option value="">Select Access Type</option>
                              <option value="1">User</option>
                              <option value="2">Staff</option>
                           </select>
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Date of Birth</label>
                           <input
                              type="date"
                              className="form-control"
                              name="date_of_birth"
                              value={formData.date_of_birth}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Gender</label>
                           <select
                              className="form-control"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              required
                           >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                           </select>
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Address</label>
                           <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">Profile Picture (URL)</label>
                           <input
                              type="text"
                              className="form-control"
                              name="profile_picture"
                              value={formData.profile_picture}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="mb-3">
                           <label className="form-label">User ID</label>
                           <input
                              type="text"
                              className="form-control"
                              name="user_id"
                              value={formData.user_id}
                              readOnly
                           />
                        </div>
                        <button type="submit" className="btn btn-primary">Create User</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={handleSwitchToLogin}>Switch to Login</button> {/* Updated here */}
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Register;
