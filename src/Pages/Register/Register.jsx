import React from 'react';
import { useNavigate } from 'react-router-dom';
import imguser from '../../assets/user.jpg';
import imgtec from '../../assets/tec.jpg';

export default function Register() {
  const navigator = useNavigate();

  function changeRouter1() {
    navigator('/registeruser');
  }

  function changeRouter2() {
    navigator('/registertechnical');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d5d8da] to-[#0B4261] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-blue-900 text-center mb-10 drop-shadow">
        Create New Account
      </h1>

      <div className="lg:flex gap-10 justify-center w-full max-w-6xl">
        {/* User Registration Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 flex-1 flex flex-col items-center">
          <img src={imguser} alt="User Registration" className="h-[130px] rounded-full shadow-md mb-6" />
          <p className="text-lg text-center text-gray-700 mb-8">
            Register to order and request the service you want from the site.
          </p>
          <button
            onClick={changeRouter1}
            className="text-lg bg-blue-800 text-white w-full py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Register as User
          </button>
        </div>

        {/* Technical Registration Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 flex-1 flex flex-col items-center mt-10 lg:mt-0">
          <img src={imgtec} alt="Technical Registration" className="h-[130px] rounded-full shadow-md mb-6" />
          <p className="text-lg text-center text-gray-700 mb-8">
            Register to view and manage the services you provide to users.
          </p>
          <button
            onClick={changeRouter2}
            className="text-lg bg-blue-800 text-white w-full py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Register as Technical
          </button>
        </div>
      </div>
    </div>
  );
}
