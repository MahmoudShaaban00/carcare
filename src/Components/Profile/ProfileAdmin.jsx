import React, { useContext, useEffect, useState } from 'react'
import imguser from '../../assets/user.jpg';
import axios from 'axios';
import { GrCircleInformation } from 'react-icons/gr';
import { IoIosLogOut } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
export default function ProfileAdmin() {

    let {setAdminLogin} = useContext(AdminContext);
    // varaibles for store data
    const [adminData, setAdminData] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '' });

    //function to get current technical information
    const getCurrentTechnical = async () => {
        try {
            const token = localStorage.getItem("AdminToken");
            if (!token) return;

            const { data } = await axios.get("https://carcareapp.runasp.net/api/Account/GetCurrentUserByRole",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Admin Data:", data);
            setAdminData(data);
            setFormData({ fullName: data.fullName, email: data.email, phoneNumber: data.phoneNumber });

        } catch (error) {
            console.error("Error fetching Technical:", error);
        }
    };

    let navigate = useNavigate();
    //function logout data
    function logOut() {
        localStorage.removeItem("AdminToken");
        setAdminLogin(null);
        navigate('/login');
    }


    useEffect(() => {
        getCurrentTechnical();
    }, []);

    return (

        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold text-blue-800 mb-6">Admin Profile</h1>
            <p className="text-gray-600 text-lg mb-10 text-center md:px-56">Manage your account settings and personal details.</p>

            {/*show infromation of user */}
            {adminData ? (
                <div className="bg-white shadow-lg p-6 rounded-2xl place-items-center w-3/4 md:w-1/2 text-center">
                    <img src={imguser} alt="User" className="rounded-full mx-auto w-32 h-32 mb-4" />
                    <p className="font-bold text-xl text-gray-800">Username: {adminData.fullName}</p>
                    <p className="text-gray-700">Email: {adminData.email}</p>
                    <p className="text-gray-700">Phone: {adminData.phoneNumber}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {/*action Admin */}
            <div className="mt-8 bg-white shadow-lg p-6 rounded-2xl w-3/4 md:w-1/2">
                {/*action for legal information */}
                <div className="flex items-center gap-2 text-blue-800 mb-4">
                    <GrCircleInformation className="text-2xl" />
                    <Link to="/legalinformation" className="text-lg hover:underline">Legal Information</Link>
                </div>

                {/*action for logout */}
                <div className="flex items-center gap-2 text-blue-800">
                    <IoIosLogOut className="text-2xl" />
                    <span onClick={logOut} className="text-lg cursor-pointer">Logout</span>
                </div>
            </div>
        </div>

    )
}
