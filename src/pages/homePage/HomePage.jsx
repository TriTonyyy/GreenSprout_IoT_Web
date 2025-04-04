import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent.jsx";
import FooterComponent from "../../components/FooterComponent/FooterComponent.jsx";
import {
  GardenItem,
  GardenItemSkeleton,
} from "./homePageComponents/GardenItem.jsx";
import { Plus } from "lucide-react";
import { getUserInfoAPI } from "../../api/AuthApi.js";
import {
  getGardenby,
  getGardenByDevice,
  getControlById,
  getSensorById,
} from "../../api/deviceApi.js";
import AddDeviceButton from "./homePageComponents/addDevice.jsx";
import "react-loading-skeleton/dist/skeleton.css"; // To style the skeleton
import {
  addDevicePopup,
  apiResponseHandler,
} from "../../components/Alert/alertComponent.jsx";

function HomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUserDevices = async () => {
    try {
      // ✅ Fetch user info
      let userData = null;
      try {
        const userResponse = await getUserInfoAPI();
        userData = userResponse.data;
        setUser(userData); // Set user data
      } catch (err) {
        console.error("Error fetching user info:", err);
        apiResponseHandler(
          err.response?.data?.message || "Error fetching user info"
        );
        return;
      }
      // ✅ Fetch user's gardens (devices)
      let deviceIds = [];
      try {
        const deviceResponse = await getGardenby();
        deviceIds = deviceResponse.data.data || [];
      } catch (err) {
        console.error("Error fetching gardens:", err);
        apiResponseHandler(
          err.response?.data?.message || "Error fetching gardens"
        );
        return;
      }
      // console.log(deviceData);

      if (deviceIds.length === 0) {
        // console.log("No devices found.");
        setDeviceData([]); // Show empty state if no devices
        return;
      }

      // ✅ Fetch garden devices
      const devicePromises = deviceIds.map(async (deviceId) => {
        try {
          const res = await getGardenByDevice(deviceId);
          return res?.data?.data || null;
        } catch (err) {
          console.error(`Error fetching device ${deviceId}:`, err);
          return null;
        }
      });

      const deviceResponses = await Promise.all(devicePromises);
      const validDevices = deviceResponses.filter(Boolean);

      // ✅ Get all sensor & control IDs from valid devices
      const sensorIds = validDevices.flatMap((device) =>
        device.sensors ? device.sensors.map(({ sensorId }) => sensorId) : []
      );
      const controlIds = validDevices.flatMap((device) =>
        device.controls ? device.controls.map(({ controlId }) => controlId) : []
      );

      // ✅ Fetch all sensors & controls in parallel
      let sensorsResponse = [];
      let controlsResponse = [];

      try {
        sensorsResponse = await Promise.all(
          sensorIds.map((sensorId) =>
            getSensorById(sensorId)
              .then((res) => res?.data || null)
              .catch((err) => {
                console.error(`Error fetching sensor ${sensorId}:`, err);
                return null;
              })
          )
        );

        controlsResponse = await Promise.all(
          controlIds.map((controlId) =>
            getControlById(controlId)
              .then((res) => res?.data || null)
              .catch((err) => {
                console.error(`Error fetching control ${controlId}:`, err);
                return null;
              })
          )
        );
      } catch (err) {
        console.error("Error fetching sensors or controls:", err);
        apiResponseHandler("Error fetching sensors or controls");
        return;
      }

      // ✅ Create sensor and control maps for easy access
      const sensorsMap = Object.fromEntries(
        sensorsResponse
          .filter(
            (sensor) =>
              sensor &&
              (sensor.type === "temperature" || sensor.type === "moisture")
          )
          .map((sensor) => [sensor._id, sensor])
      );

      const controlsMap = Object.fromEntries(
        controlsResponse
          .filter(
            (control) =>
              control && (control.name === "light" || control.name === "water")
          )
          .map((control) => [control._id, control])
      );

      // ✅ Attach sensor and control data to devices
      const finalDevices = validDevices.map((device) => ({
        ...device,
        sensors: (device.sensors || []).map(({ sensorId }) => ({
          ...sensorsMap[sensorId], // Attach sensor data
          value:
            sensorsMap[sensorId]?.value !== undefined &&
            sensorsMap[sensorId]?.value !== null
              ? sensorsMap[sensorId]?.value
              : "---", // Use fallback value if sensor value is undefined or null
        })),
        controls: (device.controls || []).map(({ controlId }) => ({
          ...controlsMap[controlId], // Attach control data
          status: controlsMap[controlId]?.status ?? false, // Default to false if status is missing
        })),
      }));

      setDeviceData(finalDevices); // Save final devices with attached data
    } catch (error) {
      console.error("Error fetching data:", error);
      setDeviceData(null); // In case of an error, reset the device data state
    }
  };

  // ✅ Call it inside useEffect
  useEffect(() => {
    fetchUserDevices();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <HeaderComponent />
          <div className="flex justify-between items-center px-10 py-10">
            <h1 className="text-4xl font-bold">
              Vườn của <span className="text-green-500">{user.name}</span>
            </h1>
            <div className="flex items-center gap-4">
              <button className="bg-green-700 text-white rounded-2xl p-2">
                <Plus
                  size={24}
                  onClick={
                    () =>
                      user &&
                      addDevicePopup(
                        { userId: user._id, role: "member" },
                        fetchUserDevices
                      ) // ✅ Pass function
                  }
                />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 px-10 py-8 min-h-screen">
            {deviceData === null ? (
              <div className="w-full flex justify-center items-center">
                {/* Show skeleton only when deviceData is null (loading state) */}
                <GardenItemSkeleton />
              </div>
            ) : deviceData.length > 0 ? (
              deviceData.map((device) => (
                <GardenItem
                  key={device.id_esp}
                  id={device.id_esp}
                  {...device}
                />
              ))
            ) : (
              <AddDeviceButton onClick={addDevicePopup} />
            )}
          </div>
        </>
      ) : null}
      <FooterComponent />
    </div>
  );
}

export default HomePage;
