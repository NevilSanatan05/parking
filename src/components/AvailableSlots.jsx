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
  const [selectedLocation, setSelectedLocation] = useState('Mira Road Station');

  const allSlots = {
    'Mira Road Station': ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5'],
    'Kashimira Police Station': ['Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10']
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'parkingSlots'), (snapshot) => {
      const occupied = snapshot.docs.map(doc => doc.data().slot);
      const available = allSlots[selectedLocation].filter(slot => !occupied.includes(slot));
      setSlots(available);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedLocation]);

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
        status: 'pending',
        location: selectedLocation
      });

      setMessage(`✅ Slot request for ${slot} at ${selectedLocation} sent! Waiting for admin approval.`);
    } catch (error) {
      console.error('Error booking slot:', error);
      setMessage('❌ Failed to book the slot. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Available Parking Slots</h2>

      {/* Location Selector */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setSelectedLocation('Mira Road Station')}
          className={`px-4 py-2 rounded ${selectedLocation === 'Mira Road Station' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Mira Road Station
        </button>
        <button
          onClick={() => setSelectedLocation('Kashimira Police Station')}
          className={`ml-4 px-4 py-2 rounded ${selectedLocation === 'Kashimira Police Station' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Kashimira Police Station
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading slots...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {allSlots[selectedLocation].map((slot, index) => {
            const isAvailable = slots.includes(slot);
            return (
              <div
                key={index}
                className={`border rounded-lg text-center py-6 font-semibold transition cursor-pointer ${isAvailable ? 'bg-green-100 hover:bg-green-200 text-green-800' : 'bg-red-100 text-red-600 cursor-not-allowed'}`}
                onClick={() => isAvailable && handleBookSlot(slot)}
              >
                {slot}
                <div className="mt-1 text-xs">{isAvailable ? 'Available' : 'Occupied'}</div>
              </div>
            );
          })}
        </div>
      )}

      {message && (
        <div className="mt-6 text-center text-sm text-blue-700 font-medium">
          {message}
        </div>
      )}
    </div>
  );
};

export default AvailableSlots;
