import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';
import { Card, CardContent, Typography, Box } from '@mui/material';
import axiosInstance from '../../../api'; 


export default function TechnicalPrefixChart() {
  const [dataTechnicals, setDataTechnicals] = useState([]);

  // Fetch technical data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('https://carcareapp.runasp.net/api/DashBoard/GetTechnicals');
        if (Array.isArray(data)) {
          setDataTechnicals(data);
        }
      } catch (error) {
        console.error('Error fetching technicals:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the pie chart
  const prepareChartData = () => {
    const validPrefixes = ['010', '011', '012', '015'];
    const prefixCounts = validPrefixes.reduce((acc, prefix) => {
      acc[prefix] = 0;
      return acc;
    }, {});

    const technicalUsers = dataTechnicals.filter((user) =>
      Array.isArray(user.roles)
        ? user.roles.includes('Technical')
        : typeof user.roles === 'string' && user.roles.includes('Technical')
    );

    technicalUsers.forEach((user) => {
      const prefix = user.phoneNumber?.slice(0, 3);
      if (validPrefixes.includes(prefix)) {
        prefixCounts[prefix]++;
      }
    });

    return Object.entries(prefixCounts).map(([prefix, count]) => ({
      id: prefix,
      label: prefix,
      value: count,
    }));
  };

  return (
    <Card
      sx={{
        boxShadow: 6,
        borderRadius: 4,
        p: 2,
        bgcolor: 'background.paper',
        height: { xs: 600, sm: 450, md: 400 }, // Responsive card height
        width: '100%',
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Technicals Phone Distribution
        </Typography>

        <Box sx={{ height: { xs: 450, sm: 350, md: 300 } }}>
          {dataTechnicals.length > 0 ? (
            <ResponsivePie
              data={prepareChartData()}
              margin={{ top: 30, right: 40, bottom: 40, left: 40 }}
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
          ) : (
            <Typography align="center">Loading chart...</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
