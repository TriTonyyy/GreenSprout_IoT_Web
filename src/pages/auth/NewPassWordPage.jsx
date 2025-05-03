import React, {useState, useEffect} from 'react'
import {useNavigate } from "react-router";
import { registerApi, resetPasswordAPI, sendCodeApi, verifyOtpApi } from '../../api/authApi';
import{ useSelector } from 'react-redux';
import { getUserCredential } from '../../redux/selectors/authSelectors';
import { apiResponseHandler } from '../../components/Alert/alertComponent';

function AuthEmail({isTypeOTP, isForgetPassword}) {
    const userCre = useSelector(getUserCredential);
  const [email, setEmail] = useState(userCre?.email ? userCre.email : '') 
  const [newPass, setNewPass] = useState('') 

    console.log(userCre, "usercre");
    
  const navigate = useNavigate();

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

  const changePassWord = async ()=>{
    const email = userCre?.email;
    resetPasswordAPI({email, newPassword:newPass })
    .then((res)=>{
        console.log(res);
        alert(res.message)
        navigate("/login") 
    })
    .catch((err)=>{
        apiResponseHandler(err.response.data.message);
    })
  }
  return (  
    <div class='flex flex-col justify-center items-center min-h-screen  bg-green-600'>
        <div class='bg-green-50 p-10 rounded-2xl shadow-lg'>
            <div className="flex justify-center cursor-pointer">
                <img src={require("../../assets/images/TreePlanting.png")} className="h-50 w-50 object-contain" alt="logo"/>
            </div>
            <div className='p-10'>
                <h1 className='text-5xl font-bold'>
                    { "Nhập mật khẩu mới"}
                </h1>
            </div>
            <div className='input-box flex flex-col'>
                <>
                    <input value={newPass}
                        onChange={(e)=> setNewPass(e.target.value)} 
                        type='password' 
                        placeholder='Nhập mật khẩu mới' 
                        className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'
                    /> 
                    <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-green-700' onClick={changePassWord}>
                        Đổi mật khẩu mới
                    </button>
                    {/* <div className='flex justify-center items-center'>
                        <div className='w-5/12 h-px bg-slate-400'></div>
                            <p className='w-full text-center text-slate-400'>Hoặc đăng ký với</p>
                        <div className='w-5/12 h-px bg-slate-400'></div>
                    </div>
                    <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-red'>Google</button> */}
                </>
            </div>
        </div>
    </div>
  )
}

export default AuthEmail;