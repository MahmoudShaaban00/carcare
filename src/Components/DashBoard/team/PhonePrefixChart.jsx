import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import axios from 'axios';

export default function PhonePrefixChart() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);

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

    return Object.entries(prefixCounts).map(([prefix, count]) => ({
      prefix,
      count
    }));
  };

  return (
  <Card
  sx={{
    boxShadow: 6,
    borderRadius: 4,
    p: 2,
    bgcolor: 'background.paper',
    height: { xs: 550, sm: 450, md: 400 },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }}
>
  <CardContent sx={{ flex: 1 }}>
    <Typography
      variant="h5"
      textAlign="center"
      gutterBottom
      sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
    >
      Users Phone Distribution
    </Typography>

    <Box
      sx={{
        height: { xs: 400, sm: 300, md: 280 }, // increased for small screens
        mt: 2,
      }}
    >
      {users.length > 0 ? (
        <ResponsiveBar
          data={prepareChartData()}
          keys={['count']}
          indexBy="prefix"
          margin={{ top: 40, right: 40, bottom: 60, left: 30 }}
          padding={0.4} // wider bars
          colors={{ scheme: 'nivo' }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Phone Prefix',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Users',
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
  </CardContent>
</Card>

  );
}
