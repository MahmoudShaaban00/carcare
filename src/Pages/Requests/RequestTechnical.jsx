import React, { useState, useEffect } from "react";
import { useRequests } from "../../Context/RequestsTechContext";
import tecpro from '../../assets/tecpro.jpg';
import UserLocationMap from "../Map/UserLocationMap";
import { use } from "react";

export default function RequestsTechnical() {
  const { requests, setRequests, allRequests, getAllTechnicalRequests, acceptRequest, rejectRequest, completeRequest,
    activateTechnical, deactivateTechnical, getPendingRequests, getInProgressRequests,
    getCancledRequests, getCompletedRequests, completedRequests, cancledRequests, InProgressRequests, pendingRequests } = useRequests();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");

  // Set default status to "On" or "Off" based on localStorage
  useEffect(() => {
    getAllTechnicalRequests();
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

  // Fetch all requests on component mount
  const handleShowLocationClick = (request) => {
    setSelectedRequest(request);
    setShowLocationMap(true);
  };

  // Close location map modal
  const handleCloseMap = () => {
    setShowLocationMap(false);
  };

  // Search for a specific request by ID
  const handleSearch = () => {
    if (!searchId.trim()) {
      alert("Please enter a request ID.");
      return;
    }

    // Check if the searchId is a valid number
    const foundRequest = allRequests.find((req) => req.id === Number(searchId));
    if (foundRequest) {
      setRequests([foundRequest]);
    } else {
      alert(`Request with ID ${searchId} not found.`);
      setRequests([]);
    }

    setShowLocationMap(false);
    setSelectedRequest(null);
  };

  // Toggle the status of a request
  const toggleStatus = (id) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: prev[id] === "On" ? "Off" : "On",
    }));
  };

  // Accept a request
  const handleAccept = (id) => {
    acceptRequest(id);
    deactivateTechnical();
    setStatusMap((prev) => ({ ...prev, globalStatus: "Off", [id]: "Off" }));
    localStorage.setItem("globalStatus", "Off");
    getPendingRequests(); // Refresh list

  };

  // Reject a request
  const handleReject = (id) => {
    rejectRequest(id);
    deactivateTechnical();
    setStatusMap((prev) => ({ ...prev, globalStatus: "Off", [id]: "Off" }));
    localStorage.setItem("globalStatus", "Off");
    getPendingRequests(); // Refresh list
  };


  // complete a request
  const handleComplete = (id) => {
    completeRequest(id);
    getCompletedRequests();
  };

  // Filter requests based on status
  useEffect(() => {
    switch (filterStatus) {
      case "Pending":
        setRequests(pendingRequests);
        break;
      case "In Progress":
        setRequests(InProgressRequests);
        break;
      case "Canceled":
        setRequests(cancledRequests);
        break;
      case "Completed":
        setRequests(completedRequests);
        break;
      default:
        setRequests(allRequests);
    }
  }, [filterStatus, pendingRequests, InProgressRequests, cancledRequests, completedRequests, allRequests]);

  useEffect(() => {
    getCancledRequests()
    getCompletedRequests()
    getInProgressRequests()
    getPendingRequests()
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6" data-aos='fade-right' data-aos-delay='600' data-aos-duration='1000'>Technical Service Requests</h1>

      {/* Status Buttons and Filter Dropdown */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-5 justify-center items-center m-3" data-aos="fade-right" data-aos-delay="600" data-aos-duration="1000">
        <div className="flex flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => { activateTechnical(); setStatusMap((prev) => ({ ...prev, globalStatus: "On" })); localStorage.setItem("globalStatus", "On"); }}
            className="bg-green-500 px-4 py-2 text-white rounded-xl flex-1">
            Set Active
          </button>

          <button
            onClick={() => { deactivateTechnical(); setStatusMap((prev) => ({ ...prev, globalStatus: "Off" })); localStorage.setItem("globalStatus", "Off"); }}
            className="bg-red-500 px-4 py-2 text-white rounded-xl flex-1">
            Set Inactive
          </button>
        </div>


        <button className={`px-4 py-2 rounded-xl transition shadow-md w-full md:w-auto ${statusMap.globalStatus === "On"
          ? "bg-green-500 text-white"
          : "bg-gray-500 text-white"
          }`}
          onClick={() => {
            const newStatus = statusMap.globalStatus === "On" ? "Off" : "On";
            setStatusMap((prev) => ({ ...prev, globalStatus: newStatus }));
            localStorage.setItem("globalStatus", newStatus);
          }}
        >
          {statusMap.globalStatus === "On" ? "On" : "Off"}
        </button>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto"
        >
          <option value="All">All Requests</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Canceled">Canceled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center mb-6" data-aos="fade-right" data-aos-delay="600" data-aos-duration="1000">
        {/* Input: Full width on mobile */}
        <input type="number" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Enter request ID"
          className="w-full md:w-auto border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />

        {/* Mobile: Wrap buttons in a row */}
        <div className="flex w-full md:w-auto gap-3">
          <button onClick={handleSearch} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md">
            Search
          </button>

          <button onClick={getAllTechnicalRequests} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition shadow-md" >
            Reset
          </button>
        </div>
      </div>


      {/* Requests List */}
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos='fade-right' data-aos-delay='600' data-aos-duration='1000'>
          {requests.map((request) => (
            <div key={request.id} className="border-b pb-4 mb-4 last:border-none last:pb-0 bg-white shadow-lg rounded-lg p-5 border border-gray-200">
              <div className="flex items-center gap-4">
                <img className="w-16 h-16 rounded-full shadow-lg" src={tecpro} alt="User" />
                <div>
                  <h5 className="text-lg font-medium text-gray-900">{request.userName}</h5>
                  <h5 className="text-lg font-medium text-gray-900">Id: {request.id}</h5>
                  <p className="text-sm text-gray-500">🛠 {request.techJop}</p>
                  <p className="text-sm text-gray-500">💲 ${request.servicePrice}</p>
                  <p className="text-sm text-gray-500">📍 Distance: {request.distance.toFixed(2)} km</p>
                  <p className="text-sm text-gray-500">💳 {request.busnissStatus}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gradient-to-r from-blue-400 bg-[#0B4261] rounded-lg shadow-md flex flex-wrap gap-3 justify-center">
                {request.busnissStatus !== "Completed" && request.busnissStatus !== "Canceled" && request.busnissStatus !== 'InProgress' && (
                  <>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition shadow-md w-full md:w-auto"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-md w-full md:w-auto"
                    >
                      Reject
                    </button>
                  </>
                )}

                {request.busnissStatus === "InProgress" && (
                  <button
                    onClick={() => handleComplete(request.id)}
                    className="bg-fuchsia-800 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition shadow-md w-full md:w-auto"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => setSelectedRequest(request)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition shadow-md w-full md:w-auto"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleShowLocationClick(request)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-md w-full md:w-auto"
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
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">🛠 Request Details</h2>

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

            <button className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition w-full shadow-md" onClick={() => setSelectedRequest(null)}>
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
            <UserLocationMap key={selectedRequest.id} userLatitude={selectedRequest.userLatitude} userLongitude={selectedRequest.userLongitude} />
          ) : (
            <p className="text-red-500">⚠️ Location data not available</p>
          )}

          <button onClick={handleCloseMap}
            className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition" >
            Close Map
          </button>
        </div>
      )}
    </div>
  );
}
