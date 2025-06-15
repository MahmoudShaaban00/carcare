import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/FooterUser";
import FooterTech from "../Footer/FooterTech";

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
    "/seservicestype",
    "/createcontact",
    "/requests",
    "/profileadmin",
    "/map"
  ];

  const footerTechRoutes = [
    "/requeststechnical",
    "/requestspending",
    "/requestssorted",
    "/profiletech",
    "/contacttechnical",
    "/map"
  ];

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !noFooterRoutes.includes(location.pathname);
  const shouldShowFooterTech = footerTechRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}

      {/* Main content grows to fill vertical space */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer will stay at bottom even when content is empty */}
      {shouldShowFooter && !shouldShowFooterTech && <Footer />}
      {shouldShowFooterTech && <FooterTech />}
    </div>
  );
}
