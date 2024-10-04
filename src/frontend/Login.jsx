import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    access_id: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost/stock-nyu/src/backend/api/Login.php', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 200) {
        if (formData.access_id === '1') {
          navigate('/login/user_dashboard');
        } else if (formData.access_id === '2') {
          navigate('/login/staff_dashboard');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Login</h2>
            </div>
            <div className="card-body">
              {error && <p className="text-danger">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Access ID:</label>
                  <select
                    name="access_id"
                    className="form-select"
                    value={formData.access_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Access ID</option>
                    <option value="1">USER</option>
                    <option value="2">STAFF</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={handleSwitchToRegister}>Switch to Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;