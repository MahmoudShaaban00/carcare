import {  useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import axiosInstance from '../../api'; 


export default function FeedbackComponent () {

  const [feedback, setFeedback] = useState(null);

    // Feedback state
      const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
      const [rating, setRating] = useState(0);
      const [comment, setComment] = useState("");
  

  // function to get feedback data
  async function getFeedBack() {
    try {
      const token = localStorage.getItem("UserToken");
      const feedbackId = localStorage.getItem("FeedBackId"); // Ensure the correct key spelling
  
      if (!token) {
        console.error("User token is missing from localStorage.");
        return;
      }
  
      if (!feedbackId) {
        console.error("Feedback ID is missing from localStorage.");
        alert("Feedback ID is missing from localStorage.");
        return;
      }
  
      const { data } = await axiosInstance.get(
        `https://carcareapp.runasp.net/api/FeedBack/GetFeedBack/${feedbackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Feedback Data:", data);
      setFeedback(data);
      alsert("Feedback data fetched successfully!");
    } catch (error) {
      console.error("Error fetching feedback:", error);
      alsert("Error fetching feedback:", error);
    }
  }
  
  //function to delete feed back
  async function deleteFeedBack() {
    try {
      const token = localStorage.getItem("UserToken");
      const feedbackId = localStorage.getItem("FeedBackId");
  
      if (!token || !feedbackId) {
        console.error("Missing token or feedbackId");
        return;
      }
  
      const isConfirmed = window.confirm("Are you sure you want to delete this feedback?");
      if (!isConfirmed) return;
  
      await axiosInstance.delete(
        `https://carcareapp.runasp.net/api/FeedBack/DeleteFeedBack/${feedbackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Feedback deleted successfully");
      alsert("Feedback deleted successfully!");
  
      setFeedback(null);
      localStorage.removeItem("FeedBackId");
  
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alsert("Error deleting feedback. Please try again later.");
    }
  }
  
  // function to update feed back
  async function updateFeedBack() {
    try {
      const token = localStorage.getItem('UserToken');  
      const feedbackId = localStorage.getItem("FeedBackId");
  
      if (!token || !feedbackId) {
        console.error('Token or feedbackId not found');
        return;  
      }
  
      if (comment.trim() === "") {
        console.error('Comment cannot be empty');
        return;  
      }
  
      const feedbackData = {
        comment: comment,
        rating: rating,
      };
  
      console.log('Feedback Data:', feedbackData);  
  
      let { data } = await axiosInstance.put(
        `https://carcareapp.runasp.net/api/FeedBack/UpdateFeedBack/${feedbackId}`,
        feedbackData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Feedback updated successfully:', data);
  
      // Update the state with the new feedback data
      setFeedback((prev) => ({ ...prev, comment: data.comment, rating: data.rating,date: new Date().toISOString(), // Update the date to current time
 }));
  
      setIsFeedbackOpen(false); // Close the modal
    } catch (error) {
      if (error.response?.data?.message === "You Already Add FeedBack Please Update Your FeedBack or Enter a Comment") {
        console.error('Feedback already submitted. Please update your feedback.');
      } else {
        console.error('Error submitting feedback:', error.response?.data || error.message);
      }
    }
  }
  

  useEffect(() => {
    getFeedBack();
  }, []);


  return (
  
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg my-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">User Feedback</h2>
      {feedback ? (
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-gray-700"><strong>Comment:</strong> {feedback.comment}</p>
          <p className="text-gray-700"><strong>Rating:</strong> {feedback.rating} ⭐</p>
          <p className="text-gray-700"><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
          <div className="gap-5 flex mt-5">
            <button onClick={deleteFeedBack} className="bg-red-600 text-white px-5 py-2 rounded-xl cursor-pointer hover:bg-red-300">Delete</button>
            <button onClick={() => setIsFeedbackOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded-xl">Update</button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading feedback...</p>
      )}

       {/* Handle feedback modal */}
       {isFeedbackOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button  onClick={() => setIsFeedbackOpen(false)}  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"> ✖</button>
            <h2 className="text-xl font-semibold text-center">Rate Your Experience</h2>

            {/* Star Rating */}
            <div className="flex justify-center space-x-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className={`cursor-pointer text-3xl ${rating >= star ? "text-yellow-500" : "text-gray-400"}`} onClick={() => handleStarClick(star)}/>
              ))}
            </div>

            {/* Rating Slider */}
            <div className="flex justify-center mt-4">
              <input type="range" min="0" max="5" step="0.1" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-3/4"/>
            </div>

            {/* Feedback Input */}
            <textarea className="w-full mt-4 p-2 border rounded-lg" placeholder="Write your feedback..." value={comment} onChange={(e) => setComment(e.target.value)} />

            {/* Submit Button */}
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full" onClick={updateFeedBack} disabled={rating === 0 || comment.trim() === ""} >
              Update
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

