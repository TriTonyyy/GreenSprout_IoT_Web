import React, {useState, useEffect} from 'react'
import {useNavigate } from "react-router";
import { registerApi, sendCodeApi, verifyOtpApi } from '../../api/authApi';
import{ useDispatch, useSelector } from 'react-redux';
import { getUserCredential } from '../../redux/selectors/authSelectors';
import { UserCredential } from "../../redux/Reducers/AuthReducer";


function AuthEmail({isTypeOTP, isForgetPassword}) {
    const dispatch = useDispatch();
    const userCre = useSelector(getUserCredential);
  const [email, setEmail] = useState(userCre?.email ? userCre.email : '') 
  const [otp, setOtp] = useState('')
    console.log(email, "authEmail");
    
  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(15); // 2 minutes = 120 seconds

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

  const sendOTP = async ()=>{
    setSeconds(120)
    dispatch(UserCredential({email}));
    await sendCodeApi(email)
        .then((res)=>{
            console.log(res, "send code");
            alert(res.message);
            if(isForgetPassword){
                navigate('/otp-forget-pass')
            } else {
                navigate('/otp')
            }
        })
        .catch((err)=>{
            console.log(err);
            alert(err.response.data.message);
        })
  }

  const verifyOTP = async ()=>{
    console.log(isForgetPassword, otp);
    if(isForgetPassword){
        await verifyOtpApi({email, code:otp})
        .then((res)=>{
            setOtp('');
            alert(res.message);
            navigate('/new-password')
        })
        .catch((err)=>{
            console.log(err);
            alert(err);
        })  
    } else {
        await verifyOtpApi({email, code:otp})
        .then((res)=>{
            setOtp('');
            alert(res.message);
        })
        .catch((err)=>{
            console.log(err);
            alert(err);
        })
    
        await registerApi({
            name:userCre.name,
            email:userCre.email,
            password:userCre.password
        })
        .then((res)=>{
            navigate('/login')

        })
        .catch((err)=>{
            console.log(err);
            alert(err.response.data.message);
        })
    }
  }
  return (  
    <div class='flex flex-col justify-center items-center min-h-screen  bg-green-600'>
        <div class='bg-green-50 p-10 rounded-2xl shadow-lg'>
            <div className="flex justify-center cursor-pointer">
                <img src={require("../../assets/images/TreePlanting.png")} className="h-50 w-50 object-contain" alt="logo"/>
            </div>
            <div className='p-10'>
                <h1 className='text-5xl font-bold'>
                    { isTypeOTP ? "Nhập OTP" 
                    : isForgetPassword ? "Quên mật khẩu" : "Đăng ký"}
                </h1>
            </div>
            <div className='input-box flex flex-col'>
                {isTypeOTP ?(
                    <>
                        <div className="p-4 rounded-lg">
                            <div className="text-2xl font-mono text-center">
                                {formatTime(seconds)}
                            </div>
                            {seconds === 0 && (
                                <div className="flex justify-center mt-4">
                                <button
                                    className="bg-purple text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={sendOTP}
                                >
                                    Send OTP
                                </button>
                            </div>
                            )}
                        </div>
                        <input value={otp}
                            onChange={(e)=> setOtp(e.target.value)} 
                            type='text' 
                            maxLength={4}
                            placeholder='Nhập OTP' 
                            className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'
                        /> 
                        
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-green-700' onClick={isTypeOTP ? verifyOTP :sendOTP}>Gửi OTP</button>
                    </>
                ):(
                    <>
                        <input value={email}
                            onChange={(e)=> setEmail(e.target.value)} 
                            type='text' 
                            placeholder='Nhập email' 
                            className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'
                        /> 
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-green-700' onClick={sendOTP}>
                            {isForgetPassword ? "Quên mật khẩu" : "Đăng ký"}
                        </button>
                        {/* <div className='flex justify-center items-center'>
                            <div className='w-5/12 h-px bg-slate-400'></div>
                                <p className='w-full text-center text-slate-400'>Hoặc đăng ký với</p>
                            <div className='w-5/12 h-px bg-slate-400'></div>
                        </div>
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-red'>Google</button> */}
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