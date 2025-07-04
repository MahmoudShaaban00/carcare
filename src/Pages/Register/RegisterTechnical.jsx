import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function RegisterTechnical() {

    let navigate = useNavigate();

    //function to register technical 
    async function handleRegister(formValues) {
        try {
            const { data } = await axios.post(
                'https://carcareapp.runasp.net/api/account/register', formValues,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Registration Successful:', data);
            localStorage.setItem('tecId', data.id);
            localStorage.setItem('TechnicalToken', data.token);
            console.log("Technical ID:", data.id);
    
            Swal.fire({
                title: 'Registered Successfully!',
                text: 'Welcome on board!',
                icon: 'success',
                confirmButtonText: 'Continue',
            });
    
            navigate("/map");
    
        } catch (error) {
            console.error('Registration Failed:', error.response?.data || error.message);
    
            // Check if the backend provides specific validation errors
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors).join(", ")
                : error.response?.data?.message || "An unexpected error occurred.";
    
            Swal.fire({
                title: 'Registration Failed!',
                text: errorMessage,  // Display the specific errors or fallback message
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }
    

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        FullName: Yup.string().required('Full name is required'),
        phoneNumber: Yup.string()
            .matches(/^01[0125][0-9]{8}$/, 'Phone number is invalid')
            .required('Phone is required'),
        password: Yup.string().required('Password is required'),
        nationalId: Yup.string().length(14, 'National ID should be 14 characters').required('National ID is required'),
        serviceId: Yup.number().required('Service ID is required').min(1).max(8),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            FullName: '',
            phoneNumber: '',
            password: '',
            nationalId: '',
            serviceId: '',
            type: '',
        },
        validationSchema,
        onSubmit: handleRegister,
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br py-10 from-[#d5d8da] to-[#0B4261]">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-blue-800">Register Technical</h1>
                <p className="text-center text-gray-600 mt-2">Nice to see you again!</p>

                <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4 ">
                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" name="FullName" value={formik.values.FullName}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Full Name" />
                        {formik.errors.FullName && formik.touched.FullName && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.FullName}</div>
                        )}
                    </div>

                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="tel" name="phoneNumber" value={formik.values.phoneNumber}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Phone Number"
                        />
                        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.phoneNumber}</div>
                        )}
                    </div>

                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" name="email" value={formik.values.email}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Email Address" />
                        {formik.errors.email && formik.touched.email && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                        )}
                    </div>

                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="password" name="password" value={formik.values.password}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Password" />
                        {formik.errors.password && formik.touched.password && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
                        )}
                    </div>

                    <div>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" name="nationalId" value={formik.values.nationalId}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="National ID" />
                        {formik.errors.nationalId && formik.touched.nationalId && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.nationalId}</div>
                        )}
                    </div>

                    <div>
                        <select
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            name="serviceId"
                            value={formik.values.serviceId}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="" disabled>Select a Service</option>
                            {[
                                { id: 1, name: "Winch" },
                                { id: 2, name: "Tires" },
                                { id: 3, name: "Fuel" },
                                { id: 4, name: "Battery" },
                                { id: 5, name: "Oil" },
                            ].map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                        {formik.errors.serviceId && formik.touched.serviceId && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.serviceId}</div>
                        )}
                    </div>

                    <input type="hidden" name="type" value={formik.values.type = 0} />

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-600 transition-all duration-300">
                            REGISTER
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-gray-600">Don't have an account?</p>
                    <a href="login" className="text-blue-600 font-semibold hover:underline">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    );
}
