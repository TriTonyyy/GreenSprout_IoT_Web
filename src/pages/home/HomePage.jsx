import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import {
  GardenItem,
  GardenItemSkeleton,
} from "../../components/GardenItem/GardenItem";
import { ChevronDown, Plus } from "lucide-react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ToggleSwitch } from "../../components/ToggleComponent/ToggleSwitch";
import { useSelector } from "react-redux";
import { getTokenUser } from "../../redux/selectors/authSelectors";
import { getUserInfoAPI } from "../../api/AuthApi";
import {
  getGardenby,
  getGardenByDevice,
  getControlById,
  getSensorById,
} from "../../api/deviceApi.js";
import AddDeviceButton from "../../components/homePage/addDevice";
import "react-loading-skeleton/dist/skeleton.css"; // To style the skeleton
import { addDevicePopup } from "../../components/Alert/alertComponent.js";

function HomePage() {
  const token = useSelector(getTokenUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchUserDevices = async () => {
      try {
        // ✅ Fetch user info
        const userResponse = await getUserInfoAPI();
        const userData = userResponse.data.data;
        setUser(userData);

        // ✅ Fetch user's gardens
        const deviceResponse = await getGardenby();
        const deviceIds = deviceResponse.data.data || [];

        if (deviceIds.length === 0) {
          console.log("No devices found.");
          setDeviceData([]); // ✅ Show empty state
          return;
        }

        // ✅ Fetch garden devices
        const devicePromises = deviceIds.map(async (deviceId) =>
          getGardenByDevice(deviceId)
            .then((res) => res?.data?.data || null)
            .catch((err) => {
              console.error(`Error fetching device ${deviceId}:`, err);
              return null;
            })
        );

        const deviceResponses = await Promise.all(devicePromises);
        const validDevices = deviceResponses.filter(Boolean);

        // ✅ Get all sensor & control IDs
        const sensorIds = validDevices.flatMap((device) =>
          device.sensors ? device.sensors.map(({ sensorId }) => sensorId) : []
        );
        const controlIds = validDevices.flatMap((device) =>
          device.controls
            ? device.controls.map(({ controlId }) => controlId)
            : []
        );

        // ✅ Fetch all sensors & controls
        const [sensorsResponse, controlsResponse] = await Promise.all([
          Promise.all(
            sensorIds.map((sensorId) =>
              getSensorById(sensorId)
                .then((res) => res?.data || null)
                .catch((err) => {
                  console.error(`Error fetching sensor ${sensorId}:`, err);
                  return null;
                })
            )
          ),
          Promise.all(
            controlIds.map((controlId) =>
              getControlById(controlId)
                .then((res) => res?.data || null)
                .catch((err) => {
                  console.error(`Error fetching control ${controlId}:`, err);
                  return null;
                })
            )
          ),
        ]);

        // ✅ Create sensor and control maps
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
                control &&
                (control.name === "light" || control.name === "water")
            )
            .map((control) => [control._id, control])
        );

        // ✅ Attach data to devices after ensuring all sensors and controls are fetched
        const finalDevices = validDevices.map((device) => ({
          ...device,
          sensors: (device.sensors || []).map(({ sensorId }) => ({
            ...sensorsMap[sensorId],
            value:
              sensorsMap[sensorId]?.value !== undefined &&
              sensorsMap[sensorId]?.value !== null
                ? sensorsMap[sensorId]?.value
                : "---", // Only fallback to "---" for undefined or null values
          })),
          controls: (device.controls || []).map(({ controlId }) => ({
            ...controlsMap[controlId],
            status: controlsMap[controlId]?.status ?? false, // Default status if missing
          })),
        }));

        setDeviceData(finalDevices);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDeviceData(null);
      }
    };

    fetchUserDevices();
  }, [token]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                Công tắc chung <ChevronDown size={24} />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>
                  <div className="flex justify-between items-center w-full">
                    <p className="font-medium text-gray-700">
                      Trạng thái tưới:
                    </p>
                    <ToggleSwitch
                      isOn={isIrrigationStatus}
                      onToggle={() =>
                        setIsIrrigationStatus(!isIrrigationStatus)
                      }
                    />
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-gray-700">Đèn:</span>
                    <ToggleSwitch
                      isOn={isLightStatus}
                      onToggle={() => setIsLightStatus(!isLightStatus)}
                    />
                  </div>
                </MenuItem>
              </Menu>
              <button className="bg-green-700 text-white rounded-2xl p-2">
                <Plus
                  size={24}
                  onClick={() =>
                    user && addDevicePopup({ userId: user._id, role: "member" })
                  }
                />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 px-10 py-8 min-h-screen">
            {deviceData === null ? (
              <GardenItemSkeleton />
            ) : deviceData.length > 0 ? (
              deviceData.map((device) => (
                <GardenItem key={device.id_esp} {...device} />
              ))
            ) : (
              <AddDeviceButton />
            )}
          </div>
        </>
      ) : null}
      <FooterComponent />
    </div>
  );
}

export default HomePage;
