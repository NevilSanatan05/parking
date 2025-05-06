import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const SlotOverview = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const allSlots = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5']; // Define total slots

  // Function to fetch slot data
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const slotSnapshot = await getDocs(collection(db, 'parkingSlots'));
      const visitorSnapshot = await getDocs(collection(db, 'visitorReservations'));

      // Only include user slots with "approved" status
      const approvedSlots = slotSnapshot.docs
        .filter(doc => doc.data().status === 'approved')
        .map(doc => doc.data().slot);

      // Include all visitor reservations
      const visitorSlots = visitorSnapshot.docs.map(doc => doc.data().slot);

      const occupied = [...new Set([...approvedSlots, ...visitorSlots])];
      const available = allSlots.filter(slot => !occupied.includes(slot));

      setOccupiedSlots(occupied);
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error fetching slot data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Parking Slot Overview</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading slots...</p>
      ) : (
        <div className="space-y-4">
          <p><strong>Total Slots:</strong> {allSlots.length}</p>
          <p><strong>Occupied Slots:</strong> {occupiedSlots.length}</p>
          <ul className="list-disc list-inside text-red-600">
            {occupiedSlots.map((slot, i) => <li key={i}>{slot}</li>)}
          </ul>
          <p><strong>Available Slots:</strong> {availableSlots.length}</p>
          <ul className="list-disc list-inside text-green-600">
            {availableSlots.map((slot, i) => <li key={i}>{slot}</li>)}
          </ul>
        </div>
      )}

      <button
        onClick={fetchSlots}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Refresh Slots
      </button>
    </div>
  );
};

export default SlotOverview;
