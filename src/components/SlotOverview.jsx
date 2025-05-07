import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import ParkingMap from './ParkingMap';

const SlotOverview = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const allSlots = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10'];

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const slotSnapshot = await getDocs(collection(db, 'parkingSlots'));
      const visitorSnapshot = await getDocs(collection(db, 'visitorReservations'));

      const approvedSlots = slotSnapshot.docs
        .filter(doc => doc.data().status === 'approved')
        .map(doc => doc.data().slot);

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Parking Slot Overview</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading slots...</p>
      ) : (
        <>
          <div className="max-w-xl mx-auto mb-8 p-6 bg-white shadow rounded">
            <p><strong>Total Slots:</strong> {allSlots.length}</p>
            <p><strong>Occupied Slots:</strong> {occupiedSlots.length}</p>
            <ul className="list-disc list-inside text-red-600">
              {occupiedSlots.map((slot, i) => <li key={i}>{slot}</li>)}
            </ul>
            <p><strong>Available Slots:</strong> {availableSlots.length}</p>
            <ul className="list-disc list-inside text-green-600">
              {availableSlots.map((slot, i) => <li key={i}>{slot}</li>)}
            </ul>

            <button
              onClick={fetchSlots}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Refresh Slots
            </button>
          </div>

          <ParkingMap
            allSlots={allSlots}
            occupiedSlots={occupiedSlots}
            availableSlots={availableSlots}
          />
        </>
      )}
    </div>
  );
};

export default SlotOverview;
