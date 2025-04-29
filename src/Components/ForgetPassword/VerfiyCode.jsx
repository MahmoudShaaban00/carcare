import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VerfiyCode() {
    let navigate = useNavigate();

    // This function handles the form submission and sends the data to the API
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

    // This function handles the form validation using Yup
    let validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        resetCode: Yup.number().required('Reset code is required'),
    });

    // This function initializes the formik library to handle form state and validation
    let formik = useFormik({
        initialValues: {
            email: '',
            resetCode: "",
        },
        validationSchema: validationSchema,
        onSubmit: sendToApi,
    });

    return (
        <div className='mt-2'>
            <div className='mt-10 place-items-center'>
                <h1 className='lg:text-5xl text-3xl text-[#0B4261]'>Reset Password</h1>
                <p className='text-lg font-semibold mt-2 text-[#0B4261]'>Enter your details to reset</p>
            </div>

            {/* Form for entering email and reset code */}
            <form onSubmit={formik.handleSubmit} className='place-items-center'>
                <div className="mt-10">
                    <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" name="email" id="email"
                        value={formik.values.email}
                        className="border-2 sm:w-[500px] p-3 rounded-full placeholder-black text-left w-[300px]" placeholder="Email" />
                    {formik.errors.email && formik.touched.email ? (
                        <div className="flex items-center mx-auto sm:w-[500px] w-[300px] p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            {formik.errors.email}
                        </div>
                    ) : null}
                </div>

                <div className='mt-4'>
                    <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="number" name='resetCode' id='resetCode' value={formik.values.resetCode}
                        className="border-2 sm:w-[500px] w-[300px] p-3 rounded-full placeholder-black text-left" placeholder='Reset Code' />
                    {formik.errors.resetCode && formik.touched.resetCode ? (
                        <div className="flex items-center mx-auto sm:w-[500px] w-[300px] p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            {formik.errors.resetCode}
                        </div>
                    ) : null}
                </div>

                <div>
                    <button type="submit" className='md:text-lg text-sm mt-10 bg-[#0B4261] text-white sm:w-[500px] w-[300px] p-3 rounded-full cursor-pointer hover:bg-slate-400 hover:text-white'>
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
