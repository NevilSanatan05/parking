// AdminPanel.jsx (Viewing All Slots)
import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AdminPanel = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const querySnapshot = await getDocs(collection(db, "parkingSlots"));
      setSlots(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSlots();
  }, []);

  const handleDeleteSlot = async (id) => {
    try {
      await deleteDoc(doc(db, "parkingSlots", id));
      setSlots(slots.filter(slot => slot.id !== id));
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Manage Parking Slots</h2>
      <ul>
        {slots.map((slot) => (
          <li key={slot.id} className="mb-3">
            <div className="flex justify-between">
              <span>{slot.email} - {slot.slot}</span>
              <button
                onClick={() => handleDeleteSlot(slot.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
