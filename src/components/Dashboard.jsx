import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const Dashboard = ({ user }) => {
  const [slotInfo, setSlotInfo] = useState(null);

  useEffect(() => {
    if (!user || !user.email) {
      console.error("User is not authenticated");
      return;
    }

    const q = query(collection(db, "parkingSlots"), where("email", "==", user.email));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          setSlotInfo(null);
        } else {
          const data = querySnapshot.docs[0].data();
          setSlotInfo({ slot: data.slot, status: data.status });
        }
      },
      (error) => {
        console.error('Error fetching parking slot:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome, Resident
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Email: <span className="font-medium text-gray-700">{user?.email}</span>
          </p>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Your Parking Slot</h3>
            {slotInfo ? (
              slotInfo.status === 'approved' ? (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded">
                  <p className="text-lg font-semibold">🎉 Slot Booked</p>
                  <p className="text-base mt-1">
                    <strong>Assigned Slot:</strong> {slotInfo.slot}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded">
                  <p className="text-base font-medium">Slot Requested: {slotInfo.slot}</p>
                  <p className="text-sm mt-1">Waiting for admin approval...</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded">
                <p className="text-base font-medium">No slot requested yet.</p>
                <p className="text-sm mt-1">Please request a parking slot from the available slots page.</p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t pt-6">
            <h4 className="text-gray-600 text-md mb-3">What’s next?</h4>
            <ul className="text-gray-500 space-y-2 list-disc list-inside">
              <li>View your parking history</li>
              <li>Request a new slot</li>
              <li>Book visitor parking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
