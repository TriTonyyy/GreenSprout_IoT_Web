import React, {useEffect, useState} from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent'
import SideNavigationBar from '../../components/SideNavigationBar/SideNavigationBar'
import { getUserInfoAPI } from '../../api/authApi';
import { getAllDeviceApi } from '../../api/adminApi';
import { getGardenByDevice } from '../../api/deviceApi';
import { addDevicePopup, apiResponseHandler } from '../../components/Alert/alertComponent';
import i18n from '../../i18n';
import { Plus, RefreshCcw } from 'lucide-react';
import { GardenItem, GardenItemSkeleton } from '../homePage/homePageComponents/GardenItem';
import AddDeviceButton from '../homePage/homePageComponents/addDevice';
import PagnipationComponent from '../../components/Pagnipation/PagnipationComponent';

export default function AdminHomePage() {
    const [deviceData, setDeviceData] = useState(null);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage]= useState(1);
    const [totalPage, setTotalPage]= useState(1);
    const limit = 9;
    const fetchUserDevices = async () => {
        try {
          await getUserInfoAPI()
            .then((res) => {
              setUser(res.data);
            })
            .catch((err)=>{
              console.log(err);
            })
    
            getAllDeviceApi(currentPage,limit)
            .then((res)=>{
              // setCurrentPage(res.currentPage);
              setTotalPage(res.totalPages)
              setDeviceData(res.data);
            })
            .catch((err)=>{
                apiResponseHandler(err.data.message)
            })
        } catch (error) {
          setDeviceData(null); // Reset device data state on error
        }
      };
    const handlePageChange = (page)=>{
      setCurrentPage(page);
    }
    useEffect(() => {
        fetchUserDevices(); // Initial fetch
        const intervalId = setInterval(fetchUserDevices, 10000); // Fetch every 10 seconds
        return () => clearInterval(intervalId);
    }, []);
    useEffect(()=>{
      getAllDeviceApi(currentPage, limit)
        .then((res)=>{
          setTotalPage(res.totalPages)
          setDeviceData(res.data);
        })
        .catch((err)=>{
          apiResponseHandler(err.data.message)
        })
    }, [currentPage])
  return (
    <div>
        <HeaderComponent gardens={deviceData || []}/>
        <div className="flex">
            {/* Sidebar */}
            <SideNavigationBar />
            {/* Main Content Area */}
            <div className="w-full flex-grow min-h-screen">
              <div className="flex justify-between items-center px-10 py-10">
                <h1 className="text-4xl font-bold">
                  <span className="text-green-500">
                    {/* {i18n.t("garden_of_account", { accountName: user?.name })} */}
                    {"Trang " + currentPage + " of " + totalPage }
                  </span>
                </h1>
                <div className="flex items-center gap-4">
                  <button
                    className="bg-gray-700 text-white rounded-2xl p-2"
                    onClick={fetchUserDevices}
                  >
                    <RefreshCcw size={24} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-10 mx-2">
                {deviceData === null ? (
                  <>
                    <GardenItemSkeleton />
                    <GardenItemSkeleton />
                    <GardenItemSkeleton />
                  </>
                ) : deviceData.length > 0 ? (
                  deviceData.map((device) => (
                    <GardenItem
                      key={device._id}
                      id={device.id_esp}
                      name={device.name_area}
                      sensors={device.sensors}
                      controls={device.controls}
                      img_area={device.img_area}
                    />
                  ))
                ) : (
                  <AddDeviceButton
                    onClick={() =>
                      user &&
                      addDevicePopup(
                        { userId: user._id, role: "member" },
                        fetchUserDevices // Callback to refresh device list after adding
                      )
                    }
                  />
                )}
                
              </div>
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
