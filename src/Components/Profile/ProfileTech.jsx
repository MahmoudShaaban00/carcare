import React, { useEffect, useState } from 'react'
import imguser from '../../assets/user.jpg';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { GrCircleInformation } from 'react-icons/gr';
import { IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router-dom';


export default function ProfileTech() {
  // varaibles for store data
  const [technicalData, setTechnicalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '', nationalId: '' });

  //function to get current technical information
  const getCurrentTechnical = async () => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      if (!token) return;

      const { data } = await axios.get("https://carcareapp.runasp.net/api/Account/GetCurrentUserByRole",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTechnicalData(data);
      setFormData({ fullName: data.fullName, email: data.email, phoneNumber: data.phoneNumber, nationalId: data.nationalId });
      console.log("Technical data fetched successfully:", data);

    } catch (error) {
      console.error("Error fetching Technical:", error);
    }
  };

  // function to send data to api
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // toggle edit
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  //to update infromation user
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      if (!token) return;

      const updatedData = {
        fullName: formData.fullName,
        email: formData.email ,
        phoneNumber: formData.phoneNumber ,
        nationalId: formData.nationalId // Adding nationalId to the payload
      };

      await axios.put("https://carcareapp.runasp.net/api/account/UpdateTech", updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setTechnicalData(updatedData);
      setIsEditing(false);
      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating technical data:", error);
    }
  };

  //function logout data
  function logOut() {
    localStorage.removeItem("TechnicalToken");
    setUserLogin(null);
    navigate('/login');
  }

  useEffect(() => {
    getCurrentTechnical();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">technical Profile</h1>
      <p className="text-gray-600 text-lg mb-10 text-center md:px-56">
        Manage your account settings and personal details.
      </p>

      {/*show infromation of user */}
      {technicalData ? (
        <div className="bg-white shadow-lg p-6 rounded-2xl place-items-center w-3/4 md:w-1/2 text-center">
          <img src={imguser} alt="User" className="rounded-full mx-auto w-32 h-32 mb-4" />
          <p className="font-bold text-xl text-gray-800">Username: {technicalData.fullName}</p>
          <p className="text-gray-700">Email: {technicalData.email}</p>
          <p className="text-gray-700">Phone: {technicalData.phoneNumber}</p>
          <p className="text-gray-700">National ID: {technicalData.nationalId}</p>

          {/* edit profile */}
          <div className="flex justify-center  bg-blue-800 text-white w-28 rounded-xl p-2 mt-2 cursor-pointer" onClick={toggleEdit}>
            <FaRegEdit size={20} />
            <button className="text-xl ml-1 ">Edit</button>
          </div>

          {/*edit information */}
          {isEditing && (
            <div className="mt-4 p-4 border border-gray-300 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Edit Profile</h2>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2 border rounded-md mb-2" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full p-2 border rounded-md mb-2" />
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 border rounded-md mb-2" />
              <input type="text" name="nationalId" value={formData.nationalId} onChange={handleInputChange} placeholder="National ID" className="w-full p-2 border rounded-md mb-2" />

              <div className="flex justify-between">
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md">Save</button>
                <button onClick={toggleEdit} className="bg-red-500 text-white px-4 py-2 rounded-md">Cancel</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/*action technical */}
      <div className="mt-8 bg-white shadow-lg p-6 rounded-2xl w-3/4 md:w-1/2">
        {/*action for legal information */}
        <div className="flex items-center gap-2 text-blue-800 mb-4">
          <GrCircleInformation className="text-2xl" />
          <Link to="/legalinformation" className="text-lg hover:underline">Legal Information</Link>
        </div>

        {/*action for logout */}
        <div className="flex items-center gap-2 text-blue-800">
          <IoIosLogOut className="text-2xl" />
          <span onClick={logOut} className="text-lg cursor-pointer">Logout</span>
        </div>
      </div>
      
    </div>
  )
}
