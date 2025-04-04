import React, {useState, useEffect} from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent'
import { Nav } from 'react-bootstrap'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import { getUserInfoAPI } from '../../api/AuthApi';

export default function AccountPage() {
    const [userInfo, setUserInfo] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");

    console.log(userInfo);
    

    useEffect(()=>{
        getUserInfoAPI()
        .then((res)=>{
            setUserInfo(res.data);
        })
        .catch((err)=>{
            console.log(err);
            
        })
    }, [])
    useEffect(()=>{
        setEmail(userInfo?.email ? userInfo.email : '');
        setName(userInfo?.name ? userInfo.name : '');
    }, [userInfo])
  return (
    <div>
        <HeaderComponent/>
        <div className='flex-col flex'>
            {/* <NavBarComponent/> */}
            <div className='mx-10 my-5 justify-between'>
                <h1 className='text-3xl'><strong>Tài Khoản</strong></h1>
                <div className='flex pt-5  justify-between items-center '>
                    <div className='flex'>
                        <img onClick={()=>{console.log("dasd")}} src={require("../../assets/images/AvatarDefault.png")} className='py-5' alt='avatar'/>
                        <h2 className='text-2xl p-4'>
                            Ảnh cá nhân <br/>
                            PNG, JPEG dưới 5MB <br/>
                        </h2>
                    </div>
                    <button className='bg-gray-300 p-5 rounded-2xl text-xl border-2 border-gray-500 hover:bg-gray-400'>
                        Tải hình ảnh lên
                    </button>
                </div>

                <div className='pt-5  justify-between items-center border-b-2 pb-4 '>
                    <h2 className='text-2xl '><strong>Họ và tên</strong></h2>
                    <input type='text' className='border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full' placeholder='Nhập họ và tên' value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
                
                <div className='pt-5  justify-between items-center border-b-2 pb-4 '>
                    <h2 className='text-2xl '><strong>Email</strong></h2>
                    <input type='email' className='border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>

                <div className='pt-5  justify-between items-center border-b-2 pb-4 '>
                    <h2 className='text-2xl '><strong>Mật khẩu</strong></h2>
                    <input type='password' className='border-2 border-gray-300 p-2 mt-2 mr-2 mb-2 rounded-lg bg-gray-100 w-full' placeholder='Mật Khẩu' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
            </div>
        </div>
        
    </div>
  )
}
