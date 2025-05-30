import React, { useState } from "react";
import { Link } from "react-router-dom";
import RequestsPieChart from "../Requests/RequestsPieChar";
import PhonePrefixChart from "../team/PhonePrefixChart";
import TechnicalPrefixChart from "../Technicals/TechnicalPrefixChart";
import TechnicalCountCard from "../Technicals/TechnicalCountCard";
import RequestCountCard from "../Requests/RequestCountCard";
import UserCountCard from "../team/UserCountCard";
import { FaUsers, FaWrench, FaTasks } from 'react-icons/fa'; // Import icons from React Icons


const Control = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${isOpen ? "xl:w-1/4 w-1/3" : "xl:w-[5%] w--[8%]"
          } bg-[#0B4261] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between md:p-4 px-1 border-b border-gray-700 ">
          {isOpen && <span className="font-bold text-sm">Dashboard</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-2xl  md:px-0 px-4"
            title={isOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          <Link to="/team" className="hover:bg-gray-700 p-2 rounded">
            {isOpen ? "Users" : "👥"}
          </Link>
          <Link to="/technical" className="hover:bg-gray-700 p-2 rounded">
            {isOpen ? "Technicals" : "🧑‍🔧"}
          </Link>
          <Link to="/servicestype" className="hover:bg-gray-700 p-2 rounded">
            {isOpen ? "Services" : "🛠️"}
          </Link>
          <Link to="/vehicle" className="hover:bg-gray-700 p-2 rounded">
            {isOpen ? "Vehicles" : "🚗"}
          </Link>
          <Link to="/feedbacks" className="hover:bg-gray-700 p-2 rounded">
            {isOpen ? "Feedback" : "💬"}
          </Link>
          <Link to="/requests" className="hover:bg-gray-700 p-2 rounded">
            {isOpen ? "Requests" : "📬"}
          </Link>
          <Link to="/createcontact" className="hover:bg-gray-700 p-2 rounded">
            {isOpen ? "Contact" : "📞"}
          </Link>
        </nav>
      </div>


      {/* Main Content (Charts) */}
      <div className="flex-1 bg-gray-100 p-6 transition-all duration-300 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Control of Dashboard</h1>

        {/* Card Row: Three cards, each taking a line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Request Count Card */}
          <div className="bg-white shadow rounded p-4 w-full m-auto sm:w-[250px] md:w-[300px] lg:w-[320px]">
            <div className="flex flex-col items-center">
              <FaTasks size={40} className="text-blue-500 mb-3" /> {/* Add Icon */}
              <RequestCountCard />
            </div>
          </div>

          {/* User Count Card */}
          <div className="bg-white shadow rounded p-4 w-full m-auto sm:w-[250px] md:w-[300px] lg:w-[320px]">
            <div className="flex flex-col items-center">
              <FaUsers size={40} className="text-green-500 mb-3" /> {/* Add Icon */}
              <UserCountCard />
            </div>
          </div>

          {/* Technical Count Card */}
          <div className="bg-white shadow rounded p-4 w-full m-auto sm:w-[250px] md:w-[300px] lg:w-[320px]">
            <div className="flex flex-col items-center">
              <FaWrench size={40} className="text-orange-500 mb-3" /> {/* Add Icon */}
              <TechnicalCountCard />
            </div>
          </div>
        </div>

        <div >
          <div className="sm:w-full lg:h-[350px] w-[250px] m-auto md:h-[200px] bg-white shadow rounded mt-3 lg:mt-24 md:mt-72 sm:mt-8">
            <PhonePrefixChart />
          </div>
          <div className="sm:w-full lg:h-[350px] w-[250px] m-auto md:h-[200px] bg-white shadow rounded mt-3 lg:mt-24 md:mt-72 sm:mt-8 lg:mb-10 md:mb-56 sm:mb-14">
            <TechnicalPrefixChart />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Control;
