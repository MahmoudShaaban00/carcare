import React from 'react';
import { LiaHandPointLeftSolid } from "react-icons/lia";
import logo from '../../assets/logo.png';

export default function Footer() {
    return (
        <div className='bg-[#0B4261]'>
            <div className='flex flex-col md:flex-row md:justify-around md:items-start text-right py-10 text-white gap-8 px-6 md:px-12'>
                
                {/* Quick Links */}
                <div className='md:w-1/3 w-full'>
                    <h1 className='text-2xl md:text-3xl font-semibold text-center md:text-right'>Quick Links</h1>

                    <div className='flex justify-center md:justify-end mt-6 items-center gap-2'>
                        <p className='text-lg md:text-xl font-semibold'>Our Services</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-center md:justify-end mt-3 items-center gap-2'>
                        <p className='text-lg md:text-xl font-semibold'>About Us</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-center md:justify-end mt-3 items-center gap-2'>
                        <p className='text-lg md:text-xl font-semibold'>Blog</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-center md:justify-end mt-3 items-center gap-2'>
                        <p className='text-lg md:text-xl font-semibold'>FAQs</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>

                    <div className='flex justify-center md:justify-end mt-3 items-center gap-2'>
                        <p className='text-lg md:text-xl font-semibold'>Diagnostics</p>
                        <LiaHandPointLeftSolid className='text-xl' />
                    </div>
                </div>

                {/* What We Offer */}
                <div className='md:w-1/3 w-full text-center md:text-left'>
                    <h1 className='text-2xl md:text-3xl font-semibold'>What We Offer</h1>
                    <p className='font-medium mt-4 text-sm md:text-base'>
                        CarCare provides comprehensive services to repair all vehicle malfunctions,
                        from the simplest to the most complex, whether internal engine and electrical issues
                        or external bodywork damage. All services are supervised by our expert team, ensuring top-quality results.
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className='w-full h-[1px] bg-white'></div>

            {/* Bottom Section */}
            <div className='flex flex-col md:flex-row justify-between items-center py-4 px-6 md:px-12 gap-4'>
                <div className="flex items-center gap-3">
                    <img src={logo} className="w-[45px] h-[45px]" alt="Logo" />
                    <h1 className="text-2xl md:text-3xl text-white font-semibold">CarCare</h1>
                </div>

                <div className='text-center md:text-right'>
                    <h1 className='text-lg md:text-2xl text-white font-light'>
                        All rights reserved © CarCare 2024
                    </h1>
                </div>
            </div>
        </div>
    );
}
