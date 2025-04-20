import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VerifyAccount() {
    let navigate = useNavigate();

    // Function to send form data to the API
    async function handleRegister(formValues) {
        try {
            console.log("Sending data:", formValues);

            const { data } = await axios.post(
                'https://carcareapp.runasp.net/api/account/ConfirmEmail',
                formValues,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            console.log('Registration successful:', data);
            navigate('/login');
        } catch (error) {
            if (error.response) {
                console.error('API Error:', error.response.data);
                alert(`Registration failed: ${error.response.data.message || 'Check input values'}`);
            } else {
                console.error('Unexpected Error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    }

    // Yup validation schema
    let validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        confirmationCode: Yup.string()
            .matches(/^[0-9]{4}$/, 'Confirmation code must be a 6-digit number')
            .required('Confirmation code is required'),
    });

    // Formik setup
    let formik = useFormik({
        initialValues: {
            email: '',
            confirmationCode: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleRegister,
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Title */}
            <div className="text-center">
                <h1 className="text-5xl font-bold text-blue-900">Verify Account</h1>
                <p className="text-lg font-semibold mt-2 text-blue-700">Enter the code sent to your email</p>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mt-8 w-full max-w-md">
                {/* Email Input */}
                <div className="mb-6">
                    <input
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        name="email"
                        id="email"
                        value={formik.values.email}
                        className="w-full p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 shadow-md"
                        placeholder="✉️ Email Address"
                    />
                    {formik.errors.email && formik.touched.email && (
                        <div className="text-sm text-red-600 mt-1">{formik.errors.email}</div>
                    )}
                </div>

                {/* Confirmation Code Input */}
                <div className="mb-6">
                    <input
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        name="confirmationCode"
                        id="confirmationCode"
                        value={formik.values.confirmationCode}
                        className="w-full p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 shadow-md"
                        placeholder="🔑 Confirmation Code"
                    />
                    {formik.errors.confirmationCode && formik.touched.confirmationCode && (
                        <div className="text-sm text-red-600 mt-1">{formik.errors.confirmationCode}</div>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white py-3 rounded-full font-semibold text-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                    >
                        VERIFY
                    </button>
                </div>
            </form>

            {/* Resend Code Link */}
            <div className="mt-4 text-center">
                <p className="text-gray-700">
                    Didn't receive the code?{' '}
                  
                </p>
            </div>
        </div>
    );
}
