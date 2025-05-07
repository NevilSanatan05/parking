import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config'; // Ensure this path is correct

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);       // Sign out from Firebase
      setUser(null);             // Clear local user state
      navigate('/');             // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Parking Management</Link>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              {user.email === 'admin@example.com' && (
                <>
                  <Link to="/admin" className="hover:text-gray-300">Admin Panel</Link>
                  <Link to="/history" className="hover:text-gray-300">Parking History</Link>
                </>
              )}
              <Link to="/available-slots" className="hover:text-gray-300">Available Slots</Link>
             
              <Link to="/slot-overview" className="hover:text-gray-300">Slot Overview</Link>
              <Link to="/visitor-parking" className="hover:text-gray-300">Visitor Parking</Link>
              <Link to="/contact-admin" className="hover:text-gray-300">Contact Admin</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
              <Link to="/" className="hover:text-gray-300">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
