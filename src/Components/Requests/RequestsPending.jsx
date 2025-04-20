import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import tecpro from '../../assets/tecpro.jpg'
import UserLocationMap from "../Map/UserLocationMap"; // Adjust the import path as necessary
import { useRequests } from "../../Context/RequestsTechContext";



export default function RequestsPending() {

  //variable for store requests pending
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showLocationMap, setShowLocationMap] = useState(false);  // State to toggle map visibility
  const [statusMap, setStatusMap] = useState({});

  //context for requests
  let { getPendingRequests, pendingRequests, activateTechnical, deactivateTechnical, acceptRequest, rejectRequest } = useRequests()


  // Accept a request
  const handleAccept = (id) => {
    acceptRequest(id);
    deactivateTechnical();
    setStatusMap((prev) => ({ ...prev, globalStatus: "Off", [id]: "Off" }));
    localStorage.setItem("globalStatus", "Off");
  };

  // Reject a request
  const handleReject = (id) => {
    rejectRequest(id);
    deactivateTechnical();
    setStatusMap((prev) => ({ ...prev, globalStatus: "Off", [id]: "Off" }));
    localStorage.setItem("globalStatus", "Off");
  };

  const handleShowLocationClick = (request) => {
    setSelectedRequest(request);
    setShowLocationMap(true);  // Show the map when location button is clicked
  };

  const handleCloseMap = () => {
    setShowLocationMap(false); // Hide map when closing
  };

  // Set default status to "On" or "Off" based on localStorage
  useEffect(() => {
    getPendingRequests();
    const savedStatus = localStorage.getItem("globalStatus");
    if (savedStatus) {
      setStatusMap({ globalStatus: savedStatus });
    } else {
      // Set default to "On" if nothing in localStorage
      setStatusMap({ globalStatus: "On" });
      localStorage.setItem("globalStatus", "On");
      activateTechnical(); // Activate status on mount
    }
  }, []);

  useEffect(() => {
    getPendingRequests();
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Technical Service Requests Pending</h1>


      {/* Global Status Buttons */}
      <div className="flex gap-5 justify-center m-3" data-aos='fade-right' data-aos-delay='500' data-aos-duration='700'>
        <button onClick={() => {
          activateTechnical(); setStatusMap((prev) => ({ ...prev, globalStatus: "On" }));
          localStorage.setItem("globalStatus", "On");
        }}
          className="bg-green-500 px-4 py-2 text-white rounded-xl">
          Set Active
        </button>

        <button onClick={() => {
          deactivateTechnical(); setStatusMap((prev) => ({ ...prev, globalStatus: "Off" }));
          localStorage.setItem("globalStatus", "Off");
        }}
          className="bg-red-500 px-4 py-2 text-white rounded-xl">
          Set Inactive
        </button>

        <button className={`px-4 py-2 rounded-xl transition shadow-md ${statusMap.globalStatus === "On" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
          }`}
          onClick={() => {
            const newStatus = statusMap.globalStatus === "On" ? "Off" : "On";
            setStatusMap((prev) => ({ ...prev, globalStatus: newStatus }));
            localStorage.setItem("globalStatus", newStatus);
          }}>
          {statusMap.globalStatus === "On" ? "On" : "Off"}
        </button>
      </div>

      {/* Loading Spinner */}
      {pendingRequests.length === 0 ? (
        <p className="text-center text-gray-500">No requests available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos='fade-right' data-aos-delay='500' data-aos-duration='700'>
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="border-b pb-4 mb-4 last:border-none last:pb-0 bg-white shadow-lg rounded-lg p-5 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <img className="w-16 h-16 rounded-full shadow-lg" src={tecpro} alt="User" />
                <div>
                  <h5 className="text-lg font-medium text-gray-900">{request.userName}</h5>
                  <p className="text-sm text-gray-500">🛠 {request.techJop}</p>
                  <p className="text-sm text-gray-500">💲 ${request.servicePrice}</p>
                  <p className="text-sm text-gray-500">📍 Distance: {request.distance.toFixed(2)} km</p>
                  <p className="text-sm text-gray-500">💳 {request.paymentStatus}</p>
                </div>
              </div>

              {/* Beautiful Button Container */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 bg-[#0B4261] rounded-lg shadow-md flex gap-3 justify-center">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition shadow-md"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-md"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition shadow-md"
                  onClick={() => setSelectedRequest(request)}
                >
                  View Details
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-md"
                  onClick={() => handleShowLocationClick(request)}>
                  Show Location
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full transform transition-all scale-100">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
              🛠 Request Details
            </h2>

            <div className="border-b pb-3 mb-3">
              <p className="text-gray-700 flex items-center gap-2">
                <span className="font-semibold">👤 User:</span> {selectedRequest.userName}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <span className="font-semibold">🛠 Job:</span> {selectedRequest.techJop}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <span className="font-semibold">📍 Distance:</span> {selectedRequest.distance.toFixed(2)} km
              </p>
            </div>

            <div className="border-b pb-3 mb-3">
              <p className="text-gray-700 flex items-center gap-2">
                <span className="font-semibold">💲 Service Price:</span> ${selectedRequest.servicePrice}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <span className="font-semibold">🔢 Service Quantity:</span> {selectedRequest.serviceQuantity}
              </p>
            </div>

            <div className="border-b pb-3 mb-3">
              <p className={`text-lg font-medium ${selectedRequest.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>
                💳 Payment Status: {selectedRequest.paymentStatus}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <span className="font-semibold">📊 Business Status:</span> {selectedRequest.busnissStatus}
              </p>
            </div>

            <p className="text-gray-500 text-sm text-center mb-4">
              ⏳ Created On: {new Date(selectedRequest.createdOn).toLocaleString()}
            </p>

            <button
              className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition w-full shadow-md"
              onClick={() => setSelectedRequest(null)}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}

      {/* Map for User Location */}
      {showLocationMap && selectedRequest && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">User Location</h3>

          <p className="text-gray-700 font-medium">
            📍 Latitude: <span className="text-blue-500">{selectedRequest.userLatitude}</span>
          </p>
          <p className="text-gray-700 font-medium">
            📍 Longitude: <span className="text-blue-500">{selectedRequest.userLongitude}</span>
          </p>

          {selectedRequest.userLatitude !== undefined && selectedRequest.userLongitude !== undefined ? (
            <UserLocationMap
              key={selectedRequest.id}  // Force re-render on new location
              userLatitude={selectedRequest.userLatitude}
              userLongitude={selectedRequest.userLongitude}
            />
          ) : (
            <p className="text-red-500">⚠️ Location data not available</p>
          )}

          <button
            className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            onClick={handleCloseMap}
          >
            Close Map
          </button>
        </div>

      )}

    </div>)
}
