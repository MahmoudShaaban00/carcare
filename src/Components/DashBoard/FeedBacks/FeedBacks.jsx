import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment'; // For date formatting

export default function FeedBacks() {
    const [feedBacks, setFeedBacks] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getFeedBacks() {
        try {
            const token = localStorage.getItem('AdminToken');
            if (!token) {
                alert('Error: Admin token not found');
                console.error('Error: Admin token not found');
                return;
            }
            const { data } = await axios.get(`https://carcareapp.runasp.net/api/DashBoard/GetAllFeedBacks?Sort=RateAsc`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    'Content-type': 'application/json',
                }
            );

            console.log(data);
            setFeedBacks(data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFeedBacks();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Customer Feedbacks
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {feedBacks.length > 0 ? (
                        feedBacks.map((feedback, index) => (
                            <Grid item xs={12} sm={6} md={4} key={feedback.id || index}>
                                <Card sx={{ p: 2, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            User ID: {feedback.userName.slice(0, 8)}...
                                        </Typography>
                                        <Typography color="text.secondary">
                                           Comment : {feedback.comment || 'No comment provided.'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            ⭐ Rating: {feedback.rating}/5
                                        </Typography>
                                        <Typography variant="caption" color="gray">
                                           Date : {moment(feedback.date).format('MMMM Do YYYY, h:mm A')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography>No feedbacks available.</Typography>
                    )}
                </Grid>
            )}
        </Box>
    );
}
