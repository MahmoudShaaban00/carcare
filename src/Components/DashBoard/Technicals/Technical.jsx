import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import TechnicalPrefixChart from './TechnicalPrefixChart';

export default function Technical() {
    const theme = useTheme();
  const [dataTechnicals, setDataTechnicals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTechnical, setSelectedTechnical] = useState(null);
  const [roles, setRoles] = useState([
    { id: 1, name: 'Technical', isSelected: true },
    { id: 2, name: 'User', isSelected: false }
  ]);

  // Function to fetch technical data
  async function getDataTechnicals() {
    try {
      const { data } = await axios.get('https://carcareapp.runasp.net/api/DashBoard/GetTechnicals');
      if (data && Array.isArray(data)) {
        setDataTechnicals(data);
      }
    } catch (error) {
      console.error("Error fetching technicals", error);
      alert('Error fetching technicals');
    }
  }

  // Function to delete a technical
  async function deleteTechnical(id) {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) {
        alert('Error: Admin token is missing');
        return;
      }

      const response = await axios.delete(`https://carcareapp.runasp.net/api/DashBoard/DeleteTechnical/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setDataTechnicals(prevData => prevData.filter(tech => tech.id !== id));
        alert('Technical deleted successfully');
      } else {
        alert("Unexpected response during delete.");
      }
    } catch (error) {
      console.error("Error deleting technical", error.response?.data || error);
      alert('Error deleting technical');
    }
  }

  // Function to handle role checkbox change
  const handleRoleChange = (roleId) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, isSelected: !role.isSelected } : role
      )
    );
  };

  // Function to update technical roles
  const updateRoleTechnical = async () => {
    if (!selectedTechnical || !selectedTechnical.id) return;

    console.log('Selected Technical ID:', selectedTechnical.id);
    console.log('Selected Roles:', roles.filter((r) => r.isSelected));

    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) {
        alert('Authentication error: Please log in again.');
        return;
      }

      const selectedRoles = roles
        .filter((r) => r.isSelected)
        .map((r) => ({ id: r.id, name: r.name }));

      const apiUrl = `https://carcareapp.runasp.net/api/DashBoard/UpdateTechnical/${selectedTechnical.id}`;

      const response = await axios.put(apiUrl, { roles: selectedRoles }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const updatedRoleNames = selectedRoles.map(r => r.name);

        setDataTechnicals((prev) =>
          prev.map((tech) =>
            tech.id === selectedTechnical.id
              ? { ...tech, roles: updatedRoleNames }
              : tech
          )
        );

        setOpenDialog(false);
        alert('Technical roles updated successfully');
      }
    } catch (error) {
      console.error('Error updating technical role:', error.response?.data || error);
      alert('Failed to update technical role');
    }
  };

  // Function to open the dialog for updating technical roles
  const handleOpenDialog = (technical) => {
    setSelectedTechnical(technical);

    let currentRoles = [];

    if (Array.isArray(technical.roles)) {
      currentRoles = technical.roles.map((r) => {
        if (typeof r === 'string') return r.trim();
        if (typeof r === 'object' && r.name) return r.name.trim();
        return '';
      }).filter(Boolean);
    } else if (typeof technical.roles === 'string') {
      currentRoles = technical.roles.split(',').map((r) => r.trim());
    } else if (typeof technical.roles === 'object' && technical.roles !== null) {
      currentRoles = [technical.roles.name].filter(Boolean);
    } else {
      currentRoles = ['Technical'];
    }

    setRoles((prevRoles) =>
      prevRoles.map((role) => ({
        ...role,
        isSelected: role.name === 'Technical' ? true : currentRoles.includes(role.name),
      }))
    );

    setOpenDialog(true);
  };

  // Function to format data for DataGrid
  const rows = dataTechnicals.map((tech, index) => ({
    id: tech.id || index,
    email: tech.email,
    fullName: tech.fullName,
    nationalId: tech.nationalId,
    phoneNumber: tech.phoneNumber,
    roles: Array.isArray(tech.roles) ? tech.roles.join(', ') : tech.roles,
    serviceName: tech.serviceName,
    original: tech
  }));

  // Check if the user has the 'Admin' role
  const hasAdminRole = (roles) => {
    return roles.includes('Admin');
  };

  // Function to define columns for DataGrid
  const columns = [
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'fullName', headerName: 'Full Name', flex: 1 },
    { field: 'nationalId', headerName: 'National ID', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'roles', headerName: 'Role', flex: 1 },
    { field: 'serviceName', headerName: 'Service Name', flex: 1 },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      flex: 0.5,
      renderCell: (params) => {
        if (hasAdminRole(params.row.original.roles)) {
          return null; // Don't render Edit button if role includes 'Admin'
        }
        return (
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(params.row.original)}>
            Edit
          </Button>
        );
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      sortable: false,
      flex: 0.5,
      renderCell: (params) => {
        if (hasAdminRole(params.row.original.roles)) {
          return null; // Don't render Delete button if role includes 'Admin'
        }
        return (
          <Button variant="outlined" color="error" onClick={() => deleteTechnical(params.row.original.id)}>
            <DeleteIcon />
          </Button>
        );
      }
    }
  ];


  useEffect(() => {
    getDataTechnicals();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}align="center">
        Technicals List
      </Typography>


      {/* Pie Chart for user roles */}
      <div className="mb-6" style={{ height: '400px', width: '70%'  , marginBottom:'100px' , marginLeft:'auto' , marginRight:'auto'}}>
      <TechnicalPrefixChart />
      </div>

      {/* DataGrid for technicals list */}
      <Paper sx={{ width: '100%',  borderRadius: 3, boxShadow: 3 }}>
        <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} rowsPerPageOptions={[5, 10, 20]} disableSelectionOnClick />
      </Paper>

      {/* Dialog for updating technical roles */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Technical Roles</DialogTitle>
        <DialogContent>
          {roles.map((role) => (
            <FormControlLabel key={role.id}
              control={
                <Checkbox
                  checked={role.isSelected}
                  onChange={() => handleRoleChange(role.id)} />
              }
              label={role.name}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={updateRoleTechnical} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
