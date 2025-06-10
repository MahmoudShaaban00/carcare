import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../api';

export const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [updateData, setUpdateData] = useState({ name: '', description: '', pictureUrl: '' });
  const [createData, setCreateData] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [updateImageFile, setUpdateImageFile] = useState(null);

  const BASE_URL = 'https://carcareapp.runasp.net';

  async function getServices() {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) return alert('Error: Token missing');

      const { data } = await axiosInstance.get(`${BASE_URL}/api/ServiceTypes/GetAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched services:', data);

      // Ensure pictureUrl is absolute
      const updatedData = data.map(service => ({
        ...service,
        pictureUrl: service.pictureUrl?.startsWith('http')
          ? service.pictureUrl
          : `${BASE_URL}/${service.pictureUrl}`,
      }));

      setServices(updatedData);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to fetch services.');
    }
  }

  async function getServiceById(id) {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) return alert('Error: Token missing');

      const { data } = await axiosInstance.get(`${BASE_URL}/api/ServiceTypes/GetServiceType/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedService(data);
      setUpdateData({
        name: data.name,
        description: data.description,
        pictureUrl: data.pictureUrl?.startsWith('http')
          ? data.pictureUrl
          : `${BASE_URL}/${data.pictureUrl}`,
      });
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      alert('Failed to fetch service.');
    }
  }

  async function updateService() {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token || !selectedService) return alert('Error: Missing data');

      const formData = new FormData();
      formData.append('Name', updateData.name.trim());
      formData.append('Description', updateData.description.trim());
      if (updateImageFile) {
        formData.append('PictureUrl', updateImageFile);  // <-- key changed here
      }

      await axiosInstance.put(
        `${BASE_URL}/api/DashBoard/Update-Service-Type/${selectedService.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Service updated successfully!');
      getServices();
      setSelectedService(null);
      setUpdateImageFile(null);
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service.');
    }
  }

 const handleDeleteService = async (id) => {
  const token = localStorage.getItem('AdminToken');
  if (!token) return alert('Token missing');

  if (!window.confirm('Are you sure you want to delete this service?')) return;

  try {
    const url = `${BASE_URL}/api/DashBoard/Delete-ServiceType/${id}`;
    console.log('Deleting service with URL:', url);

    await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert('Service deleted');
    getServices();
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete service.');
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

  function handleUpdateFileChange(e) {
    setUpdateImageFile(e.target.files[0]);
  }

  async function createService() {
    const token = localStorage.getItem('AdminToken');
    if (!token) return alert('Token missing');

    if (!createData.name.trim() || !createData.description.trim() || !imageFile) {
      return alert('All fields including image are required.');
    }

    try {
      const formData = new FormData();
      formData.append('Name', createData.name.trim());
      formData.append('Description', createData.description.trim());
      formData.append('PictureUrl', imageFile);  // <-- key here is PictureUrl as well

      await axios.post(`${BASE_URL}/api/DashBoard/Create-Service-Type`, formData, {
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
      console.error('Create error:', error);
      alert('Failed to create service.');
    }
  }

  return (
    <ServicesContext.Provider
      value={{
        getServices,
        services,
        selectedService,
        updateData,
        updateImageFile,
        createData,
        imageFile,
        getServiceById,
        updateService,
        handleDeleteService,
        handleUpdateChange: handleChange,
        handleCreateChange,
        handleFileChange,
        handleUpdateFileChange,
        createService,
        setSelectedService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
