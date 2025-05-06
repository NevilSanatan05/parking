import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, setDoc, doc, query, where } from 'firebase/firestore';

const AvailableSlots = ({ user }) => {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      // Fetching all parking slots
      const querySnapshot = await getDocs(collection(db, 'parkingSlots'));
      const allSlots = querySnapshot.docs.map(doc => doc.data().slot);
      const availableSlots = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4'].filter(slot => !allSlots.includes(slot));
      setSlots(availableSlots);
    };

    fetchSlots();
  }, []);

  // Function to handle booking a slot
  const handleBookSlot = async (slot) => {
    if (!slot) {
      setMessage('Please select a valid slot.');
      return;
    }

    // Check if the user already has a slot assigned
    const userSlotRef = query(collection(db, 'parkingSlots'), where('email', '==', user.email));
    const userSlotSnapshot = await getDocs(userSlotRef);

    if (!userSlotSnapshot.empty) {
      setMessage('You already have a parking slot.');
      return;
    }

    try {
      // Reserve the slot for the user
      await setDoc(doc(db, 'parkingSlots', user.email), {
        email: user.email,
        slot: slot,
        assignedOn: new Date(),
      });

      setMessage(`You have successfully booked ${slot}.`);
      setSlots(slots.filter((s) => s !== slot)); // Remove the booked slot from available slots
    } catch (error) {
      console.error('Error booking slot:', error);
      setMessage('Error booking the slot. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Available Parking Slots</h2>
      <ul>
        {slots.length > 0 ? (
          slots.map((slot, index) => (
            <li key={index} className="mb-2">
              <button
                onClick={() => handleBookSlot(slot)}
                className="bg-blue-600 text-white w-full py-2 rounded mb-2 hover:bg-blue-700"
              >
                Book {slot}
              </button>
            </li>
          ))
        ) : (
          <p>No available slots at the moment.</p>
        )}
      </ul>

      {message && <p className="text-sm mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default AvailableSlots;
