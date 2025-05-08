import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext'; // Import the custom hook
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import ParkingSlotHistory from './components/ParkingSlotHistory.jsx';
import AvailableSlots from './components/AvailableSlots.jsx';
import UpdateSlotRequest from './components/UpdateSlotRequest.jsx';
import VisitorParking from './components/VisitorParking.jsx';
import SlotOverview from './components/SlotOverview.jsx';
import ParkingMap from './components/ParkingMap.jsx';
import ContactAdmin from './components/ContactAdmin.jsx';

import Navbar from './components/Navbar.jsx';

const App = () => {
  const { user, loading } = useAuth();  // Get user and loading from AuthContext

  if (loading) {
    // You can display a loading spinner or something else while the user state is being checked
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
    <Router>
      {/* Navbar will be available on all pages */}
      <Navbar user={user} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
        <Route path="/slot-overview" element={user ? <SlotOverview /> : <Navigate to="/" />} />

        <Route path="/visitor-parking" element={<VisitorParking />} />
        <Route path="/parking-map" element={<ParkingMap />} />

        {/* Admin-only Routes */}
        <Route path="/admin" element={user && user.email === 'admin@example.com' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/history" element={user && user.email === 'admin@example.com' ? <ParkingSlotHistory /> : <Navigate to="/" />} />
      

<Route path="/contact-admin" element={<ContactAdmin />} />

        {/* Resident-only Routes */}
        <Route path="/available-slots" element={user ? <AvailableSlots user={user} /> : <Navigate to="/" />} />
        <Route path="/update-slot" element={user ? <UpdateSlotRequest user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>

    </AuthProvider> );
};

export default App;
