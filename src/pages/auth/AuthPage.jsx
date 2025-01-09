import React from 'react'

function AuthPage({isLogin}) {
  const test = isLogin;
  return (  
    <div class='flex flex-col justify-center items-center min-h-screen bg-bgPurple '>
        <div class='bg-white p-10 rounded-2xl shadow-lg'>
            <div className='p-10'>
                <h1 className='text-5xl font-bold'>{ isLogin ? "Đăng nhập" : "Đăng ký"}</h1>
            </div>
            <div className='input-box flex flex-col'>
                <input type='text' placeholder='Tên đăng nhập' className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'/> 
                <input type='password' placeholder='Mật khẩu' className='border-2 border-gray-300 p-2 m-2 rounded-lg bg-gray-100 w-full'/>
                {isLogin && <a href='/' className='p-1 m-1'>Quên mật khẩu</a>}
                <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-purple'>{ isLogin ? "Đăng nhập" : "Đăng ký"}</button>
                <div className='flex justify-center items-center'>
                  <div className='w-5/12 h-px bg-slate-400'></div>
                    <p className='w-full text-center text-slate-400'>Hoặc đăng ký với</p>
                  <div className='w-5/12 h-px bg-slate-400'></div>
                </div>
                <button className='bg-blue-500 text-white p-2 m-2 rounded-xl bg-red'>Google</button>
                {isLogin ? (
                  <h2 className='p-1 m-1'>Bạn chưa có tài khoản? <a href='/register' className='text-stone-950 font-bold'>Đăng ký</a></h2>
                ): (
                <h2 className='p-1 m-1'>Bạn đã có tài khoản? <a href='/login' className='text-stone-950 font-bold'>Đăng nhập</a></h2>

                )}
            </div>
        </div>
    </div>
  )
}

export default AuthPage;