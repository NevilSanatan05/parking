import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';

const AdminPanel = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'parkingSlots'), (snapshot) => {
      const pendingRequests = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(slot => slot.status === 'pending');

      setSlots(pendingRequests);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    const slotRef = doc(db, 'parkingSlots', id);
    try {
      await setDoc(slotRef, { status: 'approved' }, { merge: true });
      setSlots(slots.filter(slot => slot.id !== id));
    } catch (error) {
      console.error('Error approving slot:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, 'parkingSlots', id));
      setSlots(slots.filter(slot => slot.id !== id));
    } catch (error) {
      console.error('Error rejecting slot:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Pending Requests</h2>
      <ul>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <li key={slot.id} className="mb-3">
              <div className="flex justify-between items-center">
                <span>{slot.email} - {slot.slot}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleApprove(slot.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(slot.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No pending requests.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminPanel;
