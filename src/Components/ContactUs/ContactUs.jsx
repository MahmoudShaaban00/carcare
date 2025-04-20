import React from 'react';
import contactus from '../../assets//contactus/contactus.jpg';

export default function ContactUs() {
  return (
    
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">

      {/* Header */}
      <div className="w-full max-w-xl text-center mb-10"  data-aos='fade-right' data-aos-delay='600' data-aos-duration='1000'>
        <img src={contactus} alt="Contact Us" className="mx-auto w-[600px] h-[280px] object-contain"/>
        <h1 className="text-3xl font-bold mt-4">Get in Touch With Us</h1>
        <p className="text-gray-600 mt-2">We’d love to hear from you!</p>
      </div>

      {/* Contact Options */}
      <div className="w-full max-w-md space-y-6" data-aos='fade-left' data-aos-delay='600' data-aos-duration='1000'>

        {/* WhatsApp */}
        <a href="https://wa.me/01027938060" target="_blank" rel="noopener noreferrer"
          className="block w-full bg-green-500 text-white py-3 rounded-xl text-center text-lg font-semibold shadow hover:bg-green-600 transition">
          Message us on WhatsApp
        </a>

        {/* Email */}
        <a href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=mahmoudshabankk011@gmail.com" target="_blank" rel="noopener noreferrer"
          className="block w-full bg-blue-500 text-white py-3 rounded-xl text-center text-lg font-semibold shadow hover:bg-blue-600 transition">
          Send us an Email
        </a>

      </div>
    </div>
  );
};

