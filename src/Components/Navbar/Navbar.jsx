import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { CgProfile } from "react-icons/cg";
import { UserContext } from '../../Context/UserContext';
import { AdminContext } from '../../Context/AdminContext';
import { TechnicalContext } from '../../Context/TechnicalContext';
import { FaClipboardList } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
    const navigate = useNavigate();
    const { UserLogin, setUserLogin } = useContext(UserContext);
    const { AdminLogin, setAdminLogin } = useContext(AdminContext);
    const { TechnicalLogin, setTechnicalLogin } = useContext(TechnicalContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Function to handle logout
    function logOut() {
        localStorage.removeItem("UserToken");
        localStorage.removeItem("TechnicalToken");
        localStorage.removeItem("AdminToken");
        localStorage.removeItem("tecId");

        setUserLogin(null);
        setTechnicalLogin(null);
        setAdminLogin(null);

        navigate('/login', { replace: true });
    }


    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Render links based on role
    const renderLinks = () => {
        // Check if the user is logged in and render links accordingly
        if (UserLogin) {

            return (
                <>
                    <NavLink to="/home" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">Home</NavLink>
                    <hr className='text-white w-full p-0 m-0 md:hidden' />
                    <NavLink to="/services" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">Services</NavLink>
                    <hr className='text-white w-full p-0 m-0 md:hidden' />
                    <NavLink to="/about" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">About</NavLink>
                    <hr className='text-white w-full p-0 m-0 md:hidden' />
                    <NavLink to="/contactus" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">Contact Us</NavLink>
                    <hr className='text-white w-full p-0 m-0 md:hidden' />
                    <NavLink to="/cars" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">Cars</NavLink>
                    <hr className='text-white w-full p-0 m-0 md:hidden' />
                    <NavLink to="/requestsuser" className="text-2xl text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">
                        <FaClipboardList />
                    </NavLink>
                </>
            );
        }

        // Check if the technical logged in and render links accordingly
        else if (TechnicalLogin) {
            return (
                <>
                    <NavLink to="/requeststechnical" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">All Requests</NavLink>
                    <hr className='text-white w-full p-0 m-0 md:hidden' />
                    <NavLink to="/requestspending" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">Request Pending</NavLink>
                    <hr className='text-white w-full p-0 m-0 md:hidden' />
                    <NavLink to="/requestssorted" className="nav-link text-white hover:bg-amber-500 rounded px-2  border-b-2 border-transparent hover:border-white">Request Sorted</NavLink>
                </>
            );
        }
        return null;
    };

    // Function to handle profile click
    const handleProfileClick = () => {
        if (UserLogin) navigate('/profile');
        else if (TechnicalLogin) navigate('/profiletech');
        else if (AdminLogin) navigate('/profileadmin');
    };

    return (
        <div className="bg-[#0B4261] p-3 flex items-center justify-between rounded-lg relative">
            {/* Logo */}
            <div className="flex items-center">
                <img src={logo} className="w-[50px] h-[50px] mr-2" alt="Logo" />
                <h1 className="text-3xl text-white font-bold">CarCare</h1>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6 items-center">
                {renderLinks()}
            </div>

            {/* Right side - desktop actions */}
            <div className="hidden md:flex items-center space-x-6">
                {(UserLogin || AdminLogin || TechnicalLogin) ? (
                    <>
                        <span className="text-white cursor-pointer" onClick={logOut}>Logout</span>
                        <span className="text-2xl text-white cursor-pointer" onClick={handleProfileClick}>
                            <CgProfile />
                        </span>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="text-white">Login</NavLink>
                        <NavLink to="/register" className="text-white">Register</NavLink>
                    </>
                )}
            </div>

            {/* Mobile: Menu + Logout + Profile */}
            <div className="md:hidden flex items-center space-x-4">
                {(UserLogin || AdminLogin || TechnicalLogin) && (
                    <>
                        <span className="text-white text-sm cursor-pointer" onClick={logOut}>Logout</span>
                        <span className="text-xl text-white cursor-pointer" onClick={handleProfileClick}>
                            <CgProfile />
                        </span>
                    </>
                )}

                <button onClick={toggleMenu} className="text-white text-3xl">
                    {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                </button>
            </div>

            {/* Dropdown Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full right-0 w-[200px] rounded-md bg-[#0B4261] flex flex-col items-start p-4 space-y-3 md:hidden z-50">
                    {renderLinks()}
                    {(UserLogin || AdminLogin || TechnicalLogin) ? null : (
                        <>
                            <NavLink to="/login" className="text-white">Login</NavLink>
                            <NavLink to="/register" className="text-white">Register</NavLink>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
