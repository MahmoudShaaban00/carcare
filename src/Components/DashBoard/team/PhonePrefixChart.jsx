import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar'; 
import axios from 'axios';

export default function PhonePrefixChart() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);

  // Fetch users data from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
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

        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Prepare chart data based on the fetched users
  const prepareChartData = () => {
    const validPrefixes = ['010', '011', '012', '015'];
    const prefixCounts = validPrefixes.reduce((acc, prefix) => {
      acc[prefix] = 0;
      return acc;
    }, {});

    users.forEach((user) => {
      const phonePrefix = user.phoneNumber?.slice(0, 3);
      if (validPrefixes.includes(phonePrefix)) {
        prefixCounts[phonePrefix] += 1;
      }
    });

    // Convert to data format suitable for ResponsiveBar
    return Object.entries(prefixCounts).map(([prefix, count]) => ({
      prefix,
      count
    }));
  };

  return (
    <Box sx={{ height: 400 }}>
      <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
        Users Phone Distribution
      </Typography>

      {users.length > 0 ? (
        <ResponsiveBar
          data={prepareChartData()}
          keys={['count']} // Specify the key to be plotted
          indexBy="prefix" // Label the bars with the phone prefix
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Phone Prefix',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Users',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          borderRadius={5}
          borderWidth={2}
        />
      ) : (
        <Typography textAlign="center">Loading chart...</Typography>
      )}
    </Box>
  );
}
