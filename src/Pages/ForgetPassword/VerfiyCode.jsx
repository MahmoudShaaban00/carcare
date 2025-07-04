import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function VerfiyCode() {
  const navigate = useNavigate();

  async function sendToApi(formValues) {
    try {
      console.log("Sending data:", formValues);
      const { data } = await axios.post(
        'https://carcareapp.runasp.net/api/account/VerfiyCodeEmail',
        formValues,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Reset successful:', data);
      navigate('/resetpassword');
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data);
        alert(`Reset failed: ${error.response.data.message || 'Check input values'}`);
      } else {
        console.error('Unexpected Error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    resetCode: Yup.number().typeError('Reset code must be a number').required('Reset code is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      resetCode: '',
    },
    validationSchema,
    onSubmit: sendToApi,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d5d8da] to-[#0B4261] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl px-10 py-12 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-[#0B4261] text-center mb-4">Reset Password</h1>
        <p className="text-gray-700 text-center mb-8">Enter your email and reset code</p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email input */}
          <div>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              name="email"
              value={formik.values.email}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4261] placeholder-gray-500"
              placeholder="Email"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-600 mt-2">{formik.errors.email}</p>
            )}
          </div>

          {/* Reset Code input */}
          <div>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="resetCode"
              value={formik.values.resetCode}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4261] placeholder-gray-500"
              placeholder="Reset Code"
            />
            {formik.errors.resetCode && formik.touched.resetCode && (
              <p className="text-sm text-red-600 mt-2">{formik.errors.resetCode}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0B4261] text-white py-3 rounded-full text-lg hover:bg-blue-900 transition shadow-lg"
          >
            RESET PASSWORD
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
