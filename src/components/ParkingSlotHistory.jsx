import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { FaTrashAlt } from 'react-icons/fa';

const ParkingSlotHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'parkingSlotHistory'));
        setHistory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Failed to fetch parking slot history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📋 Parking Slot History</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500">No history records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Slot</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Assigned On</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{record.email}</td>
                    <td className="px-4 py-3">{record.slot}</td>
                    <td className="px-4 py-3">{new Date(record.timestamp.seconds * 1000).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Record"
                        onClick={() => alert('Delete functionality can be implemented here')}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingSlotHistory;
