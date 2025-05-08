import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { Menu, X } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 text-white relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Parking Management</Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        </div>
        <div className="hidden md:flex space-x-4 items-center">
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
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full bg-blue-600 p-6 z-50">
          <button onClick={toggleMenu} className="absolute top-4 right-4">
            <X size={28} />
          </button>
          <div className="mt-10 flex flex-col space-y-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300" onClick={toggleMenu}>Dashboard</Link>
                {user.email === 'admin@example.com' && (
                  <>
                    <Link to="/admin" className="hover:text-gray-300" onClick={toggleMenu}>Admin Panel</Link>
                    <Link to="/history" className="hover:text-gray-300" onClick={toggleMenu}>Parking History</Link>
                  </>
                )}
                <Link to="/available-slots" className="hover:text-gray-300" onClick={toggleMenu}>Available Slots</Link>
                <Link to="/slot-overview" className="hover:text-gray-300" onClick={toggleMenu}>Slot Overview</Link>
                <Link to="/visitor-parking" className="hover:text-gray-300" onClick={toggleMenu}>Visitor Parking</Link>
                <Link to="/contact-admin" className="hover:text-gray-300" onClick={toggleMenu}>Contact Admin</Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="hover:text-gray-300" onClick={toggleMenu}>Sign Up</Link>
                <Link to="/" className="hover:text-gray-300" onClick={toggleMenu}>Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
