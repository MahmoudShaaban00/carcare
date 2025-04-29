import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';
import { Card, CardContent, Typography, Box } from '@mui/material';

const RequestsPieChart = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem('UserId');
      const token = localStorage.getItem('AdminToken');

      if (!userId || !token) {
        setError("Missing credentials");
        return;
      }

      const { data } = await axios.get(`https://carcareapp.runasp.net/api/DashBoard/GetUserRequests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          userId: userId
        },
        params: { userId }
      });

      setRequests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const prepareChartData = () => {
    const statuses = ['Pending', 'Completed', 'InProgress', 'Canceled'];
    const counts = statuses.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
    requests.forEach(req => {
      const status = req.busnissStatus;
      if (statuses.includes(status)) counts[status]++;
    });

    return Object.keys(counts).map(status => ({
      id: status,
      label: status,
      value: counts[status],
    }));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ boxShadow: 6, borderRadius: 4, p: 2, bgcolor: 'background.paper' }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Business Status Overview
        </Typography>

        <Box sx={{ height: 330 }}>
          <ResponsivePie
            data={prepareChartData()}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333"
            arcLinkLabelsThickness={2}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="white"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestsPieChart;
