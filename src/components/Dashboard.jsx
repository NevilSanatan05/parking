import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';

const Dashboard = ({ user }) => {
  const [slotInfo, setSlotInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setSlotInfo({ slot: data.slot, status: data.status, id: querySnapshot.docs[0].id });
        }
      },
      (error) => {
        console.error('Error fetching parking slot:', error);
      }
    );

    // Fetch parking history
    const historyQuery = query(collection(db, "parkingHistory"), where("email", "==", user.email));
    const historyUnsubscribe = onSnapshot(historyQuery, (querySnapshot) => {
      setHistory(querySnapshot.docs.map(doc => doc.data()));
      setLoading(false);
    }, (error) => {
      console.error('Error fetching parking history:', error);
    });

    return () => {
      unsubscribe();
      historyUnsubscribe();
    };
  }, [user]);

  const handleRequestSlot = () => {
    // Logic to request a new parking slot
    console.log("Request new parking slot");
  };

  const handleBookVisitorParking = () => {
    // Logic to book visitor parking
    console.log("Book visitor parking");
  };

  const handleDeleteSlot = async () => {
    if (!slotInfo) return;
    
    try {
      await deleteDoc(doc(db, "parkingSlots", slotInfo.id));
      setSlotInfo(null); // Update the state to reflect the slot deletion
      console.log("Parking slot deleted successfully");
    } catch (error) {
      console.error('Error deleting parking slot:', error);
    }
  };

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

          {/* Parking Slot Info */}
          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Your Parking Slot</h3>
            {slotInfo ? (
              slotInfo.status === 'approved' ? (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded">
                  <p className="text-lg font-semibold">🎉 Slot Booked</p>
                  <p className="text-base mt-1">
                    <strong>Assigned Slot:</strong> {slotInfo.slot}
                  </p>
                  <button
                    onClick={handleDeleteSlot}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Delete Slot
                  </button>
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

          {/* Parking History */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-gray-600 text-md mb-3">Your Parking History</h4>
            {loading ? (
              <p className="text-gray-500">Loading history...</p>
            ) : history.length > 0 ? (
              <ul className="text-gray-500 space-y-2 list-disc list-inside">
                {history.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.slot}</strong> on {new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}
                    <span className="ml-2 text-sm text-gray-400">{entry.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No parking history available.</p>
            )}
          </div>

          {/* Request a new slot */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-gray-600 text-md mb-3">Request a New Slot</h4>
            <p className="text-gray-500 mb-4">If you need a new parking slot, you can request it here:</p>
            <button
              onClick={handleRequestSlot}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Request New Parking Slot
            </button>
          </div>

          {/* Book Visitor Parking */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-gray-600 text-md mb-3">Book Visitor Parking</h4>
            <p className="text-gray-500 mb-4">Need parking for your visitors? You can book parking here:</p>
            <button
              onClick={handleBookVisitorParking}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Book Visitor Parking
            </button>
          </div>

          {/* What's Next Section */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-gray-600 text-md mb-3">What’s next?</h4>
            <ul className="text-gray-500 space-y-2 list-disc list-inside">
              <li>View your parking history</li>
              <li>Request a new slot</li>
              <li>Book visitor parking</li>
              <li>Contact admin for support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
