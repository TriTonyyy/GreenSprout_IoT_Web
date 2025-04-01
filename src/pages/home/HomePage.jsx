import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { getGardenby, getUserInfoAPI } from "../../api/AuthApi";
import AddDeviceButton from "../../components/homePage/addDevice";
import "react-loading-skeleton/dist/skeleton.css"; // To style the skeleton

function HomePage() {
  const token = useSelector(getTokenUser);
  console.log(token, "token in home page");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [user, setUser] = useState(null);
  const BASEURL = "https://capstone-project-iot-1.onrender.com/api/";
  const Local = "http://192.168.1.214:8000/api/";

  useEffect(() => {
    if (!token) return;

    const fetchUserDevices = async () => {
      try {
        // ✅ Fetch authenticated user profile
        const userResponse = await getUserInfoAPI();
        const userData = userResponse.data.data;
        console.log("userData", userData);
        setUser(userData);

        // ✅ Fetch user's garden devices
        const deviceResponse = await getGardenby();
        const deviceIds = deviceResponse.data.data; // ['6CE6C6FC8AD4']
        console.log("deviceIds", deviceIds);

        if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
          console.log("No devices found.");
          setDeviceData([]); // ✅ Show empty state if no devices
          return;
        }

        // ✅ Fetch device details
        const devicePromises = deviceIds.map((deviceId) =>
          axios
            .get(`${BASEURL}device/detailDeviceBy/${deviceId}`)
            .catch((err) => {
              console.error(`Error fetching device ${deviceId}:`, err);
              return null; // Return null if the device fetch fails
            })
        );

        const deviceResponses = await Promise.all(devicePromises);
        const validDevices = deviceResponses
          .filter((res) => res && res.data && res.data.data)
          .map((res) => res.data.data); // Filter out any invalid responses

        // ✅ Fetch sensors and controls for valid devices
        console.log("validDevices", validDevices);

        const allSensor = [];
        const allControl = [];
        validDevices.forEach((device) => {
          // Fetch sensors
          device.sensors.forEach(({ sensorId }) =>
            allSensor.push(
              axios
                .get(`${BASEURL}sensor/detailSensorBy/${sensorId}`)
                .catch((err) => {
                  console.error(`Error fetching sensor ${sensorId}:`, err);
                  return null;
                })
            )
          );

          // Fetch controls
          device.controls.forEach(({ controlId }) =>
            allControl.push(
              axios
                .get(`${BASEURL}control/detailControlBy/${controlId}`)
                .catch((err) => {
                  console.error(`Error fetching control ${controlId}:`, err);
                  return null;
                })
            )
          );
        });

        const [sensorsResponse, controlsResponse] = await Promise.all([
          Promise.all(allSensor),
          Promise.all(allControl),
        ]);

        console.log("sensorsResponse", sensorsResponse);
        console.log("controlsResponse", controlsResponse);

        // Map sensors and controls, filtering only the relevant ones
        const sensorsMap = Object.fromEntries(
          sensorsResponse
            .filter(
              (res) =>
                res &&
                res.data &&
                (res.data.type === "temperature" ||
                  res.data.type === "moisture")
            ) // ✅ Keep only temperature and moisture
            .map((res) => [res.data._id, res.data])
        );

        const controlsMap = Object.fromEntries(
          controlsResponse
            .filter(
              (res) =>
                res &&
                res.data &&
                (res.data.name === "light" || res.data.name === "water")
            ) // ✅ Keep only light and water
            .map((res) => [res.data._id, res.data])
        );

        // Attach sensor and control data to devices
        const finalDevices = validDevices.map((device) => {
          const updatedDevice = {
            ...device,
            sensors: device.sensors.map(({ sensorId }) => ({
              ...sensorsMap[sensorId],
              value: sensorsMap[sensorId]?.value,
            })),
            controls: device.controls.map(({ controlId }) => ({
              ...controlsMap[controlId],
              status: controlsMap[controlId]?.status,
            })),
          };

          return updatedDevice;
        });

        setDeviceData(finalDevices);
        console.log("Final Device Data:", finalDevices);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDeviceData(null);
      }
    };

    fetchUserDevices();
  }, [token, BASEURL]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <HeaderComponent />
      <div className="flex justify-between items-center px-10 py-10">
        <h1 className="text-4xl font-bold">
          Vườn Tiêu <span className="text-green-500">Bình Phước</span>
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
                <p className="font-medium text-gray-700">Trạng thái tưới:</p>
                <ToggleSwitch
                  isOn={isIrrigationStatus}
                  onToggle={() => setIsIrrigationStatus(!isIrrigationStatus)}
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
            <Plus size={24} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-8 px-10 py-8 min-h-screen">
        {deviceData === null ? (
          // Show Skeleton Loader if data is still being fetched
          <GardenItemSkeleton />
        ) : deviceData.length > 0 ? (
          deviceData.map((device) => (
            <GardenItem
              key={device.id_esp}
              id={device.id_esp}
              name={device.name || device.id_esp}
              sensors={device.sensors}
              controls={device.controls}
            />
          ))
        ) : (
          <AddDeviceButton />
        )}
      </div>
      <FooterComponent />
    </div>
  );
}

export default HomePage;
