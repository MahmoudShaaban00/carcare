import React, { useContext, useEffect, useState } from 'react';
import imguser from '../../assets/user.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlinePublishedWithChanges } from 'react-icons/md';
import { GrCircleInformation } from 'react-icons/gr';
import { IoIosLogOut } from 'react-icons/io';
import { FaRegEdit } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';


export default function Profile() {
  // varaibles for store data
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '' });

  // Feedback state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  let navigate = useNavigate();
  let { setUserLogin } = useContext(UserContext);

  //function logout data
  function logOut() {
    localStorage.removeItem("UserToken");
    setUserLogin(null);
    navigate('/login');
  }

  // function to get user information
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("UserToken");
      if (!token) return;

      const { data } = await axios.get("https://carcareapp.runasp.net/api/Account/GetCurrentUserByRole",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(data);
      setFormData({ fullName: data.fullName, email: data.email, phoneNumber: data.phoneNumber });

    } catch (error) {
      console.error("Error fetching user:", error);
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
      const token = localStorage.getItem("UserToken");
      console.log("Token before update request:", token);
      if (!token) return;

      const updatedData = { fullName: formData.fullName, email: formData.email, phoneNumber: formData.phoneNumber };

      await axios.put("https://carcareapp.runasp.net/api/account/UpdateAppUser", updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setUserData(updatedData);
      setIsEditing(false);
      console.log("User data updated successfully!");
      alert("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating user data:", error);
    }
  };

  //create feed back
  const createFeedBack = async () => {
    try {
      const token = localStorage.getItem('UserToken');
      console.log('Token:', token);
      if (!token) {
        console.error('Token not found');
        return;
      }

      if (comment.trim() === "") {
        console.error('Comment cannot be empty');
        return;
      }

      const feedbackData = {
        comment: comment,
        rating: rating
      };

      console.log('Feedback Data:', feedbackData);

      const response = await axios.post('https://carcareapp.runasp.net/api/FeedBack/CreateFeedBack', feedbackData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert("Feedback submitted successfully!");
      console.log('Feedback submitted successfully:', response.data);

      if (response.data && response.data.id) {
        localStorage.setItem('FeedBackId', response.data.id)
        console.log('Feedback ID:', response.data.id);
      }

      setIsFeedbackOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
    
      if (errorMessage === "You Already Add FeedBack Please Update Your FeedBack or Enter a Comment") {
        console.error('Feedback already submitted. Please update your feedback.');
        alert('Feedback already submitted. Please update your feedback.');
      } else {
        console.error('Error submitting feedback:', error.response?.data || error.message);
        alert(`Error submitting feedback: ${errorMessage || error.message}`);
      }
    }
    
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">User Profile</h1>
      <p className="text-gray-600 text-lg mb-10 text-center md:px-56">
        Manage your account settings and personal details.
      </p>

      {/*show infromation of user */}
      {userData ? (
        <div className="bg-white shadow-lg p-6 rounded-2xl place-items-center w-3/4 md:w-1/2 text-center">
          <img src={imguser} alt="User" className="rounded-full mx-auto w-32 h-32 mb-4" />
          <p className="font-bold text-xl text-gray-800">Username: {userData.fullName}</p>
          <p className="text-gray-700">Email: {userData.email}</p>
          <p className="text-gray-700">Phone: {userData.phoneNumber}</p>


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

              <div className="flex justify-between">
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md">Save</button>
                <button onClick={toggleEdit} className="bg-red-500 text-white px-4 py-2 rounded-md">Cancel</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-700">Loading user data...</p>
      )}

      {/*actions for in profile user */}
      <div className="mt-8 bg-white shadow-lg p-6 rounded-2xl w-3/4 md:w-1/2">
      
        {/*action for change password */}
        <div className="flex items-center gap-2 text-blue-800 mb-4">
          <MdOutlinePublishedWithChanges className="text-2xl" />
          <Link to="/changepassword" className="text-lg hover:underline">Change Password</Link>
        </div>

        {/* Feedback button */}
        <div className="flex items-center gap-2 text-blue-800 mb-4">
          <MdOutlinePublishedWithChanges className="text-2xl" />
          <button onClick={() => setIsFeedbackOpen(true)} className="text-lg hover:underline">Feedback</button>
        </div>

        {/* Handle feedback modal */}
        {isFeedbackOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 md:mx-0 mx-3">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button onClick={() => setIsFeedbackOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"> ✖</button>
              <h2 className="text-xl font-semibold text-center">Rate Your Experience</h2>

              {/* Star Rating */}
              <div className="flex justify-center space-x-2 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className={`cursor-pointer text-3xl ${rating >= star ? "text-yellow-500" : "text-gray-400"}`} onClick={() => handleStarClick(star)} />
                ))}
              </div>

              {/* Rating Slider */}
              <div className="flex justify-center mt-4">
                <input type="range" min="0" max="5" step="0.1" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-3/4" />
              </div>

              {/* Feedback Input */}
              <textarea className="w-full mt-4 p-2 border rounded-lg" placeholder="Write your feedback..." value={comment} onChange={(e) => setComment(e.target.value)} />

              {/* Submit Button */}
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full" onClick={createFeedBack} disabled={rating === 0 || comment.trim() === ""} >
                Submit
              </button>
            </div>

          </div>
        )}

        {/*action for legal information */}
        <div className="flex items-center gap-2 text-blue-800 mb-4">
          <GrCircleInformation className="text-2xl" />
          <Link to="/legalinformation" className="text-lg hover:underline">Legal Information</Link>
        </div>

        {/*action for view feed back */}
        <div className="flex items-center gap-2 text-blue-800 mb-4">
          <GrCircleInformation className="text-2xl" />
          <Link to="/feedback" className="text-lg hover:underline">View FeedBack</Link>
        </div>

         {/*action for contact */}
         <div className="flex items-center gap-2 text-blue-800 mb-4">
          <GrCircleInformation className="text-2xl" />
          <Link to="/contactuser" className="text-lg hover:underline">Contact Message</Link>
        </div>

        {/*action for logout */}
        <div className="flex items-center gap-2 text-blue-800">
          <IoIosLogOut className="text-2xl" />
          <span onClick={logOut} className="text-lg cursor-pointer">Logout</span>
        </div>
      </div>
    </div>
  );
}
