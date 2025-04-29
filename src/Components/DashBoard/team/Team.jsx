import React, { useEffect, useState } from 'react';
import { Box, Typography,useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Checkbox, FormControlLabel,} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhonePrefixChart from './PhonePrefixChart'; // Import the PhonePrefixChart component

export default function Team() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [roles, setRoles] = useState([
    { id: 1, name: 'User', isSelected: true },
    { id: 2, name: 'Technical', isSelected: false },
  ]);

  const [users, setUsers] = useState([]);

  // Function to fetch user data
  async function getDataUser() {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) {
        alert('Authentication error: Please log in again.');
        return;
      }

      let { data } = await axios.get('https://carcareapp.runasp.net/api/DashBoard/GetUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (data) {
        console.log('Fetched User Data:', data);
        setUsers(data);

        const formattedRows = data.map((user) => ({
          id: user.id,
          name: user.fullName,
          email: user.email,
          phone: user.phoneNumber,
          role: user.roles,
        }));

        setRows(formattedRows);

        const formattedColumns = [
          { field: 'name', headerName: 'Full Name', flex: 1 },
          { field: 'email', headerName: 'Email', flex: 1 },
          { field: 'phone', headerName: 'Phone Number', flex: 1 },
          { field: 'role', headerName: 'Role', flex: 1 },
          {
            field: 'edit',
            headerName: 'Edit',
            flex: 1,
            renderCell: ({ row }) => (
              <Button variant="outlined" onClick={() => handleOpenDialog('update', row)}>
                Edit
              </Button>
            ),
          },
          {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: ({ row }) => (
              <Button variant="outlined" color="error" onClick={() => handleOpenDialog('delete', row)}>
                Delete
              </Button>
            ),
          },
        ];
        setColumns(formattedColumns);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

// Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) {
        alert('Authentication error: Please log in again.');
        return;
      }

      const apiUrl = `https://carcareapp.runasp.net/api/DashBoard/DeleteUser/${userId}`;

      const response = await axios.delete(apiUrl, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== userId));
        setOpenDialog(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Unauthorized: Please log in again.');
        localStorage.removeItem('AdminToken');
        navigate('/login');
      }
    }
  };

  // Function to handle user role update
  const updateUserRole = async () => {
    if (!selectedRow) {
      console.error('No user selected for role update');
      return;
    }

    try {
      const token = localStorage.getItem('AdminToken');
      if (!token) {
        alert('Authentication error: Please log in again.');
        return;
      }

      const selectedRoles = [
        { id: '1', name: 'User', isSelected: true }, // Always selected
        {
          id: '2',
          name: 'Technical',
          isSelected: roles.find((r) => r.name === 'Technical')?.isSelected,
        },
      ];

      console.log('Sending data to API:', { roles: selectedRoles });

      const apiUrl = `https://carcareapp.runasp.net/api/DashBoard/UpdateUser/${selectedRow.id}`;

      const response = await axios.put( apiUrl,{ roles: selectedRoles },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        const updatedRoleNames = selectedRoles
          .filter((r) => r.isSelected)
          .map((r) => r.name)
          .join(', ');

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedRow.id ? { ...row, role: updatedRoleNames } : row
          )
        );
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized: Please log in again.');
        localStorage.removeItem('AdminToken');
        navigate('/login');
      }
    }
  };

  // Function to handle role checkbox change
  const handleRoleChange = (roleId) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, isSelected: !role.isSelected } : role
      )
    );
  };

  // Function to open dialog for editing or deleting a user
  const handleOpenDialog = (type, row) => {
    setDialogType(type);
    setSelectedRow(row);
  
    // Ensure row.role is an array before using map
    let currentRoles = [];
  
    if (Array.isArray(row.role)) {
      currentRoles = row.role.map((r) => r.trim());
    } else if (typeof row.role === 'string') {
      currentRoles = row.role.split(',').map((r) => r.trim());
    } else if (typeof row.role === 'object' && row.role !== null) {
      currentRoles = [row.role.name].filter(Boolean); // if it's a single role object
    }
  
    setRoles((prevRoles) =>
      prevRoles.map((role) => ({
        ...role,
        isSelected: role.name === 'User' ? true : currentRoles.includes(role.name),
      }))
    );
  
    console.log('Selected Row:', row);
    console.log('Dialog Type:', type);
    console.log('Roles:', roles);
    console.log('Current Roles:', currentRoles);
    setOpenDialog(true);
  };
  


  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <Box sx={{ marginTop: 1, padding: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Users Management
      </Typography>

       {/* Pie Chart for user phones */}
       <Box sx={{ height: 300, marginBottom: 30}}>
        <PhonePrefixChart />
      </Box>

      {/* DataGrid for displaying user data */}
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ width: '100%', backgroundColor: 'white', borderRadius: 2, boxShadow: 2,}}>
            <DataGrid rows={rows} columns={columns} pageSize={5}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
              }
              sx={{
                '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f0f0f0' },
                '& .even-row': {
                  backgroundColor: '#f9f9f9',
                },
                '& .odd-row': {
                  backgroundColor: '#ffffff',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Dialog for Edit/Delete */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {dialogType === 'delete' ? 'Confirm Deletion' : 'Update Roles'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Typography>
              Are you sure you want to delete <strong>{selectedRow?.name}</strong>?
            </Typography>
          ) : (
            roles.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={role.isSelected}
                    onChange={() => handleRoleChange(role.id)}
                    disabled={role.name === 'User'} // Lock User checkbox
                  />
                }
                label={role.name}
              />
            ))
          )}
        </DialogContent>
        <DialogActions>
          {dialogType === 'delete' ? (
            <Button onClick={() => handleDeleteUser(selectedRow.id)} color="error" variant="contained">
              Delete
            </Button>
          ) : (
            <Button onClick={() => updateUserRole()} variant="contained">
              Update
            </Button>
          )}
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
