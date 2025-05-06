import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

export default function UserCountCard() {
  const [userCount, setUserCount] = useState(0); // State to store the user count
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetch user data
  const getDataUsers = async () => {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) {
        alert('Authentication error: Please log in again.');
        return;
      }

      const { data } = await axios.get('https://carcareapp.runasp.net/api/DashBoard/GetUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setUserCount(data.length); // Set the user count from the API response
      console.log('Fetched Users:', data);
    } catch (error) {
      console.error('Error fetching users', error);
      setError('Error fetching users'); // Set error message if API call fails
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  useEffect(() => {
    getDataUsers(); // Fetch users on mount
  }, []);

  return (
    <Card sx={{ boxShadow: 3, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
          Total Users
        </Typography>

        {/* Displaying Loading, Error, or the actual user count */}
        {loading ? (
          <Typography variant="h5" align="center" sx={{ marginTop: 1 }}>
            Loading...
          </Typography>
        ) : error ? (
          <Typography variant="h5" align="center" sx={{ marginTop: 1, color: 'red' }}>
            {error}
          </Typography>
        ) : (
          <Typography variant="h4" align="center" sx={{ marginTop: 1 }}>
            {userCount} {/* Display the user count */}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
