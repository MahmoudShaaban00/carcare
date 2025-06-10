import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Grid, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Checkbox, FormControlLabel, useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import TechnicalPrefixChart from './TechnicalPrefixChart';
import TechnicalCountCard from './TechnicalCountCard';
import axiosInstance from '../../../api'; 


export default function Technical() {
  const theme = useTheme();
  const [dataTechnicals, setDataTechnicals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedTechnical, setSelectedTechnical] = useState(null);
  const [technicalCount, setTechnicalCount] = useState(0);

  const [roles, setRoles] = useState([
    { id: 1, name: 'Technical', isSelected: true },
    { id: 2, name: 'User', isSelected: false }
  ]);

  // Fetch technical data
  const getDataTechnicals = async () => {
    try {
      const { data } = await axiosInstance.get('https://carcareapp.runasp.net/api/DashBoard/GetTechnicals');
      if (Array.isArray(data)) setDataTechnicals(data);
      setTechnicalCount(data.length);
      console.log('Fetched Technicals:', data);
    } catch (error) {
      console.error("Error fetching technicals", error);
      alert('Error fetching technicals');
    }
  };

  // Handle role checkbox change
  const handleRoleChange = (roleId) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === roleId ? { ...role, isSelected: !role.isSelected } : role
      )
    );
  };

  // Delete technical
  const deleteTechnical = async (id) => {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) return alert('Authentication error: Please log in again.');

      const url = `https://carcareapp.runasp.net/api/DashBoard/DeleteTechnical/${id}`;
      const response = await axiosInstance.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setDataTechnicals(prev => prev.filter(tech => tech.id !== id));
        setOpenDialog(false);
        alert('Technical deleted successfully');
      }
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error);
      alert('Error deleting technical');
    }
  };

  // Update technical role
  const updateRoleTechnical = async () => {
    if (!selectedTechnical) return;

    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) return alert('Authentication error: Please log in again.');

      const selectedRoles = roles
        .filter(r => r.isSelected)
        .map(r => ({ id: r.id, name: r.name }));

      const url = `https://carcareapp.runasp.net/api/DashBoard/UpdateTechnical/${selectedTechnical.id}`;
      const response = await axiosInstance.put(url, { roles: selectedRoles }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const updatedRoleNames = selectedRoles.map(r => r.name);
        setDataTechnicals(prev =>
          prev.map(tech =>
            tech.id === selectedTechnical.id ? { ...tech, roles: updatedRoleNames } : tech
          )
        );
        setOpenDialog(false);
        alert('Technical roles updated successfully');
      }
    } catch (error) {
      console.error('Role update failed:', error.response?.data || error);
      alert('Failed to update technical role');
    }
  };

  // Handle dialog open for either edit or delete
  const handleOpenDialog = (type, tech) => {
    setDialogType(type);
    setSelectedTechnical(tech);

    // Normalize roles
    let currentRoles = [];

    if (Array.isArray(tech.roles)) {
      currentRoles = tech.roles.map(r => typeof r === 'string' ? r.trim() : r.name?.trim());
    } else if (typeof tech.roles === 'string') {
      currentRoles = tech.roles.split(',').map(r => r.trim());
    } else if (typeof tech.roles === 'object' && tech.roles !== null) {
      currentRoles = [tech.roles.name].filter(Boolean);
    }

    setRoles(prev =>
      prev.map(role => ({
        ...role,
        isSelected: role.name === 'Technical' ? true : currentRoles.includes(role.name),
      }))
    );

    setOpenDialog(true);
  };

  // Check if user is Admin
  const hasAdminRole = (roles) => {
    if (Array.isArray(roles)) return roles.includes('Admin');
    if (typeof roles === 'string') return roles.includes('Admin');
    return false;
  };

  // Format rows for DataGrid
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

  // DataGrid columns
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
      renderCell: ({ row }) =>
        hasAdminRole(row.original.roles) ? null : (
          <Button variant="contained" onClick={() => handleOpenDialog('update', row.original)}>
            Edit
          </Button>
        ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      sortable: false,
      flex: 0.5,
      renderCell: ({ row }) =>
        hasAdminRole(row.original.roles) ? null : (
          <Button variant="outlined" color="error" onClick={() => handleOpenDialog('delete', row.original)}>
            <DeleteIcon />
          </Button>
        ),
    },
  ];

  useEffect(() => {
    getDataTechnicals();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }} align="center">
        Technicals List
      </Typography>

      <Grid container spacing={3} alignContent={'center'} justifyContent="center" marginBottom={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TechnicalCountCard  /> {/* Pass totalUsers as prop */}
        </Grid>
      </Grid>

      {/* Chart */}
      <div className="sm:mb-32 mb-56 m-auto" style={{ height: '400px', width: '70%' }}>
        <TechnicalPrefixChart />
      </div>

      {/* DataGrid */}
      <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </Paper>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {dialogType === 'update' ? 'Update Technical Roles' : 'Confirm Deletion'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'update' ? (
            roles.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={role.isSelected}
                    onChange={() => handleRoleChange(role.id)}
                  />
                }
                label={role.name}
              />
            ))
          ) : (
            <Typography>Are you sure you want to delete this technical?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={dialogType === 'update'
              ? updateRoleTechnical
              : () => deleteTechnical(selectedTechnical?.id)}
            variant="contained"
            color={dialogType === 'update' ? 'primary' : 'error'}
          >
            {dialogType === 'update' ? 'Update' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
