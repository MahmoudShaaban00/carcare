import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout() {
  const location = useLocation();

  const noFooterRoutes = [
    "/",
    "/login",
    "/register",
    "/registeruser",
    "/registertechnical",
    "/team",
    "/vehicle",
    "/technical",
    "/feedbacks",
    "/forgetpassword",
    "/changepassword",
    "/confiromemail",
    "/verfiycode",
    "/resetpassword",
    "/control",
    "/createcontact"
  ];

  const shouldShowFooter = !noFooterRoutes.includes(location.pathname);

  
  return (
    <>
      <Navbar />
      <Outlet />
      {shouldShowFooter && <Footer />}
    </>
  );
}
