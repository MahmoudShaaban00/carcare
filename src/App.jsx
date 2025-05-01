import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Components/Home/Home';
import Layout from './Components/Layout/Layout';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import RegisterUser from './Components/Register/RegisterUser';
import RegisterTechnical from './Components/Register/RegisterTechnical';
import Team from './Components/DashBoard/team/Team';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import Profile from './Components/Profile/Profile'
import ChangePassword from './Components/Profile/ChangePassword';
import LegalInformation from './Components/Profile/LegalInformation';
import Confiromemail from './Components/Confiromemail/Confiromemail';
import VerfiyCode from './Components/ForgetPassword/VerfiyCode';
import ResetPassword from './Components/ForgetPassword/ResetPassword';
import UserContextProvider from './Context/UserContext';
import Vehicle from './Components/DashBoard/Vehicle/Vehicle'
import AdminContextProvider from './Context/AdminContext';
import TechnicalContextProvider from './Context/TechnicalContext';
import Technical from './Components/DashBoard/Technicals/Technical';
import Cars from './Components/Cars/Cars';
import Services from './Components/Services/Services'
import FeedBack from './Components/Profile/FeedBack'
import FeedBacks from './Components/DashBoard/FeedBacks/FeedBacks';
import Map from './Components/Map/Map';
import ServicesType from './Components/DashBoard/ServicesType/ServicesType';
import { LocationProvider } from './Context/LocationContext';
import RequestsUser from './Components/Requests/RequestsUser';
import RequestsTechnical from './Components/Requests/RequestTechnical';
import Payment from './Components/Payment/Payment'
import Control from './Components/DashBoard/Control/Control'
import RequestsPending from './Components/Requests/RequestsPending';
import RequestsSorted from './Components/Requests/RequestsSorted';
import ProfileTech from './Components/Profile/ProfileTech';
import ProfileAdmin from './Components/Profile/ProfileAdmin';
import Requests from './Components/DashBoard/Requests/Requests';
import { RequestsProvider } from './Context/RequestsTechContext';
import ContactUs from './Components/ContactUs/ContactUs';
import About from './Components/About/About';
import CreateContact from './Components/DashBoard/Contact/CreateContact';
import { ContactProvider } from './Context/ContactContext';
import ContactUser from './Components/Profile/ContactUser';
import ContactTechnical from './Components/Profile/ContactTechnical';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProtectedRouteUser from './Components/ProtectedRoute/ProtectedRouteUser';
import ProtectedRouteAdmin from './Components/ProtectedRoute/ProtectedRouteAdmin';
import ProtectedRouteTechnical from './Components/ProtectedRoute/ProtectedRouteTechnical';
import { useEffect } from 'react';

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
                  <RouterProvider router={x}></RouterProvider>
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