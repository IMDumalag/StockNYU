import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalVariable from '../backend/data/GlobalVariable.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: '', userId: '' });
  const [formError, setFormError] = useState('');
  const [disableBtn, setDisableBtn] = useState(false);
  const navigate = useNavigate();

  const setData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (event) => {
    setFormError('');
    setDisableBtn(true);
    event.preventDefault();

    axios.post('http://localhost/stock-nyu/src/backend/api/Login.php', formData)
      .then(response => {
        console.log('Response data:', response.data);
        if (response.data.status !== 200) {
          setFormError(response.data.message);
          setDisableBtn(false);
        } else {
          const userId = formData.userId; // Use the user ID from the form data
          GlobalVariable.setUserId(userId);
          console.log('Stored User ID in GlobalVariable:', GlobalVariable.getUserId());
          navigate('/home');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setDisableBtn(false);
        setFormError('Cannot log you in. Try again later');
      });
  };

  return (
    <div className="container mt-5">
      <h2>Login to your account</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="inputAccType" className="form-label">Account Type</label>
          <select className="form-select" id="inputAccType" name='role' value={formData.role} onChange={setData} required>
            <option value='' disabled>-- Select One --</option>
            <option value="USER">User</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="inputEmail" className="form-label">NU Email Address</label>
          <input type="email" className="form-control" id="inputEmail" name="email" onChange={setData} required />
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="form-label">Password</label>
          <input id="inputPassword" className="form-control" value={formData.password} name="password" type={showPassword ? 'text' : 'password'} onChange={setData} required />
          <button type="button" className="btn btn-link" onClick={() => setShowPassword(prev => !prev)}>
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <div className="mb-3">
          <label htmlFor="inputUserId" className="form-label">User ID</label>
          <input type="text" className="form-control" id="inputUserId" name="userId" value={formData.userId} onChange={setData} required />
        </div>
        {formError && <p className="text-danger">{formError}</p>}
        <button className="btn btn-primary" type="submit" disabled={disableBtn}>Log in</button>
        <p className="mt-3">Don't have an account? <Link to="/register">Register here!</Link></p>
      </form>
    </div>
  );
}

export default Login;
