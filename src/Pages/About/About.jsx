import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-6 md:px-16 lg:px-32">
      {/* Header Section */}
      <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">About Care Car</h1>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          <strong>Care Car</strong> is a modern roadside assistance and transportation service platform. We’re here to support you anytime, anywhere on the road.
        </p>
      </div>

      {/* Project Idea */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md mb-12" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Offer</h2>
        <p className="text-gray-700 leading-relaxed">
          Care Car provides a variety of roadside assistance services, including towing, fuel delivery, tire services, battery support, and more.
          Our goal is to offer quick, reliable help when you need it the most — whether you're stuck on the road or just need a simple car service.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up" data-aos-duration="1000">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-500 mb-2">Pay on Completion</h3>
          <p className="text-gray-600">You don’t need to pay in advance — just pay when the service is completed.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-500 mb-2">Choose the Service You Need</h3>
          <p className="text-gray-600">Select from a wide range of services like towing, tires, fuel, battery, and more — all in one app.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-500 mb-2">Annual Packages</h3>
          <p className="text-gray-600">Subscribe to one of our annual packages for unlimited or discounted services throughout the year.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-500 mb-2">Anytime, Anywhere</h3>
          <p className="text-gray-600">We're available 24/7 and can reach you wherever you are with fast and professional support.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
