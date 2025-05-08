import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { jwtDecode } from "jwt-decode";
import { AdminContext } from '../../Context/AdminContext';
import { TechnicalContext } from '../../Context/TechnicalContext';
import Swal from 'sweetalert2';
import carlogin from '../../assets/carlogin.jpg';

export default function Login() {
  const { setUserLogin, setUserId } = useContext(UserContext);
  const { setAdminLogin } = useContext(AdminContext);
  const { setTechnicalLogin } = useContext(TechnicalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  async function sendToApi(formValues) {
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
      {/* Top navigation for Login/Register */}
      <div className="w-full flex justify-center py-4 bg-white shadow-md bg-gradient-to-tr from-teal-400 to-teal-600">
        <div className="space-x-10 text-lg font-medium ">
          <Link
            to="/login"
            className={`pb-2 ${currentPath === "/login" ? "border-b-2 border-[#0B4261] text-[#1a1b1b]" : "text-gray-600 hover:text-[#0B4261]"}`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`pb-2 ${currentPath === "/register" ? "border-b-2 border-[#0B4261] text-[#1a1b1b]" : "text-gray-600 hover:text-[#0B4261]"}`}
          >
            Register
          </Link>
        </div>
      </div>

      {/* Login Page Content */}
      <div className="flex min-h-screen bg-gradient-to-br from-[#d5d8da] to-[#0B4261] justify-center items-center">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden flex w-full max-w-5xl">
          {/* Left side image */}
          <div className="w-1/2 bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center p-8">
            <img
              src={carlogin}
              alt="Login Illustration"
              className="max-h-[90%] object-contain"
            />
          </div>

          {/* Right side form */}
          <div className="w-1/2 p-10">
            <h1 className="text-4xl font-bold text-[#0B4261] mb-1">Log in</h1>
            <p className="text-gray-600 text-lg mb-6">Nice to see you again</p>

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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0B4261] text-white text-lg rounded-lg hover:bg-blue-800 transition shadow-lg"
              >
                LOGIN
              </button>
            </form>

            <div className="flex justify-between text-sm text-gray-600 mt-4 flex-wrap">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Create account
                </Link>
              </p>
              <Link to="/forgetpassword" className="text-blue-600 hover:underline mt-2 sm:mt-0">
                Forget Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
