import React from 'react'
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getUserCredential } from '../../redux/selectors/authSelectors';
import { useNavigate } from "react-router";

function SearchBarComponent() {
  const searchData = () => {
    console.log("wqeqweq");
  };
  return (
    <div className="p-5 h-auto ">
      <div className="flex items-center bg-gray-100 rounded-lg">
        <input
          type="text"
          className="p-2 rounded-lg bg-gray-100"
          placeholder="Tìm kiếm"
        />
        <div onClick={searchData}>
          <Search size={48} className="p-2" />
        </div>
      </div>
    </div>
  );
}

function HeaderComponent({titleScheduleColor="black", titleReportColor ='black'}) {

  const headerFont = 'Kodchasan';
  const user = useSelector(getUserCredential);
  console.log(user, "asdasdasd");
  const navigate = useNavigate();
  return (
    <div className="flex items-center p-1 border-b-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img
              src={require("../../assets/images/TreePlanting.png")}
              className="w-24 h-auto max-w-full"
              alt="logo"
            />
            <h1 className="text-4xl p-4" style={{ fontFamily: "Kannada MN" }}>
              GreenSprout
            </h1>
          </div>
          <a
            href="/schedule"
            className={`ml-5 mr-5 text-2xl p-4 text-red-900`}
            style={{ fontFamily: headerFont, color: titleScheduleColor }}
          >
            Lịch trình tưới
          </a>
          <a
            href="#"
            className="ml-5 mr-5 text-2xl p-4"
            style={{ fontFamily: headerFont, color: titleReportColor }}
          >
            Thống kê
          </a>
        </div>
        <div className='flex items-center'>
          <SearchBarComponent/>
          <div className='flex items-center'>
            <h2 className='text-2xl p-4' style={{ fontFamily: headerFont }}>User name</h2>
            <img onClick={()=>{console.log("dasd");
            }} src={require("../../assets/images/AvatarDefault.png")} className='w-18 h-auto max-w-full' alt='avatar'/>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderComponent;
