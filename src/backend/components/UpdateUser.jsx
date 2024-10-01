import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateUser() {
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
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
    created_at: ''
  });

  useEffect(() => {
    // Fetch user list
    const fetchUserList = async () => {
      try {
        const response = await axios.get('http://localhost/stock-nyu/src/backend/api/ReadUser.php');
        if (response.status === 200) {
          setUserList(response.data.data);
        } else {
          alert('Failed to fetch user list');
        }
      } catch (error) {
        console.error('Error fetching user list:', error);
        alert('Failed to fetch user list');
      }
    };

    fetchUserList();
  }, []);

  const handleUserChange = async (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
  
    if (userId) {
      try {
        const response = await axios.get(`http://localhost/stock-nyu/src/backend/api/ReadUser.php?user_id=${userId}`);
        if (response.status === 200) {
          setFormData(response.data.data);
        } else {
          alert('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to fetch user details');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost/stock-nyu/src/backend/api/UpdateUser.php?user_id=${formData.user_id}`, formData);
      if (response.status === 200) {
        alert('User Updated Successfully');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Select User</label>
        <select className="form-control" value={selectedUserId} onChange={handleUserChange}>
          <option value="">Select a user</option>
          {userList.map(user => (
            <option key={user.user_id} value={user.user_id}>
              {user.f_name} {user.l_name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">User ID</label>
        <input
          type="text"
          className="form-control"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label">NU Given Identifier</label>
        <input
          type="text"
          className="form-control"
          name="nu_given_identifier"
          value={formData.nu_given_identifier}
          onChange={handleChange}
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
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Access ID</label>
        <input
          type="text"
          className="form-control"
          name="access_id"
          value={formData.access_id}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          className="form-control"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Gender</label>
        <input
          type="text"
          className="form-control"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Address</label>
        <input
          type="text"
          className="form-control"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Profile Picture URL</label>
        <input
          type="text"
          className="form-control"
          name="profile_picture"
          value={formData.profile_picture}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Created At</label>
        <input
          type="datetime-local"
          className="form-control"
          name="created_at"
          value={formData.created_at}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-warning">Update User</button>
    </form>
  );
}

export default UpdateUser;