import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { jwtDecode } from "jwt-decode";
import { AdminContext } from '../../Context/AdminContext';
import { TechnicalContext } from '../../Context/TechnicalContext';
import Swal from 'sweetalert2';


export default function Login() {
  // Context
  let { setUserLogin, setUserId } = useContext(UserContext);
  let { setAdminLogin } = useContext(AdminContext);
  let { setTechnicalLogin } = useContext(TechnicalContext);
  let navigate = useNavigate();

  // Function to send data to API
  async function sendToApi(formValues) {
    try {
      console.log("Sending data:", formValues);
      const { data } = await axios.post('https://carcareapp.runasp.net/api/account/login', formValues,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Login successful:', data);

      if (data.token) {
        try {
          const decodedToken = jwtDecode(data.token);
          console.log("Decoded Token:", decodedToken);

          // Extract role correctly
          const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          console.log("Extracted Role:", userRole);

          // Display success alert for login success
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
            console.log("user id is" + data.id);
            setUserId(data.id);
            navigate("/home");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue with the token.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } else {
        console.error("Token missing in response");
        Swal.fire({
          title: 'Error!',
          text: 'Login failed. No token received.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      Swal.fire({
        title: 'Login Failed!',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  // Validation schema
  let validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, 'Phone number is invalid')
      .required('Phone is required'),
    password: Yup.string().required('Password is required'),
  });

  // Formik hook
  let formik = useFormik({
    initialValues: {
      phoneNumber: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: sendToApi,
  });

  return (
    <div className="mt-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-0">
      <h1 className="text-5xl font-bold text-[#0B4261]">Log in</h1>
      <p className="text-lg font-semibold mt-2 text-gray-600">Nice to see you again</p>

      {/* Form for login */}
      <form onSubmit={formik.handleSubmit} className="w-full max-w-md mt-8">
        <div className="relative mt-6">
          <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="tel" name="phoneNumber" id="phoneNumber"
            value={formik.values.phoneNumber}
            className="w-full p-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg placeholder-gray-400 shadow-sm transition-all"
            placeholder="Phone Number"
          />
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.phoneNumber}</p>
          )}
        </div>

        <div className="relative mt-6">
          <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="password" name="password" id="password" value={formik.values.password}
            className="w-full p-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg placeholder-gray-400 shadow-sm transition-all"
            placeholder="Password"
          />
          {formik.errors.password && formik.touched.password && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-[#0B4261] text-white text-lg font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-800 transition-all"
        >
          LOGIN
        </button>
      </form>

      {/* Links for registration and forget password */}
      <div className="flex justify-between w-full max-w-md mt-4 text-sm text-gray-600 flex-wrap sm:flex-nowrap">
        <p className="w-full sm:w-auto text-center sm:text-left">
          Don't have an account?{' '}
          <Link to='/register' className="text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
        <Link to='/forgetpassword' className="text-blue-600 hover:underline sm:text-right w-full sm:w-auto text-center mt-2 sm:mt-0">
          Forget Password
        </Link>
      </div>

    </div>
  );
}
