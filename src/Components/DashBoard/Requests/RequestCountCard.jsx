import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import axiosInstance from '../../../api'; // Adjust the import path as necessary

export default function RequestCountCard() {
  const [totalCount, setTotalCount] = useState(0); // Store total request count
  const [loading, setLoading] = useState(false); // Manage loading state
  const [error, setError] = useState(null); // Manage error state

  // Fetch total requests data
  const fetchTotalRequests = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('UserId');
      const token = localStorage.getItem('AdminToken');

      if (!userId || !token) {
        console.error("❌ Missing UserId or AdminToken in localStorage");
        setError("Missing credentials. Please log in again.");
        return;
      }

      const { data } = await axiosInstance.get('https://carcareapp.runasp.net/api/DashBoard/GetUserRequests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          userId: userId,
        },
        params: {
          userId: userId,
          pageSize: 1, // Only need one item for total count
          pageIndex: 1,
        }
      });

      setTotalCount(data.count); // Set the total count of requests
    } catch (error) {
      console.error("❌ Error fetching requests:", error.response?.data || error.message);
      setError(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false); // Set loading false after fetch is done
    }
  };

  useEffect(() => {
    fetchTotalRequests(); // Fetch the data when component mounts
  }, []);

  return (
    <Card sx={{ boxShadow: 3, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
          Total Requests
        </Typography>
        {loading ? (
          <Typography variant="h4" align="center" sx={{ marginTop: 1 }}>
            Loading...
          </Typography>
        ) : error ? (
          <Typography variant="h4" align="center" sx={{ marginTop: 1, color: 'red' }}>
            {error}
          </Typography>
        ) : (
          <Typography variant="h4" align="center" sx={{ marginTop: 1 }}>
            {totalCount}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
