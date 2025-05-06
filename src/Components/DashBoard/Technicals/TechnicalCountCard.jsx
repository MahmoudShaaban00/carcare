import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

export default function TechnicalCountCard() {
  const [technicalCount, setTechnicalCount] = useState(0);

  // Fetch technical data
  const getDataTechnicals = async () => {
    try {
      const { data } = await axios.get('https://carcareapp.runasp.net/api/DashBoard/GetTechnicals');
      setTechnicalCount(data.length); // Set the count of technicals
      console.log('Fetched Technicals:', data);
    } catch (error) {
      console.error("Error fetching technicals", error);
      alert('Error fetching technicals');
    }
  };

  useEffect(() => {
    getDataTechnicals();
  }, []); // Fetch technicals on mount

  return (
    <Card sx={{ boxShadow: 3, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
          Total Technicals
        </Typography>
        <Typography variant="h4" align="center" sx={{ marginTop: 1 }}>
          {technicalCount} {/* Display the technical count */}
        </Typography>
      </CardContent>
    </Card>
  );
}
