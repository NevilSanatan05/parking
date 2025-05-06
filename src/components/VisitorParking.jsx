import React, { useState } from 'react';
import { db } from '../firebase-config';
import { setDoc, doc } from 'firebase/firestore';
import { FaCarAlt, FaClock, FaEnvelope } from 'react-icons/fa';

const VisitorParking = () => {
  const [email, setEmail] = useState('');
  const [slot, setSlot] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReserveSlot = async () => {
    setMessage('');
    setError('');

    if (!email || !slot || !time) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await setDoc(doc(db, 'visitorReservations', email), {
        email,
        slot,
        time,
        reservedOn: new Date(),
      });

      setMessage(`✅ Your reservation for ${slot} at ${new Date(time).toLocaleString()} is confirmed.`);
      setEmail('');
      setSlot('');
      setTime('');
    } catch (error) {
      console.error('Error reserving parking:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🚗 Visitor Parking Reservation</h2>
        <p className="text-center text-gray-600 mb-4">
          Fill in your details to reserve a slot in advance.
        </p>

        <div className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <FaCarAlt className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Parking Slot (e.g., Slot 1)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
            />
          </div>

          <div className="relative">
            <FaClock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="datetime-local"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <button
            onClick={handleReserveSlot}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-200"
          >
            Reserve Slot
          </button>

          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VisitorParking;
