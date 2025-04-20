import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TextField,
    TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';

export default function Vehicle() {
    const [vehicleData, setVehicleData] = useState({});
    const [users, setUsers] = useState([]);
    const [vinNumber, setVinNumber] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    // Fetch users to get creator names
    async function getUsers() {
        try {
            const token = localStorage.getItem("AdminToken");
            const { data } = await axios.get('https://carcareapp.runasp.net/api/DashBoard/GetUsers',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('Unexpected user data format:', data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Fetch vehicle data by user ID
    async function getVehicleDataByUserId(userId) {
        try {
            const token = localStorage.getItem("AdminToken");
            if (!token) {
                alert("Authentication error: Please log in again.");
                return;
            }

            const url = `https://carcareapp.runasp.net/api/DashBoard/Get-All-Vehicle?userid=${userId}`;
            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(data.data)) {
                console.log(`Fetched Vehicle Data for UserID: ${userId}`, data);
                setVehicleData(prevState => ({ ...prevState, [userId]: data.data.length > 0 ? data.data : 'User does not own any vehicles' }));
            } else {
                console.error('Unexpected vehicle data format:', data);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }

    // Delete vehicle by ID
    async function handleDeleteVehicle(vehicleId, userId) {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            const token = localStorage.getItem("AdminToken");
            await axios.delete(`https://carcareapp.runasp.net/api/DashBoard/Delete-Vehicle/${vehicleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVehicleData(prevState => {
                const updatedVehicles = prevState[userId].filter(vehicle => vehicle.id !== vehicleId);
                return { ...prevState, [userId]: updatedVehicles.length > 0 ? updatedVehicles : 'User does not own any vehicles' };
            });
            alert("Vehicle deleted successfully.");
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            alert("Failed to delete vehicle.");
        }
    }

    // Close vehicle details
    function handleCloseVehicles(userId) {
        setVehicleData(prevState => {
            const newState = { ...prevState };
            delete newState[userId];
            return newState;
        });
    }

    // Function search by VIN Number
    async function handleSearch(event) {
        event.preventDefault();
    
        if (!vinNumber.trim()) {
            alert("Please enter a VIN number.");
            return;
        }
    
        const token = localStorage.getItem("AdminToken");
        
        if (!token) {
            alert("Authentication error: Please log in again.");
            return;
        }
    
        try {
            const url = `https://carcareapp.runasp.net/api/DashBoard/Get-All-Vehicle?Search=${vinNumber}`; // Fixed string interpolation
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
        
            if (response.data.data && Array.isArray(response.data.data)) {
                const foundVehicle = response.data.data.find(vehicle => vehicle.viN_Number === vinNumber);
                if (foundVehicle) {
                    setSearchResults([foundVehicle]); // Store found vehicle
                } else {
                    setSearchResults([]); // No vehicle found
                }
            } else {
                setSearchResults([]); // No vehicles available
            }
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
            
            if (error.response?.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("AdminToken");
                window.location.href = "/login"; // Redirect to login page
            } else {
                alert(`Error: ${error.response?.data?.message || "Unauthorized request"}`);
            }
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Box sx={{ width: '80%', margin: '40px auto', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Vehicle Information</Typography>

            {/* Search Input & Buttons */}
            <Box sx={{ marginBottom: 2 }}>
                <TextField
                    label="Enter VIN Number"
                    variant="outlined"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value)}
                    sx={{ marginRight: 2, width: '300px' }}
                />
                <Button variant="contained" color="primary" onClick={handleSearch} sx={{ marginRight: 1 }}>
                    Search
                </Button>
                <Button variant="contained" color="warning" onClick={() => { setVinNumber(""); setSearchResults(null); }}>
                    Clear
                </Button>
            </Box>

            {/* Display Search Results */}
            {searchResults !== null && (
                <Box sx={{ marginBottom: 4, padding: 2, border: '1px solid gray', borderRadius: 2 }}>
                    <Typography variant="h6">Search Results</Typography>
                    {searchResults.length > 0 ? (
                        <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '10px', boxShadow: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Model</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Year</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Color</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>VIN Number</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchResults.map(vehicle => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>{vehicle.model}</TableCell>
                                            <TableCell>{vehicle.year}</TableCell>
                                            <TableCell>{vehicle.color}</TableCell>
                                            <TableCell>{vehicle.viN_Number}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2" sx={{ color: 'red', marginTop: 2 }}>
                            No vehicle found with this VIN number.
                        </Typography>
                    )}
                </Box>
            )}

            {/* Users Table */}
            <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <React.Fragment key={user.id}>
                                    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => getVehicleDataByUserId(user.id)}
                                            >
                                                Get Vehicles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {vehicleData[user.id] && (
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                {Array.isArray(vehicleData[user.id]) ? (
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Model</TableCell>
                                                                <TableCell>Year</TableCell>
                                                                <TableCell>Color</TableCell>
                                                                <TableCell>Vin Number</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {vehicleData[user.id].map(vehicle => (
                                                                <TableRow key={vehicle.id}>
                                                                    <TableCell>{vehicle.model}</TableCell>
                                                                    <TableCell>{vehicle.year}</TableCell>
                                                                    <TableCell>{vehicle.color}</TableCell>
                                                                    <TableCell>{vehicle.viN_Number}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            size="small"
                                                                            onClick={() => handleDeleteVehicle(vehicle.id, user.id)}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                                                        {vehicleData[user.id]}
                                                    </Typography>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => handleCloseVehicles(user.id)}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    Close
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
                                    No user data available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
