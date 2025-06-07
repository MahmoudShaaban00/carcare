import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [updateData, setUpdateData] = useState({ name: '', description: '', pictureUrl: '' });

  // State for creating new service
  const [createData, setCreateData] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  // Replace localhost with production URL
  function replaceBaseUrl(imageUrl) {
    if (!imageUrl) return '';
    return imageUrl.replace('localhost:7225', 'carcareapp.runasp.net');
  }

  // Fetch all services
  async function getServices() {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) {
        alert('Error: Token missing');
        return;
      }
      const { data } = await axios.get('https://carcareapp.runasp.net/api/ServiceTypes/GetAll', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to fetch services. Please try again.');
    }
  }

  // Fetch service by ID for editing
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
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      alert('Failed to fetch service. Please try again.');
    }
  }

  // Update existing service
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
      console.error('Error updating service:', error);
      alert('Failed to update service. Please try again.');
    }
  }

  // Handle delete service
 const handleDeleteService = async (id) => {
  const token = localStorage.getItem('AdminToken');
  console.log('Token:', token);
  if (!token) {
    alert('❌ Admin token is missing.');
    return;
  }

  if (!window.confirm('Are you sure you want to delete this service?')) return;

  try {
    const response = await axios.delete(`https://carcareapp.runasp.net/api/DashBoard/Delete-ServiceType/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Delete response:', response);
    alert('✅ Service deleted successfully.');
    setServices(services.filter(service => service.id !== id));
    getServices();
  } catch (error) {
    console.error('Error deleting service:', error.response);
    alert(error.response?.data?.message || '❌ Failed to delete service.');
  }
};

  // Handle input change for update form
  function handleChange(e) {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  }

  // Handle input change for create form
  function handleCreateChange(e) {
    setCreateData({ ...createData, [e.target.name]: e.target.value });
  }

  // Handle file selection for create form
  function handleFileChange(e) {
    setImageFile(e.target.files[0]);
  }

  // Create new service with image upload
  async function createService() {
    const token = localStorage.getItem('AdminToken');
    if (!token) {
      alert('Error: Token missing');
      return;
    }
    if (!createData.name.trim() || !createData.description.trim()) {
      alert('Name and Description are required.');
      return;
    }
    if (!imageFile) {
      alert('Please select an image file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Name', createData.name.trim());
      formData.append('Description', createData.description.trim());
      formData.append('PictureFile', imageFile); // adjust key if your API expects a different key

      await axios.post('https://carcareapp.runasp.net/api/DashBoard/Create-Service-Type', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Service created successfully!');
      setCreateData({ name: '', description: '' });
      setImageFile(null);
      getServices();
    } catch (error) {
      console.error('Error creating service:', error.response?.data || error.message);
      alert('Failed to create service. Please try again.');
    }
  }

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div>
      <div className="bg-gray-100">

      
        <h1 className="text-4xl font-bold text-blue-800 text-center pt-10">Services CarCare</h1>

        {/* Create Service Form */}
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Create New Service</h2>
          <input type="text" name="name" placeholder="Service Name" value={createData.name}
            onChange={handleCreateChange} className="w-full p-2 border rounded mb-3"/>
          <textarea name="description" placeholder="Service Description" value={createData.description}
            onChange={handleCreateChange} className="w-full p-2 border rounded mb-3"/>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded mb-3" />
          <button onClick={createService} className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
            Create Service
          </button>
        </div>

        {/* Services List and Edit */}
        {services.length === 0 ? (
          <div className="flex justify-center items-center mt-10">
            <svg
              className="animate-spin h-8 w-8 text-blue-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
        ) : (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-10 py-14 px-14">
            {services.map((service) =>
              selectedService && selectedService.id === service.id ? (
                <div key={service.id} className="p-4 border rounded-lg shadow-lg bg-white">
                  <h3 className="text-2xl font-semibold">Edit Service</h3>
                  <input
                    type="text"
                    name="name"
                    value={updateData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mt-2"
                  />
                  <textarea
                    name="description"
                    value={updateData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mt-2"
                  />
                  <input
                    type="text"
                    name="pictureUrl"
                    value={updateData.pictureUrl}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mt-2"
                    placeholder="Picture URL"
                  />
                  <button
                    onClick={updateService}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  key={service.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={replaceBaseUrl(service.pictureUrl)}
                    alt={service.name}
                    className="mt-4 w-full h-[200px]"
                  />
                  <div className="p-5 bg-gray-200 h-[180px] flex flex-col justify-between">
                    <div>
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-800">{service.name}</h5>
                      <p className="mb-3 font-normal text-lg text-blue-800">{service.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => getServiceById(service.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                      >
                        View / Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
