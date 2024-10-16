import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Container, Typography, Grid } from '@mui/material';

function Register({ onCreate }) {
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
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user_id: ''
   });

   const navigate = useNavigate();

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

   const handleSwitchToLogin = () => {
      navigate('/login');
   };

   return (
      <>
      <div className="scroll-container" style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            Register
         </Typography>
         <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="NU Given Identifier"
                     name="nu_given_identifier"
                     value={formData.nu_given_identifier}
                     onChange={handleChange}
                     required
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     fullWidth
                     label="First Name"
                     name="f_name"
                     value={formData.f_name}
                     onChange={handleChange}
                     required
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     fullWidth
                     label="Middle Name"
                     name="m_name"
                     value={formData.m_name}
                     onChange={handleChange}
                  />
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="Last Name"
                     name="l_name"
                     value={formData.l_name}
                     onChange={handleChange}
                     required
                  />
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="Email"
                     name="email"
                     type="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                  />
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="Password"
                     name="password"
                     type="password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                  />
               </Grid>
               <Grid item xs={12}>
                  <FormControl fullWidth required>
                     <InputLabel>Access ID</InputLabel>
                     <Select
                        name="access_id"
                        value={formData.access_id}
                        onChange={handleChange}
                     >
                        <MenuItem value="">Select Access Type</MenuItem>
                        <MenuItem value="1">User</MenuItem>
                        <MenuItem value="2">Staff</MenuItem>
                     </Select>
                  </FormControl>
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="Date of Birth"
                     name="date_of_birth"
                     type="date"
                     value={formData.date_of_birth}
                     onChange={handleChange}
                     InputLabelProps={{ shrink: true }}
                     required
                  />
               </Grid>
               <Grid item xs={12}>
                  <FormControl fullWidth required>
                     <InputLabel>Gender</InputLabel>
                     <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                     >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="Masculine">Male</MenuItem>
                        <MenuItem value="Feminine">Female</MenuItem>
                        <MenuItem value="Others">Other</MenuItem>
                     </Select>
                  </FormControl>
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="Address"
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                     required
                  />
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="Profile Picture (URL)"
                     name="profile_picture"
                     value={formData.profile_picture}
                     onChange={handleChange}
                  />
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     fullWidth
                     label="User ID"
                     name="user_id"
                     value={formData.user_id}
                     InputProps={{ readOnly: true }}
                  />
               </Grid>
               <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                     Create User
                  </Button>
               </Grid>
               <Grid item xs={12}>
                  <Button type="button" variant="outlined" color="secondary" fullWidth onClick={handleSwitchToLogin}>
                     Switch to Login
                  </Button>
               </Grid>
            </Grid>
         </form>
      </Container>
      </div>
      </>
   );
}

export default Register;
