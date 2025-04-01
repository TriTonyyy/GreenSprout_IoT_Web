import React, {useState, useEffect, use} from 'react'
import {useNavigate } from "react-router";
import { registerApi, sendCodeApi, verifyOtpApi } from '../../api/AuthApi';
import{ useSelector } from 'react-redux';
import { getUserCredential } from '../../redux/selectors/authSelectors';

function AuthEmail({isTypeOTP}) {
const userCre = useSelector(getUserCredential);
  const [email, setEmail] = useState(userCre?.email ? userCre.email : '') 
  const [otp, setOtp] = useState('')
    
  const navigate = useNavigate();

  const sendOTP = ()=>{
    sendCodeApi(email)
        .then((res)=>{
            console.log(res);
            alert(res.data.message);

        })
        .catch((err)=>{
            console.log(err);
            alert(err.response.data.message);
        })

    registerApi({
        name:userCre.userName,
        email:userCre.email,
        password:userCre.password
    })
        .then((res)=>{
            console.log(res);
            navigate('/otp')
        })
        .catch((err)=>{
            console.log(err);
            alert(err.response.data.message);
        })
  }

  const verifyOTP = ()=>{
    console.log(email, otp);
    
    verifyOtpApi({email, code:otp})
        .then((res)=>{
            console.log(res);
            setOtp('');
            alert(res.data.message);
            navigate('/login')
        })
        .catch((err)=>{
            console.log(err);
            alert(err.response.data.message);
        })
  }
  return (  
    <div class='flex flex-col justify-center items-center min-h-screen bg-bgPurple '>
        <div class='bg-white p-10 rounded-2xl shadow-lg'>
            <div className='p-10'>
                <h1 className='text-5xl font-bold'>{ isTypeOTP ? "Nhập OTP" : "Đăng ký"}</h1>
            </div>
            <div className='input-box flex flex-col'>
                {isTypeOTP ?(
                    <>
                        <input value={otp}
                            onChange={(e)=> setOtp(e.target.value)} 
                            type='text' 
                            maxLength={4}
                            placeholder='Nhập OTP' 
                            className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'
                        /> 
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-purple' onClick={isTypeOTP ? verifyOTP :sendOTP}>Gửi OTP</button>
                        {/* <div className='flex justify-center items-center'>
                            <div className='w-5/12 h-px bg-slate-400'></div>
                            <p className='w-full text-center text-slate-400'>Hoặc đăng ký với</p>
                        <div className='w-5/12 h-px bg-slate-400'></div>
                        </div> */}
                        {/* <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-red'>Google</button> */}
                        {/* {isTypeOTP ? (
                        <h2 className='p-1 m-1'>Bạn chưa có tài khoản? <a href='/register' className='text-stone-950 font-bold'>Đăng ký</a></h2>
                        ): (
                        <h2 className='p-1 m-1'>Bạn đã có tài khoản? <a href='/login' className='text-stone-950 font-bold'>Đăng nhập</a></h2>
                        )} */}
                    </>
                ):(
                    <>
                        <input value={email}
                            onChange={(e)=> setEmail(e.target.value)} 
                            type='text' 
                            placeholder='Nhập email' 
                            className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'
                        /> 
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-purple' onClick={sendOTP}>Đăng ký</button>
                        <div className='flex justify-center items-center'>
                            <div className='w-5/12 h-px bg-slate-400'></div>
                                <p className='w-full text-center text-slate-400'>Hoặc đăng ký với</p>
                            <div className='w-5/12 h-px bg-slate-400'></div>
                        </div>
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-red'>Google</button>
                        {isTypeOTP ? (
                        <h2 className='p-1 m-1'>Bạn chưa có tài khoản? <a href='/register' className='text-stone-950 font-bold'>Đăng ký</a></h2>
                        ): (
                        <h2 className='p-1 m-1'>Bạn đã có tài khoản? <a href='/login' className='text-stone-950 font-bold'>Đăng nhập</a></h2>

                )}
                    </>
                )}
                
            </div>
        </div>
    </div>
  )
}

export default AuthEmail;