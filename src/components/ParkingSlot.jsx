// src/components/ParkingSlot.jsx
import React from 'react';

const ParkingSlot = ({ slot, status, onClick }) => {
  const statusColor = {
    Available: 'bg-green-200',
    Occupied: 'bg-red-200',
    Reserved: 'bg-yellow-200',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded cursor-pointer text-center ${statusColor[status]}`}
    >
      <h3 className="text-lg font-semibold">{slot.id}</h3>
      <p className="text-sm">{status}</p>
    </div>
  );
};

export default ParkingSlot;
