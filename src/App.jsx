import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Layout from './Components/Layout/Layout';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import RegisterUser from './Pages/Register/RegisterUser';
import RegisterTechnical from './Pages/Register/RegisterTechnical';
import Team from './Pages/DashBoard/team/Team';
import ForgetPassword from './Pages/ForgetPassword/ForgetPassword';
import Profile from './Pages/Profile/Profile'
import ChangePassword from './Pages/Profile/ChangePassword';
import LegalInformation from './Pages/Profile/LegalInformation';
import Confiromemail from './Pages/Confiromemail/Confiromemail';
import VerfiyCode from './Pages/ForgetPassword/VerfiyCode';
import ResetPassword from './Pages/ForgetPassword/ResetPassword';
import UserContextProvider from './Context/UserContext';
import Vehicle from './Pages/DashBoard/Vehicle/Vehicle'
import AdminContextProvider from './Context/AdminContext';
import TechnicalContextProvider from './Context/TechnicalContext';
import Technical from './Pages/DashBoard/Technicals/Technical';
import Cars from './Pages/Cars/Cars';
import Services from './Pages/Services/Services'
import FeedBack from './Pages/Profile/FeedBack'
import FeedBacks from './Pages/DashBoard/FeedBacks/FeedBacks';
import Map from './Pages/Map/Map';
import ServicesType from './Pages/DashBoard/ServicesType/ServicesType';
import { LocationProvider } from './Context/LocationContext';
import RequestsUser from './Pages/Requests/RequestsUser';
import RequestsTechnical from './Pages/Requests/RequestTechnical';
import Payment from './Pages/Payment/Payment'
import Control from './Pages/DashBoard/Control/Control'
import RequestsPending from './Pages/Requests/RequestsPending';
import RequestsSorted from './Pages/Requests/RequestsSorted';
import ProfileTech from './Pages/Profile/ProfileTech';
import ProfileAdmin from './Pages/Profile/ProfileAdmin';
import Requests from './Pages/DashBoard/Requests/Requests';
import { RequestsProvider } from './Context/RequestsTechContext';
import ContactUs from './Pages/ContactUs/ContactUs';
import About from './Pages/About/About';
import CreateContact from './Pages/DashBoard/Contact/CreateContact';
import { ContactProvider } from './Context/ContactContext';
import ContactUser from './Pages/Profile/ContactUser';
import ContactTechnical from './Pages/Profile/ContactTechnical';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProtectedRouteUser from './Components/ProtectedRoute/ProtectedRouteUser';
import ProtectedRouteAdmin from './Components/ProtectedRoute/ProtectedRouteAdmin';
import ProtectedRouteTechnical from './Components/ProtectedRoute/ProtectedRouteTechnical';
import { useEffect } from 'react';
import { ServicesProvider } from './Context/ServicesDashboard';

function App() {
  // Initialize AOS (Animate On Scroll) library
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  let x = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        { index: true, element: <Login /> }, // Set login as the default route
        { path: 'login', element: <Login /> },
        { path: 'forgetpassword', element: <ForgetPassword /> },
        { path: 'register', element: <Register /> },
        { path: 'registeruser', element: <RegisterUser /> },
        { path: 'registertechnical', element: <RegisterTechnical /> },
        { path: 'resetpassword', element: <ResetPassword /> },
        { path: 'legalinformation', element: <LegalInformation /> },
        { path: 'confiromemail', element: <Confiromemail /> },
        { path: 'verfiycode', element: <VerfiyCode /> },
        { path: "map", element: <Map /> },

        { path: 'changepassword', element:< ProtectedRouteUser><ChangePassword /></ProtectedRouteUser>  },
        { path: 'home', element: <ProtectedRouteUser><Home /></ProtectedRouteUser> },
        { path: 'profile', element: <ProtectedRouteUser><Profile /></ProtectedRouteUser> },
        { path: 'services', element: <ProtectedRouteUser><Services /></ProtectedRouteUser> },
        { path: 'feedback', element: <ProtectedRouteUser><FeedBack /></ProtectedRouteUser> },
        { path: 'contactus', element: <ProtectedRouteUser><ContactUs /></ProtectedRouteUser> },
        { path: 'about', element: <ProtectedRouteUser><About /></ProtectedRouteUser> },
        { path: 'requestsuser', element: <ProtectedRouteUser><RequestsUser /></ProtectedRouteUser> },
        { path: 'contactuser', element: <ProtectedRouteUser><ContactUser /></ProtectedRouteUser> },
        { path: 'cars', element: <ProtectedRouteUser><Cars /></ProtectedRouteUser> },
        { path: 'payment', element: <ProtectedRouteUser><Payment /></ProtectedRouteUser> },

        { path: 'team', element: <ProtectedRouteAdmin><Team /></ProtectedRouteAdmin> },
        { path: 'vehicle', element: <ProtectedRouteAdmin><Vehicle /></ProtectedRouteAdmin> },
        { path: 'technical', element: <ProtectedRouteAdmin><Technical /></ProtectedRouteAdmin> },
        { path: 'servicestype', element: <ProtectedRouteAdmin><ServicesType /></ProtectedRouteAdmin> },
        { path: 'feedbacks', element: <ProtectedRouteAdmin><FeedBacks /></ProtectedRouteAdmin> },
        { path: 'profileadmin', element: <ProtectedRouteAdmin><ProfileAdmin /></ProtectedRouteAdmin> },
        { path: 'requests', element: <ProtectedRouteAdmin><Requests /></ProtectedRouteAdmin> },
        { path: 'createcontact', element: <ProtectedRouteAdmin><CreateContact /></ProtectedRouteAdmin> },
        { path: 'control', element: <ProtectedRouteAdmin><Control /></ProtectedRouteAdmin> },

        { path: "requeststechnical", element: <ProtectedRouteTechnical><RequestsTechnical /></ProtectedRouteTechnical> },
        { path: "requestspending", element: <ProtectedRouteTechnical><RequestsPending /></ProtectedRouteTechnical> },
        { path: "requestssorted", element: <ProtectedRouteTechnical><RequestsSorted /></ProtectedRouteTechnical> },
        { path: "profiletech", element: <ProtectedRouteTechnical><ProfileTech /></ProtectedRouteTechnical> },
        { path: "contacttechnical", element: <ProtectedRouteTechnical><ContactTechnical /></ProtectedRouteTechnical> },
      ]
    },
  ]);

  return (
    <>
      <LocationProvider>
        <UserContextProvider>
          <TechnicalContextProvider>
            <AdminContextProvider>
              <RequestsProvider>
                <ContactProvider>
                  <ServicesProvider>
                  <RouterProvider router={x}></RouterProvider>
                  </ServicesProvider>
                </ContactProvider>
              </RequestsProvider>
            </AdminContextProvider>
          </TechnicalContextProvider>
        </UserContextProvider>
      </LocationProvider>
    </>
  );
}

export default App;