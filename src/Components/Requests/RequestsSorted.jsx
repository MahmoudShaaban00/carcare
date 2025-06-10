import axios from 'axios';
import React, { useEffect, useState } from 'react';
import tecpro from '../../assets/tecpro.jpg';
import UserLocationMap from "../Map/UserLocationMap";
import { useRequests } from '../../Context/RequestsTechContext';
import axiosInstance from '../../api';

export default function RequestsSorted() {
  let { activateTechnical, deactivateTechnical, acceptRequest, rejectRequest } = useRequests();

  const [requestsSorted, setRequestsSorted] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [statusMap, setStatusMap] = useState({});

  /**
   * Fetches all technical service requests sorted and sets the state
   */
  async function getAllTechnicalRequestsSorted() {
    try {
      const token = localStorage.getItem("TechnicalToken");
      if (!token) {
        alert("Technical Token not found in localStorage");
        return;
      }

      const { data } = await axiosInstance.get(
        "https://carcareapp.runasp.net/api/ServiceRequest/GetAllPendingRequestsToTechnical",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequestsSorted(data);
    } catch (error) {
      console.error("Error fetching technical service requests:", error);
    }
  }

  /**
   * Handles accepting a request by calling acceptRequest and removing it from the list
   * @param {number} id - The ID of the request to accept
   */
  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      deactivateTechnical();
      setStatusMap((prev) => ({ ...prev, globalStatus: "Off", [id]: "Off" }));
      localStorage.setItem("globalStatus", "Off");
      // Remove accepted request from UI immediately
      setRequestsSorted((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  /**
   * Handles rejecting a request by calling rejectRequest and removing it from the list
   * @param {number} id - The ID of the request to reject
   */
  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      deactivateTechnical();
      setStatusMap((prev) => ({ ...prev, globalStatus: "Off", [id]: "Off" }));
      localStorage.setItem("globalStatus", "Off");
      // Remove rejected request from UI immediately
      setRequestsSorted((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  /**
   * Sets the selected request and shows the location map modal
   * @param {object} request - The selected service request object
   */
  const handleShowLocationClick = (request) => {
    setSelectedRequest(request);
    setShowLocationMap(true);
  };

  /**
   * Closes the location map modal
   */
  const handleCloseMap = () => {
    setShowLocationMap(false);
  };

  // useEffect to initialize technical status and fetch requests on component mount
  useEffect(() => {
    const savedStatus = localStorage.getItem("globalStatus");
    if (savedStatus) {
      setStatusMap({ globalStatus: savedStatus });
    } else {
      setStatusMap({ globalStatus: "On" });
      localStorage.setItem("globalStatus", "On");
      activateTechnical();
    }
    getAllTechnicalRequestsSorted();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Technical Service Requests Sorted</h1>

      {/* Global Status Buttons */}
      <div className="flex gap-5 justify-center m-3">
        <button onClick={() => {
          activateTechnical();
          setStatusMap((prev) => ({ ...prev, globalStatus: "On" }));
          localStorage.setItem("globalStatus", "On");
        }}
          className="bg-green-500 px-4 py-2 text-white rounded-xl">
          Set Active
        </button>

        <button onClick={() => {
          deactivateTechnical();
          setStatusMap((prev) => ({ ...prev, globalStatus: "Off" }));
          localStorage.setItem("globalStatus", "Off");
        }}
          className="bg-red-500 px-4 py-2 text-white rounded-xl">
          Set Inactive
        </button>

        <button className={`px-4 py-2 rounded-xl transition shadow-md ${statusMap.globalStatus === "On" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
          onClick={() => {
            const newStatus = statusMap.globalStatus === "On" ? "Off" : "On";
            setStatusMap((prev) => ({ ...prev, globalStatus: newStatus }));
            localStorage.setItem("globalStatus", newStatus);
          }}>
          {statusMap.globalStatus === "On" ? "On" : "Off"}
        </button>
      </div>

      {/* requests */}
      {requestsSorted.length === 0 ? (
        <p className="text-center text-gray-500">No requests available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requestsSorted.map((request) => (
            <div key={request.id} className="border-b pb-4 mb-4 last:border-none last:pb-0 bg-white shadow-lg rounded-lg p-5 border border-gray-200">
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

              <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 bg-[#0B4261] rounded-lg shadow-md flex flex-wrap gap-3 justify-center">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition shadow-md w-full md:w-auto"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-md w-full md:w-auto"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </button>

                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition shadow-md w-full md:w-auto"
                  onClick={() => setSelectedRequest(request)}
                >
                  View Details
                </button>

                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-md w-full md:w-auto"
                  onClick={() => handleShowLocationClick(request)}
                >
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
              <p className="text-gray-700"><strong>👤 User:</strong> {selectedRequest.userName}</p>
              <p className="text-gray-700"><strong>🛠 Job:</strong> {selectedRequest.techJop}</p>
              <p className="text-gray-700"><strong>📍 Distance:</strong> {selectedRequest.distance.toFixed(2)} km</p>
            </div>

            <div className="border-b pb-3 mb-3">
              <p className="text-gray-700"><strong>💲 Price:</strong> ${selectedRequest.servicePrice}</p>
              <p className="text-gray-700"><strong>🔢 Quantity:</strong> {selectedRequest.serviceQuantity}</p>
            </div>

            <div className="border-b pb-3 mb-3">
              <p className={`text-lg font-medium ${selectedRequest.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>
                💳 Payment Status: {selectedRequest.paymentStatus}
              </p>
              <p className="text-gray-700"><strong>📊 Business Status:</strong> {selectedRequest.busnissStatus}</p>
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
              key={selectedRequest.id}
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
    </div>
  );
}
