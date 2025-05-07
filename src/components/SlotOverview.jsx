import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import ParkingMap from './ParkingMap';

const SlotOverview = () => {
  const [availableSlots, setAvailableSlots] = useState({
    'Mira Road Station': [],
    'Kashimira Police Station': [],
  });
  const [occupiedSlots, setOccupiedSlots] = useState({
    'Mira Road Station': [],
    'Kashimira Police Station': [],
  });
  const [loading, setLoading] = useState(true);

  const allSlots = {
    'Mira Road Station': ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5'],
    'Kashimira Police Station': ['Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10'],
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const slotSnapshot = await getDocs(collection(db, 'parkingSlots'));
      const visitorSnapshot = await getDocs(collection(db, 'visitorReservations'));

      const approvedSlots = slotSnapshot.docs
        .filter((doc) => doc.data().status === 'approved')
        .map((doc) => doc.data().slot);

      const visitorSlots = visitorSnapshot.docs.map((doc) => doc.data().slot);

      const occupied = [...new Set([...approvedSlots, ...visitorSlots])];

      const available = {
        'Mira Road Station': allSlots['Mira Road Station'].filter(
          (slot) => !occupied.includes(slot)
        ),
        'Kashimira Police Station': allSlots['Kashimira Police Station'].filter(
          (slot) => !occupied.includes(slot)
        ),
      };

      setOccupiedSlots({
        'Mira Road Station': occupied.filter((slot) => allSlots['Mira Road Station'].includes(slot)),
        'Kashimira Police Station': occupied.filter((slot) => allSlots['Kashimira Police Station'].includes(slot)),
      });

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
            {['Mira Road Station', 'Kashimira Police Station'].map((location) => (
              <div key={location}>
                <h3 className="text-xl font-semibold mb-2">{location}</h3>
                <p>
                  <strong>Total Slots:</strong> {allSlots[location].length}
                </p>
                <p>
                  <strong>Occupied Slots:</strong> {occupiedSlots[location].length}
                </p>
                <ul className="list-disc list-inside text-red-600">
                  {occupiedSlots[location].map((slot, i) => (
                    <li key={i}>{slot}</li>
                  ))}
                </ul>
                <p>
                  <strong>Available Slots:</strong> {availableSlots[location].length}
                </p>
                <ul className="list-disc list-inside text-green-600">
                  {availableSlots[location].map((slot, i) => (
                    <li key={i}>{slot}</li>
                  ))}
                </ul>
              </div>
            ))}

            <button
              onClick={fetchSlots}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Refresh Slots
            </button>
          </div>

          <ParkingMap
            allSlots={allSlots['Mira Road Station'].concat(allSlots['Kashimira Police Station'])}
            occupiedSlots={Object.values(occupiedSlots).flat()}
            availableSlots={Object.values(availableSlots).flat()}
          />
        </>
      )}
    </div>
  );
};

export default SlotOverview;
