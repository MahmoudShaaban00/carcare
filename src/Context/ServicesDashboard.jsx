import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [updateData, setUpdateData] = useState({ name: '', description: '', pictureUrl: '' });
  const [createData, setCreateData] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  function replaceBaseUrl(imageUrl) {
    if (!imageUrl) return '';
    return imageUrl.replace('localhost:7225', 'carcareapp.runasp.net');
  }

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

  const handleDeleteService = async (id) => {
    const token = localStorage.getItem('AdminToken');
    if (!token) {
      alert('❌ Admin token is missing.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`https://carcareapp.runasp.net/api/DashBoard/Delete-ServiceType/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Service deleted successfully.');
      setServices((prev) => prev.filter((service) => service.id !== id));
      getServices();
    } catch (error) {
      console.error('Error deleting service:', error.response);
      alert(error.response?.data?.message || '❌ Failed to delete service.');
    }
  };

  function handleChange(e) {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  }

  function handleCreateChange(e) {
    setCreateData({ ...createData, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    setImageFile(e.target.files[0]);
  }

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
      formData.append('PictureFile', imageFile);

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
    <ServicesContext.Provider
      value={{
        services,
        selectedService,
        updateData,
        createData,
        imageFile,
        replaceBaseUrl,
        getServiceById,
        updateService,
        handleDeleteService,
        handleChange,
        handleCreateChange,
        handleFileChange,
        createService,
        setSelectedService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
