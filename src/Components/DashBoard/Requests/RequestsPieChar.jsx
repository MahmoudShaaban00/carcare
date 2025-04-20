import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';

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

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <h2 className="text-2xl font-bold text-center mb-2">Business Status Overview</h2>
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
    </div>
  );
};

export default RequestsPieChart;
