import axios from 'axios';
import React, { useEffect, useState } from 'react';
import tecpro from '../../../assets/tecpro.jpg'
import RequestsPieChart from '../Requests/RequestsPieChar'; // Adjust the import path as necessary
import RequestCountCard from './RequestCountCard';
import { Grid } from '@mui/material';

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null); // Added state to capture errors
    const [loading, setLoading] = useState(false); // Added loading state
    const [pageIndex, setPageIndex] = useState(1); // To track the current page
    const [totalCount, setTotalCount] = useState(0); // Total count of requests to handle pagination

    // Function to fetch requests
    const fetchRequests = async () => {
        setLoading(true); // Set loading true when fetching data
        try {
            const userId = localStorage.getItem('UserId'); // Ensure userId is not empty
            const token = localStorage.getItem('AdminToken');

            if (!userId || userId === "") {
                console.error("❌ UserId is missing or empty in localStorage");
                setError("UserId is missing. Please log in again.");
                return;
            }

            if (!token) {
                console.error("❌ AdminToken is missing in localStorage");
                setError("AdminToken is missing. Please log in again.");
                return;
            }

            console.log("✅ UserId:", userId);
            console.log("✅ Token Admin:", token);

            const { data } = await axios.get(`https://carcareapp.runasp.net/api/DashBoard/GetUserRequests`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    userId: userId  // Ensure correct header
                },
                params: {
                    userId: userId,  // Ensure correct parameter
                    pageSize: 10,
                    pageIndex: pageIndex,
                }
            });

            // Handle the data returned from the API
            setRequests(data.data); // Set the requests data
            setTotalCount(data.count); // Set the total count of requests for pagination
            console.log("✅ Requests data:", data.data); // Log the requests data
        } catch (error) {
            console.error("❌ Error fetching data:", error.response?.data || error.message);
            setError(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false); // Set loading false after fetch is done
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [pageIndex]); // Dependency on pageIndex so it refetches when pageIndex changes

    const [selectedRequest, setSelectedRequest] = useState(null);

    return (
        <div>
            {/* Title and Description */}
            <Grid container spacing={3} alignContent={'center'} justifyContent="center" marginBottom={3} marginTop={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <RequestCountCard  /> {/* Pass totalUsers as prop */}
                </Grid>
            </Grid>

            {/*list requests*/}
            <h1 className="text-3xl font-bold mb-3 text-center mt-2">Requests</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : requests.length === 0 ? (
                <p>No requests available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Displaying requests in a grid layout */}
                    {requests.map((request) => (
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

                            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md flex gap-3 justify-center">
                                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition shadow-md" onClick={() => setSelectedRequest(request)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => setPageIndex(prev => Math.max(prev - 1, 1))}
                    disabled={pageIndex === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    ⬅ Previous
                </button>
                <span className="text-lg font-medium text-gray-700">Page: {pageIndex}</span>
                <button
                    onClick={() => setPageIndex(prev => (pageIndex * 10 < totalCount ? prev + 1 : prev))}
                    disabled={pageIndex * 10 >= totalCount}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Next ➡
                </button>
            </div>

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
        </div>
    );
}
