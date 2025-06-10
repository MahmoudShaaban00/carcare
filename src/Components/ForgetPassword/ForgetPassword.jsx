import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api'; 

export default function ForgetPassword() {
  const navigate = useNavigate();

  async function handleSubmit(formValues) {
    try {
      const response = await axios.post('https://carcareapp.runasp.net/api/account/SendCodeByEmail', {
        email: formValues.email
      });
      console.log('Response:', response.data);
      navigate('/verfiycode');
      alert('Password reset link sent successfully!');
    } catch (error) {
      console.error('Error sending reset request:', error.response?.data || error.message);
      alert('Failed to send reset request. Please try again.');
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d5d8da] to-[#0B4261] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl px-10 py-12 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-[#0B4261] text-center mb-4">Forget Password</h1>
        <p className="text-gray-700 text-center mb-8">Enter your email to reset your password</p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4261] placeholder-gray-500"
              placeholder="Email Address"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-600 mt-2">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B4261] text-white py-3 rounded-full text-lg hover:bg-blue-900 transition shadow-lg"
          >
            SEND RESET LINK
          </button>
        </form>
      </div>
    </div>
  );
}
