import React from 'react';
import { LiaHandPointLeftSolid } from "react-icons/lia";
import logo from '../../assets/logo.png';

export default function Footer() {
    return (
        <div className='bg-[#0B4261]'>
            <div className='flex justify-around text-right py-10 text-white'>
                <div className='w-1/3'>
                    <h1 className='text-3xl font-semibold'>Quick Links</h1>

                    <div className='flex justify-end mt-7 items-center gap-1'>
                        <p className='text-xl font-semibold'>Our Services</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-end mt-3 items-center gap-1'>
                        <p className='text-xl font-semibold'>About Us</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-end mt-3 items-center gap-1'>
                        <p className='text-xl font-semibold'>Blog</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-end mt-3 items-center gap-1'>
                        <p className='text-xl font-semibold'>FAQs</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-end mt-3 items-center gap-1'>
                        <p className='text-xl font-semibold'>Diagnostics</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>
                </div>

                <div className='w-1/3'>
                    <h1 className='text-3xl font-semibold text-left'>What We Offer</h1>
                    <p className='font-bold mt-2 text-left'>
                        CarCare provides comprehensive services to repair all vehicle malfunctions, 
                        from the simplest to the most complex, whether internal engine and electrical issues 
                        or external bodywork damage. All services are supervised by our expert team, ensuring top-quality results.
                    </p>
                </div>
            </div>

            <p className='w-full h-[1px] bg-white'></p>

            <div className='flex justify-between py-3'>
                <div>
                    <div className="flex items-center">
                        <img src={logo} className="w-[50px] h-[50px] inline-block" alt="Logo" />
                        <h1 className="text-3xl text-white inline">CarCare</h1>
                    </div>
                </div>
                <div>
                    <h1 className='text-2xl text-white'>All rights reserved © CarCare 2024</h1>
                </div>
            </div>
        </div>
    );
}
