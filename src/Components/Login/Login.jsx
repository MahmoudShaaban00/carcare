import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { jwtDecode } from "jwt-decode";
import { AdminContext } from '../../Context/AdminContext';
import { TechnicalContext } from '../../Context/TechnicalContext';
import Swal from 'sweetalert2';
import logo from '../../assets/logo.png'; // Make sure to have your logo file here


export default function Login() {
  const { setUserLogin, setUserId } = useContext(UserContext);
  const { setAdminLogin } = useContext(AdminContext);
  const { setTechnicalLogin } = useContext(TechnicalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoading, setIsLoading] = useState(false);


  async function sendToApi(formValues) {
    setIsLoading(true);
    try {
      const { data } = await axios.post('https://carcareapp.runasp.net/api/account/login', formValues, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (data.token) {
        const decodedToken = jwtDecode(data.token);
        const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        Swal.fire({
          title: 'Login Successful!',
          text: 'Welcome back!',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Store the token in localStorage based on user role
        if (userRole === "Admin") {
          localStorage.setItem("AdminToken", data.token);
          setAdminLogin(data.token);
          navigate("/control");
        } else if (userRole === "Technical") {
          localStorage.setItem("TechnicalToken", data.token);
          setTechnicalLogin(data.token);
          localStorage.setItem('tecId', data.id);
          navigate("/requeststechnical");
        } else {
          localStorage.setItem("UserToken", data.token);
          setUserLogin(data.token);
          localStorage.setItem("UserId", data.id);
          setUserId(data.id);
          navigate("/home");
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Login failed. No token received.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Login Failed!',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Login error:', error);
      setIsLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, 'Phone number is invalid')
      .required('Phone is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      password: '',
    },
    validationSchema,
    onSubmit: sendToApi,
  });

  return (
    <>
      {/* Top navigation with logo */}
      <div className="w-full flex justify-between items-center py-2 px-6 bg-[#0B4261]">
        <div className="flex items-center">
          <img src={logo} className="lg:w-[50px] w-[40px] lg:h-[50px] h-[40px] mr-2" alt="Logo" />
          <h1 className="lg:text-3xl text-2xl text-white font-bold">CarCare</h1>
        </div>
        <div className="space-x-10 text-lg font-medium">
          <Link
            to="/login"
            className={`pb-2 ${currentPath === "/login" ? "border-b-2 border-[#0B4261] text-[#1a1b1b]" : "text-gray-100 hover:text-[#0B4261]"}`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`pb-2 ${currentPath === "/register" ? "border-b-2 border-[#0B4261] text-[#1a1b1b]" : "text-gray-100 hover:text-[#0B4261]"}`}
          >
            Register
          </Link>
        </div>
      </div>

      {/* Login Page Content */}
      <div className="min-h-screen bg-gradient-to-br from-[#d5d8da] to-[#0B4261] flex justify-center items-center p-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B4261] mb-2">Log in</h1>
          <p className="text-gray-600 text-base md:text-lg mb-6">Nice to see you again</p>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={formik.values.phoneNumber}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                placeholder="Password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.password}</p>
              )}
            </div>

     <button
  type="submit"
  className="w-full py-3 bg-[#0B4261] text-white text-base rounded-lg hover:bg-blue-800 transition shadow-lg flex justify-center items-center"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      PROCESSING...
    </>
  ) : (
    "LOGIN"
  )}
</button>
          </form>

          <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 mt-4 gap-2">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </p>
            <Link to="/forgetpassword" className="text-blue-600 hover:underline">
              Forget Password
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
