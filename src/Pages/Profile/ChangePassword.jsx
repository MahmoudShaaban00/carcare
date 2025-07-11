import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api'; 


export default function ChangePassword() {

  let navigate = useNavigate()

  // Function to handle form submission
  const handleChangePassword = async (formValues) => {
    try {
      const token = localStorage.getItem("UserToken");
      if (!token) {
        console.log("No token found, user needs to log in.");
        return;
      }

      const { data } = await axiosInstance.post("https://carcareapp.runasp.net/api/Account/Change-Password", formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched User Data:", data);
      navigate('/login')

    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        console.log("Unauthorized! Redirect to login or refresh token.");
      }
    }
  };


  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string()
      .required('New password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleChangePassword,
  });

  return (
    <div className='mt-2 '>
      <div className='mt-10 place-items-center'>
        <h1 className='lg:text-5xl text-3xl text-blue-950'>Change Password</h1>
        <p className='text-lg font-semibold mt-2 text-blue-950'>Secure your account</p>
      </div>
      
      {/* Form for changing password */}
      <form onSubmit={formik.handleSubmit} className='place-items-center'>
        {/* Old Password */}
        <div className='mt-10'>
          <input onBlur={formik.handleBlur} onChange={formik.handleChange} type='password' name='currentPassword' id='currentPassword' value={formik.values.currentPassword}
            className='border-2 sm:w-[500px] w-[300px] p-3 rounded-full placeholder-black text-left' placeholder='Current Password'/>
          {formik.errors.currentPassword && formik.touched.currentPassword && (
            <div
              className='flex items-center mx-auto sm:w-[500px] w-[300px] p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
              role='alert'
            >
              {formik.errors.currentPassword}
            </div>
          )}
        </div>

        {/* New Password */}
        <div className='mt-4'>
          <input onBlur={formik.handleBlur} onChange={formik.handleChange} type='password' name='newPassword' id='newPassword' value={formik.values.newPassword}
            className='border-2 sm:w-[500px] w-[300px] p-3 rounded-full placeholder-black text-left' placeholder='New Password' />
          {formik.errors.newPassword && formik.touched.newPassword && (
            <div
              className='flex items-center mx-auto sm:w-[500px] w-[300px] p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
              role='alert'
            >
              {formik.errors.newPassword}
            </div>
          )}
        </div>

        <div>
          <button type='submit' className='md:text-lg text-sm mt-10 bg-blue-800 text-white sm:w-[500px] w-[300px] p-3 rounded-full cursor-pointer hover:bg-slate-400 hover:text-white'>
            Change Password
          </button>
        </div>
      </form>


    </div>
  );
}
