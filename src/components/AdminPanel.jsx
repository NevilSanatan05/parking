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
      const allSlots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlots(allSlots);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    try {
      await setDoc(doc(db, 'parkingSlots', id), { status: 'approved' }, { merge: true });
    } catch (error) {
      console.error('Error approving slot:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await setDoc(doc(db, 'parkingSlots', id), { status: 'rejected' }, { merge: true });
    } catch (error) {
      console.error('Error rejecting slot:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'parkingSlots', id));
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Manage All Slots</h2>
      <ul>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <li key={slot.id} className="mb-3 border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{slot.email}</p>
                  <p className="text-sm">Slot: {slot.slot} | Status: <span className="font-semibold">{slot.status}</span></p>
                </div>
                <div className="space-x-2">
                  {slot.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(slot.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(slot.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No slots found.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminPanel;
