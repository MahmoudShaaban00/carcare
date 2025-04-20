import React, { useEffect, useState } from 'react';
import axios from 'axios';
import winch from '../../../assets/winch.jpg'

export default function Services() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [updateData, setUpdateData] = useState({ name: '', description: '', pictureUrl: '' });

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

    // function to get service by id
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
            setUpdateData({ name: data.name, description: data.description, pictureUrl: data.pictureUrl });
            setSelectedPrice(0);
        } catch (error) {
            console.error(`Error fetching service with ID ${id}:`, error);
            alert("Failed to fetch service. Please try again.");
        }
    }

    // function to delete service
    async function updateService() {
        try {
            const token = localStorage.getItem('AdminToken');
            if (!token) {
                alert('Error: Token missing');
                return;
            }
            await axios.put(
                `https://carcareapp.runasp.net/api/ServiceTypes/Update/${selectedService.id}`,
                updateData,
                {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                }
            );
            alert('Service updated successfully!');
            getServices();
            setSelectedService(null);
        } catch (error) {
            console.error("Error updating service:", error);
            alert("Failed to update service. Please try again.");
        }
    }

    // function to delete service
    function handleChange(e) {
        setUpdateData({ ...updateData, [e.target.name]: e.target.value });
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
                                        <h3 className="text-2xl font-semibold">Edit Service</h3>
                                        <input type="text" name="name" value={updateData.name} onChange={handleChange} className="w-full p-2 border rounded mt-2"/>
                                        <textarea name="description" value={updateData.description}  onChange={handleChange} className="w-full p-2 border rounded mt-2"/>
                                        <input type="text" name="pictureUrl" value={updateData.pictureUrl} onChange={handleChange} className="w-full p-2 border rounded mt-2"/>
                                        <button onClick={updateService} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800">
                                            Save Changes
                                        </button>
                                        <button onClick={() => setSelectedService(null)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-gray-300 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300">
                                        <img src={replaceBaseUrl(service.pictureUrl)} alt={service.name} className="mt-4 w-full h-[200px]" />
                                        <div className="p-5 bg-gray-200 h-[180px]">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-800">{service.name}</h5>
                                            <p className="mb-3 font-normal text-lg text-blue-800">{service.description}</p>
                                            <button onClick={() => getServiceById(service.id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                                                View / Edit
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
