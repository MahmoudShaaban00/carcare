import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Cars() {
    const [cars, setCars] = useState([]);

    // Function to get cars of user ID
    async function getCars() {
        try {
            const token = localStorage.getItem('UserToken');
            const userId = localStorage.getItem('UserId');

            console.log("User ID:", userId); // Debugging
            console.log("Token:", token); // Debugging

            if (!token || !userId) {
                alert('Error: Missing user token or user ID');
                return;
            }

            const { data } = await axios.get(`https://carcareapp.runasp.net/api/Vehicle/Get-All-Vehicle-For-SpecificUser`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId }, 
            });

            console.log("Fetched Cars:", data);
            setCars(data.data); 
        } catch (error) {
            console.log('Error fetching data:', error.response?.data || error.message);
        }
    }

    // Function to delete a car
    async function deleteCar(carId) {
        try {
            const token = localStorage.getItem('UserToken');

            if (!token) {
                alert('Error: Missing user token');
                return;
            }

            await axios.delete(`https://carcareapp.runasp.net/api/DashBoard/Delete-Vehicle/${carId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Car deleted successfully!');
            setCars(cars.filter(car => car.id !== carId)); // Remove the car from the state
        } catch (error) {
            console.log('Error deleting car:', error.response?.data || error.message);
        }
    }

    useEffect(() => {
        getCars();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold my-4">User's Cars</h2>
            {cars.length > 0 ? (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className="text-lg">
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Color</th>
                                <th scope="col" className="px-6 py-3">Model</th>
                                <th scope="col" className="px-6 py-3">VIN Number</th>
                                <th scope="col" className="text-center py-3">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-lg">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {car.model}
                                    </th>
                                    <td className="px-6 py-4">{car.color}</td>
                                    <td className="px-6 py-4">{car.year}</td>
                                    <td className="px-6 py-4">{car.viN_Number}</td>
                                    <td className="text-center py-4">
                                        <button 
                                            onClick={() => deleteCar(car.id)} 
                                            className="font-medium text-lg text-red-600 dark:text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-lg text-gray-600">No cars found.</p>
            )}
        </div>
    );
}
