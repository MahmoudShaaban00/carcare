import React, { useContext } from 'react'
import headerimg from '../../assets/home1.jpg'
import { GiTimeBomb } from "react-icons/gi";
import { FaHandsHelping } from "react-icons/fa";
import { CiHeadphones } from "react-icons/ci";
import { FaSackDollar } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import imageapp from '../../assets/mobile.jpg'
import googleplay from '../../assets/googleplay.jpg'
import ImageSlider from './imageslider';
import { HiDownload } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { BiMobileVibration } from "react-icons/bi";
import { useState } from "react";
import AddCar from './AddCar';


export default function Home() {

  const [openIndex, setOpenIndex] = useState(null);

  // Function to toggle accordion
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Close if open, otherwise open
  };



  return (
    <div>

<button onClick={() => {document.getElementById('add-car-section')?.scrollIntoView({ behavior: 'smooth' });}}
        className="fixed top-24 right-4 z-50 bg-[#0B4261] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2">
        <span>Add Car</span>
        <FaPlus />
      </button>

      {/* start header */}
      <div className='bg-gray-100 w-full py-20 sm:flex justify-around items-center font-serif'>
        {/* Text Section */}
        <div className='lg:w-1/2 sm:w-1/3 sm:px-0 px-5' data-aos='fade-right' data-aos-delay='600' data-aos-duration='1000'>
          <h1 className='lg:text-4xl sm:text-2xl text-2xl text-left text-primary font-bold'>
            Care Car | Transportation and Roadside Assistance Services
          </h1>

          <p className='md:text-xl sm:text-lg text-left mt-8' data-aos='fade-up' data-aos-delay='1000' data-aos-duration='1000'>
            Care Car provides roadside assistance services. You can pay upon order completion, choose the service you need, or purchase one of the annual packages.
          </p>
        </div>

        {/* Image Section */}
        <div className='sm:mt-0 mt-5' data-aos='fade-left' data-aos-delay='800' data-aos-duration='1000'>
          <img src={headerimg} className='rounded-md xl:w-[500px] lg:w-[450px] md:w-[400px] sm:w-[330px] sm:px-0 px-5' alt='Care Car Hero' />
        </div>
      </div>
      {/* end header */}

      {/* start advantage */}
      <div className='md:px-32 px-10 mt-20 md:flex justify-around flex-wrap font-serif'>
        <div className='lg:w-1/4 md:w-1/2 mb-10' data-aos='fade-up' data-aos-delay='200' data-aos-duration='1000'>
          <CiHeadphones className='w-16 h-16 text-gray-600' />
          <h1 className='text-xl text-[#0B4261] text-left'>Your Feedback Means a Lot to Us</h1>
          <p className='bg-[#0B4261] w-16 my-3 h-1'></p>
          <p className='text-left'>Care Car dedicates the largest fleet in the Middle East to assist and handle roadside breakdowns.</p>
        </div>

        <div className='lg:w-1/4 md:w-1/2 mb-10' data-aos='fade-up' data-aos-delay='400' data-aos-duration='1000'>
          <FaHandsHelping className='w-16 h-16 text-gray-600' />
          <h1 className='text-xl text-[#0B4261] text-left'>Help Will Reach You Anywhere</h1>
          <p className='bg-[#0B4261] w-16 my-3 h-1'></p>
          <p className='text-left'>Our operations team monitors requests and communicates with customers by phone 24/7.</p>
        </div>

        <div className='lg:w-1/4 md:w-1/2 mb-10' data-aos='fade-up' data-aos-delay='600' data-aos-duration='1000'>
          <GiTimeBomb className='w-16 h-16 text-gray-600' />
          <h1 className='text-xl text-[#0B4261] text-left'>Anytime, Anywhere</h1>
          <p className='bg-[#0B4261] w-16 my-3 h-1'></p>
          <p className='text-left'>Customer feedback is the main source for improving our services and enhancing quality.</p>
        </div>
      </div>

      <div className='md:px-32 px-10 mb-10 lg:flex justify-around flex-wrap font-serif'>
        <div className='lg:w-1/4 md:w-1/2 mt-12' data-aos='fade-up' data-aos-delay='200' data-aos-duration='1000'>
          <FaSackDollar className='w-16 h-16 text-gray-600 mb-1' />
          <h1 className='text-xl text-[#0B4261] text-left'>Fixed Prices</h1>
          <p className='bg-[#0B4261] w-16 my-3 h-1'></p>
          <p className='text-left'>All prices and billing methods are displayed to customers before submitting a service request.</p>
        </div>

        <div className='lg:w-1/4 md:w-1/2 mt-12' data-aos='fade-up' data-aos-delay='400' data-aos-duration='1000'>
          <FaMapMarkerAlt className='w-16 h-16 text-gray-600' />
          <h1 className='text-xl text-[#0B4261] text-left'>Know Your Service Provider</h1>
          <p className='bg-[#0B4261] w-16 my-3 h-1'></p>
          <p className='text-left'>Care Car will display the service provider’s details once they win the request. Customers can also track the provider’s movements.</p>
        </div>

        <div
          className='lg:w-1/4 md:w-1/2 mt-12' data-aos='fade-up' data-aos-delay='600' data-aos-duration='1000'>
          <MdOutlinePayment className='w-16 h-16 text-gray-600' />
          <h1 className='text-xl text-[#0B4261] text-left'>Payment Options</h1>
          <p className='bg-[#0B4261] w-16 my-3 h-1'></p>
          <p className='text-left'>Care Car offers multiple payment methods, including online payment, loyalty programs, and cash payments.</p>
        </div>
      </div>
      {/* end advantage */}

      {/* start section google play */}
      <div className='mt-40 w-full  pb-10 bg-[#0B4261] flex justify-around relative font-serif' data-aos='fade-right' data-aos-delay='600' data-aos-duration='1000'>
        <div>
          <img src={imageapp} className='absolute lg:bottom-[-100px] bottom-[-60px] lg:w-[200px] w-[160px] ' />
        </div>

        <div className='place-items-left '>
          <h1 className='text-white md:text-3xl text-xl pt-12 text-left'>Download the App Now</h1>
          <p className="bg-white w-20 my-2 h-1 "></p>
          <p className="text-white ml-auto">The Care Car app is available on Apple, Google, and Huawei stores.</p>
          <img src={googleplay} className='mt-3 mx-auto md:w-[170px] w-[120px]' />
        </div>

      </div>
      {/* end section google play */}

      {/* start section slider */}
      <div className='mt-52 font-serif ml-28' data-aos='fade-up' data-aos-delay='600' data-aos-duration='1000'>
        <h1 className='text-2xl text-left mr-16 text-[#0B4261] font-bold'>Cars We Can Repair</h1>
        <p className="bg-[#0B4261] w-16 mr-16 mt-2 h-1 "></p>
        <ImageSlider />
      </div>
      {/* end section slider */}


      {/* start how used */}
      <div className="mt-40 w-full bg-[#0B4261] font-serif" data-aos='fade-up' data-aos-delay='600' data-aos-duration='1000'>
        <h1 className="text-white md:text-4xl text-2xl text-left pt-10 px-6 md:px-20 font-bold">How to Use Care Care</h1>
        <p className="bg-white w-16 ml-6 md:ml-20 mt-3 h-1 mr-auto mb-10"></p>

        <div className="flex flex-col md:flex-row justify-around text-white text-left px-6 md:px-20 pb-10 gap-10">

          <div className="md:w-1/3">
            <div className="flex justify-start mb-4">
              <BiMobileVibration className="text-5xl border-4 rounded border-white p-1" />
            </div>
            <h1 className="mb-3 text-xl font-bold">Request Service</h1>
            <p>Submit a request by selecting from the list of services and wait for assistance.</p>
          </div>

          <div className="md:w-1/3">
            <div className="flex justify-start mb-4">
              <FaCheck className="text-5xl border-4 rounded border-white p-1" />
            </div>
            <h1 className="mb-3 text-xl font-bold">Activate Your Account</h1>
            <p>Care Care only requires entering the customer’s mobile number.</p>
          </div>

          <div className="md:w-1/3">
            <div className="flex justify-start mb-4">
              <HiDownload className="text-5xl border-4 rounded border-white p-1" />
            </div>
            <h1 className="mb-3 text-xl font-bold">Download the App</h1>
            <p>The Care Care app is available on the Apple App Store for iPhones and on the Google Play Store for Android devices.</p>
          </div>

        </div>
      </div>
      {/* end how used */}


      {/* start questions */}
      <div className='mt-36 mb-40 font-serif' data-aos='fade-up' data-aos-delay='600' data-aos-duration='1000'>
        <h1 className='text-5xl text-center bg-[#0B4261]font-bold'>Frequently Asked Questions</h1>

        <div className="space-y-6 mt-16">
          {/* Accordion 1 */}
          <div
            className={`wd-accordion p-4 rounded-lg border-2 pl-10 border-gray-100 w-3/4 mx-auto ${openIndex === 0 ? "shadow-xl" : "shadow-md"
              } transition-shadow duration-300`}
          >
            <div
              className="wd-accordion-title text-left wd-opener-pos-left cursor-pointer"
              onClick={() => toggleAccordion(0)}
            >
              <div className="wd-accordion-title-text">
                <span className="text-red-500 text-2xl">Where is Care Care available?</span>
              </div>
            </div>
            <div className={`wd-accordion-content reset-last-child ${openIndex === 0 ? "block" : "hidden"}`}>
              <p className="text-left text-xl mt-1">Currently, Care Care is available in Cairo, Giza, and Fayoum.</p>
            </div>
          </div>

          {/* Accordion 2 */}
          <div
            className={`wd-accordion p-4 rounded-lg border-2 pl-10 border-gray-100 w-3/4 mx-auto ${openIndex === 1 ? "shadow-xl" : "shadow-md"
              } transition-shadow duration-300`}
          >
            <div
              className="wd-accordion-title text-left wd-opener-pos-left cursor-pointer"
              onClick={() => toggleAccordion(1)}
            >
              <div className="wd-accordion-title-text">
                <span className="text-red-500 text-2xl">Is there a warranty?</span>
              </div>
            </div>
            <div className={`wd-accordion-content reset-last-child ${openIndex === 1 ? "block" : "hidden"}`}>
              <p className="text-left text-xl mt-1">Yes, there is a one-month warranty on repairs and a one-year warranty on paintwork.</p>
            </div>
          </div>

          {/* Accordion 3 */}
          <div
            className={`wd-accordion p-4 rounded-lg border-2 pl-10 border-gray-100 w-3/4 mx-auto ${openIndex === 2 ? "shadow-xl" : "shadow-md"
              } transition-shadow duration-300`}
          >
            <div
              className="wd-accordion-title text-left wd-opener-pos-left cursor-pointer"
              onClick={() => toggleAccordion(2)}
            >
              <div className="wd-accordion-title-text">
                <span className="text-red-500 text-2xl">Is there mobile maintenance service?</span>
              </div>
            </div>
            <div className={`wd-accordion-content reset-last-child ${openIndex === 2 ? "block" : "hidden"}`}>
              <p className="text-left text-xl mt-1">Yes, mobile maintenance service is available at all times.</p>
            </div>
          </div>

          {/* Accordion 4 */}
          <div
            className={`wd-accordion p-4 rounded-lg border-2 pl-10 border-gray-100 w-3/4 mx-auto ${openIndex === 3 ? "shadow-xl" : "shadow-md"
              } transition-shadow duration-300`}
          >
            <div
              className="wd-accordion-title text-left wd-opener-pos-left cursor-pointer"
              onClick={() => toggleAccordion(3)}
            >
              <div className="wd-accordion-title-text">
                <span className="text-red-500 text-2xl">How much do car repairs cost?</span>
              </div>
            </div>
            <div className={`wd-accordion-content reset-last-child ${openIndex === 3 ? "block" : "hidden"}`}>
              <p className="text-left text-xl mt-1">The cost and work duration are determined after the vehicle is inspected.</p>
            </div>
          </div>

          {/* Accordion 5 */}
          <div
            className={`wd-accordion p-4 rounded-lg border-2 pl-10 border-gray-100 w-3/4 mx-auto ${openIndex === 4 ? "shadow-xl" : "shadow-md"
              } transition-shadow duration-300`}
          >
            <div
              className="wd-accordion-title text-left wd-opener-pos-left cursor-pointer"
              onClick={() => toggleAccordion(4)}
            >
              <div className="wd-accordion-title-text">
                <span className="text-red-500 text-2xl">How long does an inspection take?</span>
              </div>
            </div>
            <div className={`wd-accordion-content reset-last-child ${openIndex === 4 ? "block" : "hidden"}`}>
              <p className="text-left text-xl mt-1">It varies depending on the issue, ranging from 24 to 72 hours at most.</p>
            </div>
          </div>

          {/* Accordion 6 */}
          <div
            className={`wd-accordion p-4 rounded-lg border-2 pl-10 border-gray-100 w-3/4 mx-auto ${openIndex === 5 ? "shadow-xl" : "shadow-md"
              } transition-shadow duration-300`}
          >
            <div
              className="wd-accordion-title text-left wd-opener-pos-left cursor-pointer"
              onClick={() => toggleAccordion(5)}
            >
              <div className="wd-accordion-title-text">
                <span className="text-red-500 text-2xl">What if I don’t agree with the price?</span>
              </div>
            </div>
            <div className={`wd-accordion-content reset-last-child ${openIndex === 5 ? "block" : "hidden"}`}>
              <p className="text-left text-xl mt-1">You only need to pay the service fee.</p>
            </div>
          </div>
        </div>
      </div>
      {/* end questions */}

      {/* start add car */}
      <div id="add-car-section" className='my-16' data-aos='fade-up' data-aos-delay='600' data-aos-duration='1000'>
        <AddCar />
      </div>

    </div>
  )
}
