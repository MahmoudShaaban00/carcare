import React, { useEffect, useState } from 'react';
import axios from 'axios';
import winch from '../../../assets/winch.jpg'

export default function Services() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    // Removed selectedPrice and updateData since they were mostly for update
    // If you want to keep them for something else, you can keep, but here I removed updateData for simplicity

    function replaceBaseUrl(imageUrl) {
        if (!imageUrl) return '';
        return imageUrl.replace('localhost:7225', 'carcareapp.runasp.net');
    }

    // function to get all services
    async function getServices() {
        try {
            const token = localStorage.getItem('AdminToken');
            if (!token) {
                alert('Error: Token missing');
                return;
            }
            const { data } = await axios.get(`https://carcareapp.runasp.net/api/ServiceTypes/GetAll`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
            alert("Failed to fetch services. Please try again.");
        }
    }

    // function to get service by id (only for viewing)
    async function getServiceById(id) {
        try {
            const token = localStorage.getItem('AdminToken');
            if (!token) {
                alert('Error: Token missing');
                return;
            }
            const { data } = await axios.get(`https://carcareapp.runasp.net/api/ServiceTypes/GetServiceType/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedService(data);
            // No need to set updateData anymore
        } catch (error) {
            console.error(`Error fetching service with ID ${id}:`, error);
            alert("Failed to fetch service. Please try again.");
        }
    }

    useEffect(() => {
        getServices();
    }, []);

    return (
        <div>
            <div className='bg-gray-100'>
                <h1 className='text-4xl font-bold text-blue-800 text-center pt-10'>Services CarCare</h1>
                {services.length === 0 ? (
                    <div className="flex justify-center items-center mt-10">
                        <svg className="animate-spin h-8 w-8 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-10 py-14 px-14">
                        {services.map((service) => (
                            <div key={service.id} className="max-w-sm">
                                {selectedService && selectedService.id === service.id ? (
                                    <div className="p-4 border rounded-lg shadow-lg bg-white">
                                        <h3 className="text-2xl font-semibold">Service Details</h3>
                                        <p className="mt-2"><strong>Name:</strong> {selectedService.name}</p>
                                        <p className="mt-2"><strong>Description:</strong> {selectedService.description}</p>
                                        <p className="mt-2"><strong>Picture URL:</strong> {selectedService.pictureUrl}</p>
                                        <button onClick={() => setSelectedService(null)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800">
                                            Close
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-gray-300 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300">
                                        <img src={replaceBaseUrl(service.pictureUrl)} alt={service.name} className="mt-4 w-full h-[200px]" />
                                        <div className="p-5 bg-gray-200 h-[180px]">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-800">{service.name}</h5>
                                            <p className="mb-3 font-normal text-lg text-blue-800">{service.description}</p>
                                            <button onClick={() => getServiceById(service.id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
