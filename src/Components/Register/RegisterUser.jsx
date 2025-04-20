import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function RegisterUser() {
    let navigate = useNavigate();

    //function to register user
    async function handleRegister(formValues) {
        try {
            const payload = {
                email: formValues.email,
                fullName: formValues.fullName,
                phoneNumber: formValues.phoneNumber,
                password: formValues.password,
                type: parseInt(formValues.type, 10) // Ensure `type` is a number if required
            };

            console.log("Sending data:", JSON.stringify(payload, null, 2));

            const { data } = await axios.post("https://carcareapp.runasp.net/api/account/register", payload, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Registration successful:", data);
            navigate("/confiromemail");
        } catch (error) {
            if (error.response) {
                console.error("API Error:", error.response.data);
                alert(`Registration failed: ${JSON.stringify(error.response.data)}`);
            } else {
                console.error("Unexpected Error:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    }

    // Create a validation schema using Yup
    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required('Full name is required'),
        phoneNumber: Yup.string()
            .matches(/^01[0125][0-9]{8}$/, 'Phone number is invalid')
            .required('Phone number is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // Create a formik instance with initial values, validation schema, and submit handler
    const formik = useFormik({
        initialValues: {
            email: '',
            fullName: '',
            phoneNumber: '',
            password: '',
            type: '1',
        },
        validationSchema: validationSchema,
        onSubmit: handleRegister,
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-800">Register User</h1>
                <p className="text-center text-gray-600 mt-2">Nice to see you again</p>

                {/* Formik form for user registration */}
                <form onSubmit={formik.handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" name="fullName" value={formik.values.fullName}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Full Name" />
                        {formik.errors.fullName && formik.touched.fullName && (
                            <p className="text-red-600 text-sm mt-1">{formik.errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="tel" name="phoneNumber" value={formik.values.phoneNumber}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Phone Number" />
                        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                            <p className="text-red-600 text-sm mt-1">{formik.errors.phoneNumber}</p>
                        )}
                    </div>

                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" name="email" value={formik.values.email}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Email Address" />
                        {formik.errors.email && formik.touched.email && (
                            <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="password" name="password" value={formik.values.password}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Password" />
                        {formik.errors.password && formik.touched.password && (
                            <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    <input type="hidden" name="type" value={formik.values.type} />

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                            REGISTER
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-gray-600">Already have an account?</p>
                    <a href="#" className="text-blue-600 font-semibold hover:underline">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    );
}
