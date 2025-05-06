import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import ParkingSlotHistory from './components/ParkingSlotHistory.jsx';
import AvailableSlots from './components/AvailableSlots.jsx';
import UpdateSlotRequest from './components/UpdateSlotRequest.jsx';
import VisitorParking from './components/VisitorParking.jsx';
import SlotOverview from './components/SlotOverview.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      {/* Navbar will be available on all pages */}
      <Navbar user={user} setUser={setUser} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard setUser={setUser} user={user} /> : <Navigate to="/" />} />
        <Route
  path="/slot-overview"
  element={user ? <SlotOverview /> : <Navigate to="/" />}
/>

        <Route path="/visitor-parking" element={<VisitorParking />} />

        {/* Admin-only Routes */}
        <Route path="/admin" element={user && user.email === 'admin@example.com' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/history" element={user && user.email === 'admin@example.com' ? <ParkingSlotHistory /> : <Navigate to="/" />} />

        {/* Resident-only Routes */}
        <Route path="/available-slots" element={user ? <AvailableSlots user={user} /> : <Navigate to="/" />} />
        <Route path="/update-slot" element={user ? <UpdateSlotRequest user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
