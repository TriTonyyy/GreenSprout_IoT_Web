import React, {useState, useEffect} from 'react'
import {useNavigate } from "react-router";
import { registerApi, sendCodeApi, sendCodeResetApi, verifyOtpApi } from '../../api/authApi';
import{ useDispatch, useSelector } from 'react-redux';
import { getUserCredential } from '../../redux/selectors/authSelectors';
import { UserCredential } from "../../redux/Reducers/AuthReducer";
import i18n from '../../i18n';
import { apiResponseHandler } from '../../components/Alert/alertComponent';


function AuthEmail({isTypeOTP, isForgetPassword}) {
    const dispatch = useDispatch();
    const userCre = useSelector(getUserCredential);
  const [email, setEmail] = useState(userCre?.email ? userCre.email : '') 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const min2 = 120
  const [otp, setOtp] = useState('')
    console.log("isTypeOTP " + isTypeOTP, isForgetPassword + ' forget pass');
    
  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(15); // 2 minutes = 120 seconds

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setInterval(() => {
            
            if(isTypeOTP){
                setSeconds(prev => prev - 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds,isTypeOTP]);

    useEffect(()=>{
        if(seconds === 0){
            apiResponseHandler(i18n.t("otp_expired"), "error")
        }
    },[seconds])


  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

  const sendOTP = async ()=>{
    if(!emailRegex.test(email)){
      apiResponseHandler(i18n.t("enter_valid_email"), "error")
    } else {
        setSeconds(min2)
        dispatch(UserCredential({...userCre,email}));
        if(isForgetPassword){
            await sendCodeResetApi(email)
                .then((res)=>{
                    console.log(res, "send code");
                    apiResponseHandler(res.message)
                    navigate('/otp-forget-pass')
                })
                .catch((err)=>{
                    console.log(err);
                    apiResponseHandler(err.response.data.message, "error")
                })
        } else {
            await sendCodeApi(email)
                .then((res)=>{
                    console.log(res, "send code");
                    apiResponseHandler(res.message)
                    navigate('/otp')
                })
                .catch((err)=>{
                    console.log(err);
                    apiResponseHandler(err.response.data.message, "error")
                })
        }
    }
  }

  const verifyOTP = async ()=>{
    if(isForgetPassword){
        await verifyOtpApi({email, code:otp})
        .then((res)=>{
            setOtp('');
            apiResponseHandler(res.message)
            navigate('/new-password')
        })
        .catch((err)=>{
            console.log(err);
            apiResponseHandler(err.response.data.message, "error")
        })  
    } else {
        await verifyOtpApi({email, code:otp})
        .then( async(res)=>{
            setOtp('');
            apiResponseHandler(res.message, "error")
            await registerApi({
            name:userCre.name,
            email:userCre.email,
            password:userCre.password
            })
            .then((res)=>{
                console.log(res);
                navigate('/login')
            })
            .catch((err)=>{
                console.log(err);
                apiResponseHandler(err.response.data.message, "error")
            })
        })
        .catch((err)=>{
            console.log(err);
            apiResponseHandler(err.response.data.message, "error")
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
                    { isTypeOTP ? i18n.t("otp_input")
                    : isForgetPassword ? i18n.t("forget_password") : i18n.t("register")}
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
                                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={sendOTP}
                                >
                                    {i18n.t("send_otp")}
                                </button>
                            </div>
                            )}
                        </div>
                        <input value={otp}
                            onChange={(e)=> setOtp(e.target.value)} 
                            type='text' 
                            maxLength={4}
                            placeholder={i18n.t("otp_input")}
                            className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'
                        /> 
                        
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-green-700' onClick={isTypeOTP ? verifyOTP :sendOTP}>{i18n.t("send_otp")}</button>
                    </>
                ):(
                    <>
                        <input value={email}
                            onChange={(e)=> setEmail(e.target.value)} 
                            type='text' 
                            placeholder={i18n.t("email-placeholder")} 
                            className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'
                        /> 
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-green-700' onClick={sendOTP}>
                            {isForgetPassword ? i18n.t("forget_password") : i18n.t("register")}
                        </button>
                        {/* <div className='flex justify-center items-center'>
                            <div className='w-5/12 h-px bg-slate-400'></div>
                                <p className='w-full text-center text-slate-400'>Hoặc đăng ký với</p>
                            <div className='w-5/12 h-px bg-slate-400'></div>
                        </div>
                        <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-red'>Google</button> */}
                        {isTypeOTP ? (
                        <h2 className='p-1 m-1'>{i18n.t("did_not_have_account")}<a href='/register' className='text-stone-950 font-bold'>{i18n.t("register")}</a></h2>
                        ): (
                        <h2 className='p-1 m-1'>{i18n.t("have_account")}<a href='/login' className='text-stone-950 font-bold'>{i18n.t("login")}</a></h2>

                )}
                    </>
                )}
                
            </div>
        </div>
    </div>
  )
}

export default AuthEmail;