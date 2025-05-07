import React from 'react';
import './ParkingMap.css';

const ParkingMap = ({ availableSlots = [], occupiedSlots = [], allSlots = [] }) => {
  return (
    <div className="parking-lot">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">Parking Map</h3>
      <div className="row">
        {allSlots && allSlots.length > 0 ? (
          allSlots.map((slot, index) => {
            const isAvailable = availableSlots.includes(slot);
            const isOccupied = occupiedSlots.includes(slot);
            const isLargeSlot = slot === 'Slot 1'; // Optional: only Slot 1 is large

            return (
              <div
                key={index}
                className={`slot ${isAvailable ? 'slot-free' : ''} ${isOccupied ? 'slot-occupied' : ''} ${
                  isLargeSlot ? 'large-slot' : 'small-slot'
                }`}
              >
                <span>{slot}</span>
              </div>
            );
          })
        ) : (
          <p className="text-white">No slots available to display</p>
        )}
      </div>
    </div>
  );
};

export default ParkingMap;