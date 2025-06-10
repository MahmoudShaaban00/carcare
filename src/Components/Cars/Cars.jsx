import axios from 'axios';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api'; // Adjust the import path as necessary

export default function Cars() {
    const [cars, setCars] = useState([]);

    // Fetch cars from the API
    async function getCars() {
        try {
            const token = localStorage.getItem('UserToken');
            const userId = localStorage.getItem('UserId');

            if (!token || !userId) {
                alert('Error: Missing user token or user ID');
                return;
            }

            const { data } = await axiosInstance.get(`https://carcareapp.runasp.net/api/Vehicle/Get-All-Vehicle-For-SpecificUser`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId },
            });

            setCars(data.data);
        } catch (error) {
            console.log('Error fetching data:', error.response?.data || error.message);
        }
    }

    // Delete a car by ID
    async function deleteCar(carId) {
        try {
            const token = localStorage.getItem('UserToken');
            if (!token) {
                alert('Error: Missing user token');
                return;
            }

            await axiosInstance.delete(`https://carcareapp.runasp.net/api/DashBoard/Delete-Vehicle/${carId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Car deleted successfully!');
            setCars(cars.filter(car => car.id !== carId));
        } catch (error) {
            console.log('Error deleting car:', error.response?.data || error.message);
        }
    }

    useEffect(() => {
        getCars();
    }, []);

    return (
        <div className="w-full px-4 py-8 md:px-8 bg-slate-50 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-[#0B4261] mb-6">My Cars</h2>

            {cars.length > 0 ? (
                <>
                    {/* Table for md and up */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-700 bg-white shadow-md rounded-xl overflow-hidden">
                            <thead className="bg-[#0B4261] text-white text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 text-left">Type</th>
                                    <th className="px-6 py-3 text-left">Color</th>
                                    <th className="px-6 py-3 text-left">Model</th>
                                    <th className="px-6 py-3 text-left">VIN Number</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car, index) => (
                                    <tr key={car.id} className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className="px-6 py-4 font-semibold">{car.model}</td>
                                        <td className="px-6 py-4">{car.color}</td>
                                        <td className="px-6 py-4">{car.year}</td>
                                        <td className="px-6 py-4">{car.viN_Number}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => deleteCar(car.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold transition duration-150"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards for mobile */}
                    <div className="block md:hidden space-y-4">
                        {cars.map((car) => (
                            <div key={car.id} className="bg-white rounded-xl shadow-md p-4">
                                <div className="text-lg font-semibold text-[#0B4261] mb-2">Car Name: {car.model}</div>
                                <p><span className="font-semibold">Color:</span> {car.color}</p>
                                <p><span className="font-semibold">Model:</span> {car.year}</p>
                                <p><span className="font-semibold">VIN:</span> {car.viN_Number}</p>
                                <button
                                    onClick={() => deleteCar(car.id)}
                                    className="mt-3 text-red-600 hover:text-red-800 font-semibold transition duration-150"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-center text-lg text-gray-600 mt-10">No cars found.</p>
            )}
        </div>
    );
}
