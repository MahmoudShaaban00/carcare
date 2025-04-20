import axios from "axios";
import React, { useEffect, useState } from "react";
import tecpro from "../../assets/tecpro.jpg";

// Star rating component
const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex justify-center my-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange(star)} className={`text-3xl ${value >= star ? "text-yellow-400" : "text-gray-300"
          } hover:scale-125 transition-transform`} >
          ★
        </button>
      ))}
    </div>
  );
};

export default function RequestsUser() {
  
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [rate, setRate] = useState(0);
  const [rateTarget, setRateTarget] = useState({ techId: null, requestId: null });

  // Fetch requests
  async function getAllRequests() {
    try {
      const token = localStorage.getItem("UserToken");
      if (!token) throw new Error("UserToken not found in localStorage");

      const { data } = await axios.get(
        "https://carcareapp.runasp.net/api/ServiceRequest/GetAllRequests",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(data);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  }

  // Delete a request
  async function deleteRequest(requestId, serviceId, technicalId) {
    try {
      const token = localStorage.getItem("UserToken");
      if (!token) throw new Error("UserToken not found in localStorage");

      const { data } = await axios.delete(
        `https://carcareapp.runasp.net/api/ServiceRequest/DeleteRequestForUser/${requestId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: { requestId, serviceId, technicalId },
        }
      );

      console.log("Request deleted:", data);
      getAllRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  }

  // Function to submit rating for a technician
  const rateTechnical = async (rate, technicalid) => {
    try {
      const token = localStorage.getItem("UserToken");
      if (!token) throw new Error("UserToken not found in localStorage");

      console.log("Token:", token);
      console.log("Rate:", rate);
      console.log("Technical ID:", technicalid);

      const { data } = await axios.post(
        `https://carcareapp.runasp.net/api/account/RateTechnical?rate=${rate}&technicalid=${technicalid}`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      

      console.log("Rating submitted successfully:", data);
      alert("Rating submitted successfully!");
      return data;

    } catch (error) {
      console.error('Error rating technical:', error);
      alert('Error rating technical: ' + error.message);
      throw error;
    }
  };


  useEffect(() => {
    getAllRequests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Service Requests
      </h1>

      {/* Requests List */}
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests available</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white shadow-lg rounded-lg p-5 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                  src={tecpro}
                  alt="Technician"
                />
                <div>
                  <h5 className="text-lg font-medium text-gray-900">{request.userName}</h5>
                  <p className="text-sm text-gray-500">🛠 {request.techJop}</p>
                  <p className="text-sm text-gray-500">💲 ${request.servicePrice}</p>
                  <p className="text-sm text-gray-500">
                    📍 Distance: {request.distance.toFixed(2)} km
                  </p>
                  <p className="text-sm text-gray-500">💳 {request.busnissStatus}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex-1 transition-transform transform hover:scale-105"
                  onClick={() => setSelectedRequest(request)}
                >
                  View Details
                </button>

                {request.busnissStatus === "Pending" && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex-1 transition-transform transform hover:scale-105"
                    onClick={() =>
                      deleteRequest(request.id, request.serviceTypeId, request.techId)
                    }
                  >
                    Delete
                  </button>
                )}

                {request.busnissStatus === "Completed" && (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex-1 shadow-md transition-transform transform hover:scale-105"
                    onClick={() => {
                      setShowRateDialog(true);
                      setRateTarget({ techId: request.techId, requestId: request.id });
                    }}
                  >
                    Rate Technician
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-600"
              onClick={() => setSelectedRequest(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Service Request Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>👤 User:</strong> {selectedRequest.userName}</p>
              <p><strong>🛠 Technician:</strong> {selectedRequest.techName}</p>
              <p><strong>💼 Job:</strong> {selectedRequest.techJop}</p>
              <p><strong>📍 Distance:</strong> {selectedRequest.distance.toFixed(2)} km</p>
              <p><strong>💲 Price:</strong> ${selectedRequest.servicePrice}</p>
              <p><strong>📦 Quantity:</strong> {selectedRequest.serviceQuantity}</p>
              <p><strong>💳 Payment:</strong> {selectedRequest.paymentStatus}</p>
              <p><strong>🏢 Status:</strong> {selectedRequest.busnissStatus}</p>
              <p><strong>📅 Date:</strong> {new Date(selectedRequest.createdOn).toLocaleString()}</p>
            </div>
            <button
              className="mt-6 bg-indigo-600 text-white w-full py-2 rounded-lg hover:bg-indigo-700 transition"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Rate Technician Dialog */}
      {showRateDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              onClick={() => {
                setShowRateDialog(false);
                setRate(0);
              }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Rate the Technician</h2>

            {/* Star Display */}
            <div className="flex justify-center mb-4 text-3xl text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>{rate >= star ? "★" : "☆"}</span>
              ))}
            </div>

            {/* Range Input */}
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-yellow-500"
            />
            <p className="text-center mt-2 text-gray-600">Rating: {rate.toFixed(1)} / 5</p>

            {/* Submit Rating Button */}
            <button
              onClick={() => {
                rateTechnical(rate, rateTarget.techId);
                setShowRateDialog(false);
                setRate(0);
              }}
              className="mt-6 w-full bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 shadow-md text-lg"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
