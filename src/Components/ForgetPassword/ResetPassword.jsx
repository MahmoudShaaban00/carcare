import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    
    // Initialize navigate for programmatic navigation
    let navigate = useNavigate();

    // Function to handle form submission
    async function sendToApi(formValues) {
        try {
            console.log("Sending data:", formValues);
            const { data } = await axios.put(
                'https://carcareapp.runasp.net/api/account/ResetPasswordEmail',
                formValues,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Password reset successful:', data);
            navigate('/login');
        } catch (error) {
            if (error.response) {
                console.error('API Error:', error.response.data);
                alert(`Password reset failed: ${error.response.data.message || 'Check input values'}`);
            } else {
                console.error('Unexpected Error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    }

    // Validation schema for form validation
    let validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        newPassword: Yup.string().required('New password is required'),
    });

    // Formik setup for managing form state and validation
    let formik = useFormik({
        initialValues: {
            email: '',
            newPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: sendToApi,
    });

    return (
        <div className='mt-2 '>
            <div className='mt-10 place-items-center'>
                <h1 className='text-5xl text-blue-950'>Reset Password</h1>
                <p className='text-lg font-semibold mt-2 text-blue-950'>Enter your new password</p>
            </div>

            {/* Form for resetting password */}
            <form onSubmit={formik.handleSubmit} className='place-items-center'>
                <div className="mt-10">
                    <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" name="email" id="email" value={formik.values.email} placeholder="Email"
                        className="border-2 sm:w-[500px] p-3 rounded-full placeholder-black text-left w-[300px]"/>
                    {formik.errors.email && formik.touched.email ? (
                        <div className="flex items-center mx-auto sm:w-[500px] w-[300px] p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            {formik.errors.email}
                        </div>
                    ) : null}
                </div>

                <div className='mt-4'>
                    <input
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="password"
                        name='newPassword'
                        id='newPassword'
                        value={formik.values.newPassword}
                        className="border-2 sm:w-[500px] w-[300px] p-3 rounded-full placeholder-black text-left"
                        placeholder='New Password'
                    />
                    {formik.errors.newPassword && formik.touched.newPassword ? (
                        <div className="flex items-center mx-auto sm:w-[500px] w-[300px] p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            {formik.errors.newPassword}
                        </div>
                    ) : null}
                </div>

                <div>
                    <button type="submit" className='text-lg mt-10 bg-blue-800 text-white sm:w-[500px] w-[300px] p-3 rounded-full cursor-pointer hover:bg-slate-400 hover:text-white'>
                        RESET PASSWORD
                    </button>
                </div>
            </form>

            <div className='flex justify-center mt-3 gap-24'>
                <p>
                    Remember your password? <Link to='/login' className='text-blue-600'>Login</Link>
                </p>
            </div>
        </div>
    );
}