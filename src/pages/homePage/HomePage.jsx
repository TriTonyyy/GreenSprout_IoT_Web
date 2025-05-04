import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent.jsx";
import FooterComponent from "../../components/FooterComponent/FooterComponent.jsx";
import {
  GardenItem,
  GardenItemSkeleton,
} from "./homePageComponents/GardenItem.jsx";
import { Plus, RefreshCcw } from "lucide-react";
import { getUserInfoAPI } from "../../api/authApi.js";
import { getGardenby, getGardenByDevice } from "../../api/deviceApi.js";
import AddDeviceButton from "./homePageComponents/addDevice.jsx";
import "react-loading-skeleton/dist/skeleton.css"; // To style the skeleton
import {
  addDevicePopup,
  apiResponseHandler,
} from "../../components/Alert/alertComponent.jsx";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar.jsx";
import i18n from "../../i18n";

function HomePage() {
  const [deviceData, setDeviceData] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUserDevices = async () => {
    try {
      await getUserInfoAPI()
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      const deviceResponse = await getGardenby();
      const deviceIds = deviceResponse.data || [];

      if (deviceIds.length === 0) {
        setDeviceData([]); // No devices found
        return;
      }

      // Fetch all devices concurrently
      const devicePromises = deviceIds.map(async (deviceId) => {
        try {
          const res = await getGardenByDevice(deviceId);
          return res?.data || null;
        } catch (err) {
          apiResponseHandler(err); // Handle error response
          return null;
        }
      });

      const deviceResponses = await Promise.all(devicePromises);
      setDeviceData(deviceResponses.filter((device) => device !== null)); // Remove failed devices
    } catch (error) {
      setDeviceData(null); // Reset device data state on error
    }
  };

  useEffect(() => {
    fetchUserDevices(); // Initial fetch
    const intervalId = setInterval(fetchUserDevices, 10000); // Fetch every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {user ? (
        <>
          <HeaderComponent gardens={deviceData || []} />
          <div className="flex">
            {/* Sidebar */}
            <SideNavigationBar />
            {/* Main Content Area */}
            <div className="w-[80%] h-[80%] flex-grow min-h-screen bg-green-50">
              <div className="flex justify-between items-center p-10">
                <h1 className="text-4xl font-bold">
                  <span className="text-green-500">
                    {i18n.t("garden_of_account", { accountName: user.name })}
                  </span>
                </h1>
                <div className="flex items-center gap-4">
                  <button
                    className="bg-gray-700 text-white rounded-2xl p-2"
                    onClick={fetchUserDevices}
                  >
                    <RefreshCcw size={24} />
                  </button>
                  {deviceData && deviceData.length < 9 && (
                    <button
                      className="bg-green-700 text-white rounded-2xl p-2"
                      onClick={() =>
                        user &&
                        addDevicePopup(
                          { userId: user._id, role: "member" },
                          fetchUserDevices
                        )
                      }
                    >
                      <Plus size={24} />
                    </button>
                  )}
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
                      key={device?._id}
                      id={device?.id_esp}
                      name={device?.name_area}
                      sensors={device?.sensors}
                      controls={device?.controls}
                      img_area={device?.img_area}
                    />
                  ))
                ) : deviceData && deviceData.length <= 9 ? (
                  <AddDeviceButton
                    onClick={() =>
                      user &&
                      addDevicePopup(
                        { userId: user._id, role: "member" },
                        fetchUserDevices
                      )
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>
          <FooterComponent />
        </>
      ) : null}
    </div>
  );
}

export default HomePage;
