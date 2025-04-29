import React from 'react';
import { Grid, Button, Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import feedback from '../../../assets/dashboard/feedback.jpg';
import services from '../../../assets/dashboard/services.jpg';
import technical from '../../../assets/dashboard/technicals.jpg';
import vehicles from '../../../assets/dashboard/vhicle.jpg';
import users from '../../../assets/dashboard/users.jpg';
import requests from '../../../assets/dashboard/requests.jpg';
import contact from '../../../assets/dashboard/contact.jpg';
import RequestsPieChart from '../Requests/RequestsPieChar';
import PhonePrefixChart from '../team/PhonePrefixChart';
import TechnicalPrefixChart from '../Technicals/TechnicalPrefixChart';
import CreateContact from '../Contact/CreateContact';



const Control = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', margin: 3 }}>
      {/* Title above the Grid */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3, marginTop: 3 }}>
        Control of Dashboard
      </Typography>

      {/* Final box with increased margin-bottom on large screens */}
      <Box sx={{ display: 'flex', gap: 3, margin: 5, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>

        <Box sx={{ width: { xs: '100%', sm: 380, md: 380 }, height: 350, mb: { xs: '100px', sm: '100px', md: '50px' }}}>
          <RequestsPieChart />
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 380, md: 380 }, height: 350,mb: { xs: '100px', sm: '100px', md: '50px' }}}>
          <PhonePrefixChart />
        </Box>

        {/* Final box with special margin-top for 927px - 1110px */}
        <Box sx={{ width: { xs: '100%', sm: 380, md: 380 }, height: 350, mb: { xs: '100px', sm: '100px', md: '50px' }, mt: { xs: 0, sm: 0, md: 0 }, // Default no margin-top
          '@media (min-width:927px) and (max-width:1110px)': {
            mt: '50px' }
        }}>
          <TechnicalPrefixChart />
        </Box>
      </Box>


      <Grid container justifyContent="center" alignItems="center" marginTop={3} spacing={3}>
        {/* First row: Vehicles, Technicals, and Services */}
        {/*Users*/}
        <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 3, borderRadius: 2 }}>
            <img src={users} alt="Users" style={{ width: '400px', height: '250px', marginBottom: '10px', borderRadius: '8px' }} />
            <Button variant="contained" onClick={() => navigate("/team")} sx={{
              width: { xs: '100%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
              height: { xs: '40px', sm: '45px', md: '50px', lg: '55px', xl: '60px' },
              borderRadius: '8px', marginBottom: '10px'
            }}>
              Users
            </Button>
          </Paper>
        </Grid>

        {/*Technicals*/}
        <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 3, borderRadius: 2 }}>
            <img src={technical} alt="Technicals" style={{ width: '400px', height: '250px', marginBottom: '10px', borderRadius: '8px' }} />
            <Button variant="contained" onClick={() => navigate("/technical")} sx={{
              width: { xs: '100%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
              height: { xs: '40px', sm: '45px', md: '50px', lg: '55px', xl: '60px' },
              borderRadius: '8px', marginBottom: '10px'
            }}>
              Technicals
            </Button>
          </Paper>
        </Grid>

        {/* Services */}
        <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 3, borderRadius: 2 }}>
            <img src={services} alt="Services Type" style={{ width: '400px', height: '250px', marginBottom: '10px', borderRadius: '8px' }} />
            <Button variant="contained" onClick={() => navigate("/servicestype")} sx={{
              width: { xs: '100%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
              height: { xs: '40px', sm: '45px', md: '50px', lg: '55px', xl: '60px' },
              borderRadius: '8px', marginBottom: '10px'
            }}>
              Services Type
            </Button>
          </Paper>
        </Grid>

        {/* Second row: Users and Feedbacks */}
        <Grid container justifyContent="center" alignItems="center" marginTop={3} spacing={3}>
          {/* First row: Vehicles, Technicals, and Services */}
          {/*Vehicles*/}
          <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 3, borderRadius: 2 }}>
              <img src={vehicles} alt="Vehicles" style={{ width: '400px', height: '250px', marginBottom: '10px', borderRadius: '8px' }} />
              <Button variant="contained" onClick={() => navigate("/vehicle")} sx={{
                width: { xs: '100%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
                height: { xs: '40px', sm: '45px', md: '50px', lg: '55px', xl: '60px' },
                borderRadius: '8px', marginBottom: '10px'
              }}>
                Vehicles
              </Button>
            </Paper>
          </Grid>

          {/*Feedbacks*/}
          <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 3, borderRadius: 2 }}>
              <img src={feedback} alt="Feedbacks" style={{ width: '400px', height: '250px', marginBottom: '10px', borderRadius: '8px' }} />
              <Button variant="contained" onClick={() => navigate("/feedbacks")} sx={{
                width: { xs: '100%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
                height: { xs: '40px', sm: '45px', md: '50px', lg: '55px', xl: '60px' },
                borderRadius: '8px', marginBottom: '10px'
              }}>
                FeedBack
              </Button>
            </Paper>
          </Grid>

          {/*Requests*/}
          <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 3, borderRadius: 2 }}>
              <img src={requests} alt="Feedbacks" style={{ width: '400px', height: '250px', marginBottom: '10px', borderRadius: '8px' }} />
              <Button variant="contained" onClick={() => navigate("/requests")} sx={{
                width: { xs: '100%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
                height: { xs: '40px', sm: '45px', md: '50px', lg: '55px', xl: '60px' },
                borderRadius: '8px', marginBottom: '10px'
              }}>
                Requests
              </Button>
            </Paper>
          </Grid>

        </Grid>

        {/* Contact Form for Sending Messages */}
        <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 3, borderRadius: 2 }}>
            <img src={contact} alt="Feedbacks" style={{ width: '400px', height: '250px', marginBottom: '10px', borderRadius: '8px' }} />
            <Button variant="contained" onClick={() => navigate("/createcontact")} sx={{
              width: { xs: '100%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
              height: { xs: '40px', sm: '45px', md: '50px', lg: '55px', xl: '60px' },
              borderRadius: '8px', marginBottom: '10px'
            }}>
              Contact
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Control;
