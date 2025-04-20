import axios from 'axios'
import React, { useState } from 'react'

export default function AddCar() {

    const [model, setModel] = useState()
    const [color, setColor] = useState()
    const [year, setYear] = useState()
    const [Vin_Number, setVinNumber] = useState()
    const [plateNumber, setPlateNumber] = useState()

    // Function to handle form submission
    async function handleCar(e) {
        e.preventDefault();

        const carData = { model, color, year, Vin_Number, plateNumber };

        const token = localStorage.getItem('UserToken');
        if (!token) {
            console.log("No token found, user needs to log in.");
            return;
        }

        try {
            const response = await axios.post(
                'https://carcareapp.runasp.net/api/Vehicle/Create-Vehicle',
                carData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Success:', response.data);
        } catch (error) {
            if (error.response) {
                console.log('Error data:', error.response.data);
                console.log('Error status:', error.response.status);
                console.log('Error headers:', error.response.headers);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error:', error.message);
            }
        }
    }

    return (
        <div className='place-items-center w-full bg-slate-100 py-10 font-serif'>
            <h1 className='text-4xl text-[#0B4261] font-semibold'>Enter Your Car</h1>
            <p className='font-semibold my-2'>Enter your car information to assist you quickly and easily</p>

            <div className='w-full flex justify-center mt-10'>
                <div className='w-full sm:w-3/4 sm:px-0 px-5'>
                    <label htmlFor="" className='block mb-2 w-full text-right text-xl text-[#0B4261] '>Car Type</label>
                    <input type="text" value={model} onChange={e => setModel(e.target.value)} className='w-full rounded-xl block bg-slate-200 p-3' />
                </div>
            </div>

            <div className='w-full flex justify-center mt-10'>
                <div className='w-full sm:w-3/4 sm:px-0 px-5'>
                    <label htmlFor="" className='block mb-2 w-full text-right text-xl text-[#0B4261] '>Car Color</label>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className='w-full rounded-xl block bg-slate-200 p-3' />
                </div>
            </div>

            <div className='w-full flex justify-center mt-10'>
                <div className='w-full sm:w-3/4 sm:px-0 px-5'>
                    <label htmlFor="" className='block mb-2 w-full text-right text-xl text-[#0B4261] '>Production Year</label>
                    <input type="text" value={year} onChange={e => setYear(e.target.value)} className='w-full rounded-xl block bg-slate-200 p-3' />
                </div>
            </div>

            <div className='w-full flex justify-center mt-10'>
                <div className='w-full sm:w-3/4 sm:px-0 px-5'>
                    <label htmlFor="" className='block mb-2 w-full text-right text-xl text-[#0B4261] '>Car VIN Number</label>
                    <input type="text" value={Vin_Number} onChange={e => setVinNumber(e.target.value)} className='w-full rounded-xl block bg-slate-200 p-3' />
                </div>
            </div>

            <div className='w-full flex justify-center mt-10'>
                <div className='w-full sm:w-3/4 sm:px-0 px-5'>
                    <label htmlFor="" className='block mb-2 w-full text-right text-xl text-[#0B4261] '>License Plate Number</label>
                    <input type="text" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} className='w-full rounded-xl block bg-slate-200 p-3' />
                </div>
            </div>

            <button type='submit' onClick={handleCar} className='bg-[#0B4261] text-white p-3 mt-6 rounded-xl'>Submit Information</button>
        </div>
    )
}
