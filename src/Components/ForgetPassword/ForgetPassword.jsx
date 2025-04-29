import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgetPassword() {


  let navigate = useNavigate()

  // Function to handle form submission
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

  // Validation schema for form validation
  let validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  // Formik setup for managing form state and validation
  let formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="mt-2 ">
      <div className="mt-10 place-items-center">
        <h1 className="lg:text-5xl text-3xltext-[#0B4261]">Forget Password</h1>
        <p className="text-lg font-semibold mt-2text-[#0B4261]">Enter your email to reset your password</p>
      </div>

      {/* Form for email input and submit button */}
      <form onSubmit={formik.handleSubmit} className="place-items-center">
        {/* Email Input */}
        <div className="mt-10">
          <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" name="email" id="email" value={formik.values.email}
            className="border-2 sm:w-[500px] p-3 rounded-full placeholder-black text-left w-[300px]"
            placeholder="Email Address"
          />
          {formik.errors.email && formik.touched.email ? (
            <div className="flex items-center mx-auto sm:w-[500px] w-[300px] p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="md:text-lg text-sm mt-10 bg-[#0B4261] text-white sm:w-[500px] w-[300px] p-3 rounded-full cursor-pointer hover:bg-slate-400 hover:text-white">
            SEND RESET LINK
          </button>
        </div>
      </form>
    </div>
  );
}
