import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../api"; 

const RequestsTechContext = createContext();

export const RequestsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [InProgressRequests, setInProgressRequests] = useState([]);
  const [cancledRequests, setCancledRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);

  // Function to fetch all technical requests
  const getAllTechnicalRequests = async () => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      const { data } = await axiosInstance.get("https://carcareapp.runasp.net/api/ServiceRequest/GetAllRequestsToTechnical", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(data);
      setAllRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Function to accept a technical request
  const acceptRequest = async (id) => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      await axiosInstance.put(
        `https://carcareapp.runasp.net/api/ServiceRequest/AcceptRequest/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAllTechnicalRequests();
      alert("Request has been accepted.");
      getPendingRequests()
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  // Function to reject a technical request
  const rejectRequest = async (id) => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      await axiosInstance.put(
        `https://carcareapp.runasp.net/api/ServiceRequest/RejectRequest/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Request has been rejected.");
      getAllTechnicalRequests();
      getPendingRequests()
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  // Function to complete a technical request
  const completeRequest = async (id) => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      await axiosInstance.put(
        `https://carcareapp.runasp.net/api/ServiceRequest/RejectRequest/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Request has been completed.");
      getAllTechnicalRequests();
      getCompletedRequests();
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  // Function to activate a technical 
  const activateTechnical = async () => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      await axiosInstance.put(
        "https://carcareapp.runasp.net/api/ServiceRequest/TechincalBeActive",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Technical has been activated.");
    } catch (err) {
      console.error("Error activating technical:", err);
      alert("Failed to activate technical.");
    }
  };

  // Function to deactivate technical
  const deactivateTechnical = async () => {
    try {
      const token = localStorage.getItem("TechnicalToken");
      await axiosInstance.put(
        "https://carcareapp.runasp.net/api/ServiceRequest/TechincalBeInActive",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Technical has been deactivated.");
    } catch (err) {
      console.error("Error deactivating technical:", err);
      alert("Failed to deactivate technical.");
    }
  };

  //function to fetch pending requests
  async function getPendingRequests() {
    try {
      const token = localStorage.getItem("TechnicalToken")
      if (!token) {
        alert("error of technical token ")
        return;
      }
      const { data } = await axiosInstance.get("https://carcareapp.runasp.net/api/ServiceRequest/GetAllRequestsToTechnical?status=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      setPendingRequests(data);
      console.log("pending requests", data)
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      alert("Failed to fetch pending requests.");
    }
  }

  // Function to fetch InProgress requests
  async function getInProgressRequests() {
    try {
      const token = localStorage.getItem("TechnicalToken")
      if (!token) {
        alert("error of technical token ")
        return;
      }
      const { data } = await axiosInstance.get("https://carcareapp.runasp.net/api/ServiceRequest/GetAllRequestsToTechnical?status=2", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      setInProgressRequests(data);
      console.log("InProgress requests", data)
    } catch (err) {
      console.error("Error fetching InProgress requests:", err);
      alert("Failed to fetch InProgress requests.");
    }
  }

  // Function to fetch Completed requests
  async function getCompletedRequests() {
    try {
      const token = localStorage.getItem("TechnicalToken")
      if (!token) {
        alert("error of technical token ")
        return;
      }
      const { data } = await axiosInstance.get("https://carcareapp.runasp.net/api/ServiceRequest/GetAllRequestsToTechnical?status=3", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      setCompletedRequests(data);
      console.log("Completed requests", data)
    }
    catch (err) {
      console.error("Error fetching Completed requests:", err);
      alert("Failed to fetch Completed requests.");
    }
  }

  // Function to fetch Cancled requests
  async function getCancledRequests() {
    try {
      const token = localStorage.getItem("TechnicalToken")
      if (!token) {
        alert("error of technical token ")
        return;
      }
      const { data } = await axiosInstance.get("https://carcareapp.runasp.net/api/ServiceRequest/GetAllRequestsToTechnical?status=4", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      setCancledRequests(data);
      console.log("Cancled requests", data)
    } catch (err) {
      console.error("Error fetching Cancled requests:", err);
      alert("Failed to fetch Cancled requests.");
    }
  }


  return (
    <RequestsTechContext.Provider
      value={{
        requests,
        setRequests,
        allRequests,
        setAllRequests,
        getAllTechnicalRequests,
        acceptRequest,
        rejectRequest,
        completeRequest,
        activateTechnical,     // 👈 Add this
        deactivateTechnical,   // 👈 Add this
        getPendingRequests,
        getInProgressRequests,  // 👈 Add this
        getCancledRequests, // 👈 Add this
        getCompletedRequests,
        completedRequests,
        pendingRequests,
        InProgressRequests,
        cancledRequests
      }}
    >

      {children}
    </RequestsTechContext.Provider>
  );
};

export const useRequests = () => useContext(RequestsTechContext);
