import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const AvailableSlots = ({ user }) => {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Include all 5 slots
  const allSlots = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5'];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'parkingSlots'), (snapshot) => {
      const occupied = snapshot.docs.map(doc => doc.data().slot);
      console.log('Occupied slots:', occupied); // Debugging line
      const available = allSlots.filter(slot => !occupied.includes(slot));
      console.log('Available slots:', available); // Debugging line
      setSlots(available);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleBookSlot = async (slot) => {
    if (!slot) {
      setMessage('Please select a valid slot.');
      return;
    }

    try {
      const userSlotRef = query(collection(db, 'parkingSlots'), where('email', '==', user.email));
      const snapshot = await getDocs(userSlotRef);

      if (!snapshot.empty) {
        setMessage('❗ You already have a pending or approved parking slot.');
        return;
      }

      await setDoc(doc(db, 'parkingSlots', user.email), {
        email: user.email,
        slot,
        assignedOn: new Date(),
        status: 'pending'
      });

      setMessage(`✅ Slot request for ${slot} sent! Waiting for admin approval.`);
    } catch (error) {
      console.error('Error booking slot:', error);
      setMessage('❌ Failed to book the slot. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">🚗 Available Parking Slots</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading slots...</p>
      ) : slots.length > 0 ? (
        <ul className="space-y-3">
          {slots.map((slot, index) => (
            <li key={index}>
              <button
                onClick={() => handleBookSlot(slot)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Request {slot}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No available slots at the moment.</p>
      )}

      {message && (
        <div className="mt-6 text-center text-sm text-green-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default AvailableSlots;
