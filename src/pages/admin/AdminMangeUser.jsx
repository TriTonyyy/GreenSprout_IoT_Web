import React, { useEffect, useState } from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent'
import SideNavigationBar from '../../components/SideNavigationBar/SideNavigationBar'
import { getAllUserApi } from '../../api/adminApi';
import { apiResponseHandler } from '../../components/Alert/alertComponent';
import UserCardComponent from '../../components/UserCard/UserCardComponent';
import PagnipationComponent from '../../components/Pagnipation/PagnipationComponent';
import { RefreshCcw } from 'lucide-react';
import { GardenItemSkeleton } from '../homePage/homePageComponents/GardenItem';

export default function AdminMangeUser() {
  const [users, setUsers]= useState(null);
  const [currentPage, setCurrentPage]= useState(1);
  const [totalPage, setTotalPage]= useState(1);
  const limit = 9;

  const handlePageChange = (page)=>{
    setCurrentPage(page);
  }

  const getData =()=>{
    getAllUserApi(currentPage, limit)
    .then((res)=>{
      setTotalPage(res.totalPages)
      setUsers(res.data);
    })
    .catch((err)=>{
      apiResponseHandler(err)
    })
  }

  useEffect(()=>{
    getData()
  }, [])
  
  return (
    <div>
        <HeaderComponent/>
        <div className='flex'>
            <SideNavigationBar/>
            <div className='flex flex-wrap gap-x-4 mx-4 w-full justify-center'>
              <div className='w-full mt-6'>
                <h1 className='text-3xl font-bold text-green-500 text-center'>Manage user</h1>
                <div className='flex justify-between mb-5 mx-5'>
                  <h1 className="text-3xl">
                    <span className="text-green-500">
                      {/* {i18n.t("garden_of_account", { accountName: user?.name })} */}
                      {currentPage + " of " + totalPage }
                    </span>
                  </h1>
                  <div className="flex items-center gap-4">
                    <button
                      className="bg-gray-700 text-white rounded-2xl p-2"
                      onClick={getData}
                    >
                      <RefreshCcw size={24} />
                    </button>
                  </div>
                </div>
              </div>
              
              {users === null ? (
                <>
                  <GardenItemSkeleton />
                  <GardenItemSkeleton />
                  <GardenItemSkeleton />
                </>
              ) :users.length > 0 ?
              
              users.map((item)=>(
                <UserCardComponent user={item}/>
              )) 
              :<h1 className='text-4xl text-center'>Không có dữ liệu</h1>}
              <PagnipationComponent
                totalPages = {totalPage}
                currentPage = {currentPage}
                onPageChange= {handlePageChange}
              />
            </div>
        </div>
    </div>
  )
}
