import React from 'react'
import { BsPhone } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import logo from '../../assets/logo.png'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import imguser from '../../assets/user.jpg'
import imgtec from '../../assets/tec.jpg'
import { useNavigate } from 'react-router-dom';


export default function Register() {

    let navigator=useNavigate()

    function changeRouter1(){

        navigator('/registeruser')
    }

    function changeRouter2(){

        navigator('/registertechnical')
    }

    return (
        <div className='mt-2'>

            <div className='mt-5'>
                <h1 className='sm:text-4xl text-xl text-center text-blue-950'>Create New Account</h1>
            </div>


            <div className='lg:flex  justify-around mt-5'>
                <div className='place-items-center'>
                    <img src={imguser} className='h-[130px] mx-auto' />
                    <p className='text-2xl mt-2 text-center'>Register to order a button to request <br />the service you want from the site</p>
                    <button type="submit" onClick={()=>changeRouter1()}   className='text-lg mt-10  bg-blue-800 text-white sm:w-[400px] w-[300px] p-3 rounded-full cursor-pointer hover:bg-slate-400 hover:text-white'>Register By User</button>

                </div>
                <div className='place-items-center'>
                    <img src={imgtec} className='h-[130px] mx-auto lg:mt-0 mt-12'  />
                    <p className='text-2xl mt-2 text-center'>Register to view the service you have  <br /> provided  to users who need your service</p>
                    <button type="submit" onClick={()=>changeRouter2()}  className='text-lg mt-10  bg-blue-800 text-white sm:w-[400px] w-[300px] p-3 rounded-full cursor-pointer hover:bg-slate-400 hover:text-white'>Register By Technical</button>
                </div>
            </div>

        </div>
    )
}
