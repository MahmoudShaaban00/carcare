import React, { useContext } from 'react';
import { ServicesContext } from '../../../Context/ServicesDashboard';

export default function Services() {
  const {
    services,
    selectedService,
    updateData,
    updateImageFile,
    createData,
    imageFile,
    replaceBaseUrl,
    getServiceById,
    updateService,
    handleDeleteService,
    handleUpdateChange,
    handleCreateChange,
    handleFileChange,
    handleUpdateFileChange,
    createService,
    setSelectedService,
  } = useContext(ServicesContext);

  return (
    <div>
      <div className="bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-800 text-center pt-10">Services CarCare</h1>

        {/* Create Service Form */}
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Create New Service</h2>
          <input
            type="text"
            name="name"
            placeholder="Service Name"
            value={createData.name}
            onChange={handleCreateChange}
            className="w-full p-2 border rounded mb-3"
          />
          <textarea
            name="description"
            placeholder="Service Description"
            value={createData.description}
            onChange={handleCreateChange}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded mb-3"
          />
          <button
            onClick={createService}
            className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
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
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
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
                    onChange={handleUpdateChange}
                    className="w-full p-2 border rounded mt-2"
                  />
                  <textarea
                    name="description"
                    value={updateData.description}
                    onChange={handleUpdateChange}
                    className="w-full p-2 border rounded mt-2"
                  />
                  {/* Show current image preview */}
                  {updateImageFile ? (
                    <img
                      src={URL.createObjectURL(updateImageFile)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded mt-2"
                    />
                  ) : updateData.pictureUrl ? (
                    <img
                      src={replaceBaseUrl(updateData.pictureUrl)}
                      alt={updateData.name}
                      className="w-full h-48 object-cover rounded mt-2"
                    />
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpdateFileChange}
                    className="w-full p-2 border rounded mt-2"
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
                    className="mt-4 w-full h-[200px] object-cover"
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
