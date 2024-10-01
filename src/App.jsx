import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './backend/data/GlobalData';
import Home from './Home';
import BasicCRUD from "./backend/BasicCRUD";
import CreateUser from './backend/components/CreateUser';
import ReadUser from './backend/components/ReadUser';
import UpdateUser from './backend/components/UpdateUser';
import DeleteUser from './backend/components/DeleteUser';
import Register from './frontend/Register';
import Login from './frontend/Login';
import UserDashboard from './frontend/user/UserDashboard';
import StaffDashboard from './frontend/staff/StaffDashboard';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register onCreate={() => window.location.reload()} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/user_dashboard" element={<UserDashboard />} />
          <Route path="/login/staff_dashboard" element={<StaffDashboard />} />

          {/* Route for BasicCRUD */}
          <Route path="/basic_crud" element={<BasicCRUD />}>
            <Route path="create_user" element={<CreateUser onCreate={() => window.location.reload()} />} />
            <Route path="read_user" element={<ReadUser />} />
            <Route path="update_user" element={<UpdateUser />} />
            <Route path="delete_user" element={<DeleteUser />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
