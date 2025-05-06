// ParkingMap.jsx

const ParkingMap = ({ availableSlots = [], occupiedSlots = [], allSlots = [] }) => {
  return (
    <div className="parking-lot">
      <h3 className="text-xl font-semibold mb-4 text-center">Parking Map</h3>
      <div className="row">
        {allSlots && allSlots.length > 0 ? (
          allSlots.map((slot, index) => {
            const isAvailable = availableSlots.includes(slot);
            const isOccupied = occupiedSlots.includes(slot);
            const isLargeSlot = slot.includes('Slot 1');
            
            return (
              <div
                key={index}
                className={`slot ${isAvailable ? 'slot-free' : 'slot-occupied'} ${isLargeSlot ? 'large-slot' : 'small-slot'}`}
              >
                <span>{slot}</span>
              </div>
            );
          })
        ) : (
          <p>No slots available to display</p>
        )}
      </div>
    </div>
  );
};

export default ParkingMap;  // Correct default export
