// src/components/UpdateSlotRequest.jsx
import React, { useState } from 'react';
import { db } from '../firebase-config';
import { setDoc, doc } from 'firebase/firestore';

const UpdateSlotRequest = ({ user }) => {
  const [newSlot, setNewSlot] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateRequest = async () => {
    if (!newSlot) {
      setMessage('Please select a slot.');
      return;
    }

    try {
      await setDoc(doc(db, 'updateRequests', user.email), {
        email: user.email,
        newSlot: newSlot,
        timestamp: new Date(),
      });

      setMessage(`Your request for ${newSlot} has been submitted.`);
    } catch (error) {
      console.error('Error updating slot:', error);
      setMessage('Error submitting the request.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Update Parking Slot Request</h2>
      <input
        type="text"
        placeholder="New Slot (e.g., Slot 1)"
        className="border p-2 w-full mb-3"
        value={newSlot}
        onChange={(e) => setNewSlot(e.target.value)}
      />
      <button
        onClick={handleUpdateRequest}
        className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
      >
        Request Update
      </button>
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default UpdateSlotRequest;
