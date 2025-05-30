import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout() {
  const location = useLocation();

  const noNavbarRoutes = [
    "/",
    "/login",
    "/register",
    "/registeruser",
    "/registertechnical",
    "/forgetpassword",
    "/resetpassword",
    "/legalinformation",
    "/confiromemail",
    "/verfiycode",
    "/map",
  ];

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

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !noFooterRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
      {shouldShowFooter && <Footer />}
    </>
  );
}
