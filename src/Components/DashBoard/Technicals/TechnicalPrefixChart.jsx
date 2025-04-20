import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';

export default function TechnicalPrefixChart() {
    const theme = useTheme();
    const [dataTechnicals, setDataTechnicals] = useState([]);

    // Function to fetch technical data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('https://carcareapp.runasp.net/api/DashBoard/GetTechnicals');
                if (Array.isArray(data)) {
                    setDataTechnicals(data);
                }
            } catch (error) {
                console.error('Error fetching technicals:', error);
            }
        };

        fetchData();
    }, []);

    // Function to prepare chart data
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
        <Box sx={{ height: 400 }}>
            <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: 'black' ,fontWeight: 'bold'}}>
                Technicals Phone Distribution
            </Typography>

            {dataTechnicals.length > 0 ? (
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
            ) : (
                <Typography align="center">Loading chart...</Typography>
            )}
        </Box>
    );
}
