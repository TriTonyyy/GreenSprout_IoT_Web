import React from 'react'
import { Search } from 'lucide-react';

function SearchBarComponent(){
  const searchData=()=>{
    console.log("wqeqweq");
  }
  return (
    <div className='p-5 h-auto '>
      <div className='flex items-center bg-gray-100 rounded-lg'>
        <input type='text' className='p-2 rounded-lg bg-gray-100' placeholder='Tìm kiếm'/>
        <div onClick={searchData}>
          <Search size={48} className="p-2" />
        </div>
      </div>
    </div>
  )
}

function HeaderComponent() {
  const headerFont = 'Kodchasan';
  return (
    <div className='flex items-center p-1 border-b-2'>
      <div className='flex justify-between items-center w-full'>
        <div className='flex items-center'>
          <img src={require("../../assets/images/TreePlanting.png")} className='w-24 h-auto max-w-full' alt='logo'/>
          <h1 className='text-4xl p-4'style={{ fontFamily: 'Kannada MN' }}>GreenSprout</h1>
          <a href='#' className='ml-5 mr-5 text-2xl p-4'style={{ fontFamily: headerFont }}>Lịch trình tưới</a>
          <a href='#' className='ml-5 mr-5 text-2xl p-4'style={{ fontFamily: headerFont }}>Thống kê</a>
        </div>
        <div className='flex items-center'>
          <SearchBarComponent/>
          <div className='flex items-center'>
            <h2 className='text-2xl p-4' style={{ fontFamily: headerFont }}>User Name</h2>
            <img onClick={()=>{console.log("dasd");
            }} src={require("../../assets/images/AvatarDefault.png")} className='w-18 h-auto max-w-full' alt='avatar'/>

          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderComponent;
