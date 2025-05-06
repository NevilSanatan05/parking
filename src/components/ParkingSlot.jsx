// src/components/ParkingSlot.jsx
import React from 'react';

const ParkingSlot = ({ slot, status, onClick }) => {
  const statusStyles = {
    Available: {
      bg: 'bg-green-500 hover:bg-green-600',
      icon: '🅿️',
      cursor: 'cursor-pointer',
    },
    Occupied: {
      bg: 'bg-red-500',
      icon: '🚫',
      cursor: 'cursor-not-allowed',
    },
    Reserved: {
      bg: 'bg-yellow-400',
      icon: '⛔',
      cursor: 'cursor-not-allowed',
    },
  };

  const current = statusStyles[status] || statusStyles.Available;

  return (
    <div
      onClick={status === 'Available' ? onClick : null}
      className={`
        w-28 h-28 sm:w-32 sm:h-32 m-2 rounded-lg flex flex-col items-center justify-center
        text-white font-bold text-sm shadow-lg transition-transform transform hover:scale-105
        ${current.bg} ${current.cursor}
      `}
    >
      <div className="text-2xl">{current.icon}</div>
      <div className="mt-1">{slot.id}</div>
      <div className="text-xs mt-1">{status}</div>
    </div>
  );
};

export default ParkingSlot;
