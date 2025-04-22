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
import {RequestsProvider} from './Context/RequestsTechContext';
import ContactUs from './Components/ContactUs/ContactUs';
import About from './Components/About/About';
import CreateContact from './Components/DashBoard/Contact/CreateContact';
import { ContactProvider } from './Context/ContactContext';
import AOS from 'aos';
import 'aos/dist/aos.css';


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
        { path: 'home', element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'forgetpassword', element: <ForgetPassword /> },
        { path: 'register', element: <Register /> },
        { path: 'registeruser', element: <RegisterUser /> },
        { path: 'registertechnical', element: <RegisterTechnical /> },
        { path: 'team', element: <Team /> },
        { path: 'profile', element: <Profile /> },
        { path: 'changepassword', element: <ChangePassword /> },
        { path: 'legalinformation', element: <LegalInformation /> },
        { path: 'confiromemail', element: <Confiromemail /> },
        { path: 'verfiycode', element: <VerfiyCode /> },
        { path: 'resetpassword', element: <ResetPassword /> },
        { path:  'vehicle' , element: <Vehicle/>},
        { path:  'technical' , element: <Technical/>},
        { path: 'cars' , element:<Cars/>},
        { path: 'services' , element:<Services/>},
        { path: 'servicestype' , element:<ServicesType/>},
        { path: "feedback" , element:<FeedBack/>},
        { path: "feedbacks" , element:<FeedBacks/>},
        { path: "map" , element:<Map/>},
        { path: "requestsuser" , element:<RequestsUser/>},
        { path: "requeststechnical" , element:<RequestsTechnical/>},
        { path: "requestspending" , element:<RequestsPending/>},
        { path: "requestssorted" , element:<RequestsSorted/>},
        { path: "profiletech" , element:<ProfileTech/>},
        { path: "profileadmin" , element:<ProfileAdmin/>},
        { path: "payment" , element:<Payment/>},
        { path: "control" , element:<Control/>},
        { path: "requests" , element:<Requests/>},
        {path: "contactus" , element:<ContactUs/>},
        {path: "about" , element:<About/>},
        {path: "createcontact" , element:<CreateContact/>},

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