import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent.jsx";
import FooterComponent from "../../components/FooterComponent/FooterComponent.jsx";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  console.log(user, "user");

  const fetchUserDevices = async () => {
    try {
      await getUserInfoAPI()
        .then((res) => {
          setUser(res.data);
        })
        .catch((err)=>{
          console.log(err);
        })

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
            <div className="flex-grow mb-10 min-h-screen">
              <div className="flex justify-between items-center px-10 py-10">
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
                  <button className="bg-green-700 text-white rounded-2xl p-2">
                    <Plus
                      size={24}
                      onClick={() =>
                        user &&
                        addDevicePopup(
                          { userId: user._id, role: "member" },
                          fetchUserDevices
                        )
                      }
                    />
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
            </div>
          </div>
          <FooterComponent />
        </>
      ) : null}
    </div>
  );
}

export default HomePage;
