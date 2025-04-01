import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import GardenItem from "../../components/GardenItem/GardenItem";
import { ChevronDown, Plus } from "lucide-react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ToggleSwitch } from "../../components/ToggleComponent/ToggleSwitch";
import { useSelector } from "react-redux";
import { getTokenUser } from "../../redux/selectors/authSelectors";

function HomePage() {
  const token = useSelector(getTokenUser);
  console.log(token, "token in home page");
  
  const test =[1,2,3,4,5,6,7,8,9,10]
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const linkApi = "http://192.168.1.214:8000/api/";

  useEffect(() => {
    const fetchUserDevices = async () => {
      try {
        console.log("Token:", token);

        // ✅ Fetch authenticated user profile
        const userResponse = await axios.get("/user/profile");
        const userId = userResponse.data.data.userId; // ✅ Get user ID dynamically

        console.log("User ID:", userId);
        // ✅ Fetch user's device IDs dynamically
        const deviceResponse = await axios.get(
          `/user/getDeviceIdsByUserId/${userId}`
        );
        const deviceIds = deviceResponse.data.data;

        if (!deviceIds || deviceIds.length === 0) {
          console.log("No devices found.");
          setDeviceData([]); // ✅ Show empty state if no devices
          return;
        }

        console.log("Device IDs:", deviceIds);
        // Fetch each device's details
        const devicePromises = deviceIds.map((deviceId) =>
          axios.get(`/device/detailDeviceBy/${deviceId}`)
        );

        const deviceResponses = await Promise.all(devicePromises);
        const validDevices = deviceResponses.map((res) => res.data.data);

        setDeviceData(validDevices);
      } catch (error) {
        console.error("Error fetching user devices:", error);
        setDeviceData(null); // Show error state
      }
    };
    if (token) fetchUserDevices(); // ✅ Fetch only if token exists
  }, [token]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // Fetch device IDs associated with the user
        const response = await axios.get(
          `${linkApi}user/getDeviceIdsByUserId/1`
        );
        const deviceIds = response.data.data;

        if (!deviceIds || deviceIds.length === 0) {
          console.log("No devices found for this user.");
          setDeviceData([]); // Set empty array if no devices
          return;
        }

        console.log("Device IDs:", deviceIds);

        //  Fetch details for each device
        const devicePromises = deviceIds.map((deviceId) =>
          axios
            .get(`${linkApi}device/detailDeviceBy/${deviceId}`)
            .catch((error) => {
              console.log(`Error fetching device ${deviceId}:`, error);
              return null;
            })
        );

        const deviceResponses = await Promise.all(devicePromises);
        const validDevices = deviceResponses
          .filter(Boolean)
          .map((res) => res.data.data);

        // Fetch sensors and controls for all devices
        const allSensorPromises = [];
        const allControlPromises = [];

        validDevices.forEach((device) => {
          device.sensors.forEach(({ sensorId }) => {
            allSensorPromises.push(
              axios
                .get(`${linkApi}sensor/detailSensorBy/${sensorId}`)
                .catch((error) => {
                  console.log(`Error fetching sensor ${sensorId}:`, error);
                  return null;
                })
            );
          });

          device.controls.forEach(({ controlId }) => {
            allControlPromises.push(
              axios
                .get(`${linkApi}control/detailControlBy/${controlId}`)
                .catch((error) => {
                  console.log(`Error fetching control ${controlId}:`, error);
                  return null;
                })
            );
          });
        });

        const [sensorsResponse, controlsResponse] = await Promise.all([
          Promise.all(allSensorPromises),
          Promise.all(allControlPromises),
        ]);

        // Step 4: Map sensors and controls by ID
        const sensorsMap = {};
        sensorsResponse.filter(Boolean).forEach((res) => {
          const sensorData = res.data.data || res.data;
          sensorsMap[sensorData._id] = sensorData;
        });

        const controlsMap = {};
        controlsResponse.filter(Boolean).forEach((res) => {
          const controlData = res.data.data || res.data;
          controlsMap[controlData._id] = controlData;
        });

        // Step 5: Attach sensor and control data to each device
        const finalDevices = validDevices.map((device) => ({
          ...device,
          sensors: device.sensors.map(({ sensorId }) => ({
            ...(sensorsMap[sensorId] || {}),
            value: sensorsMap[sensorId]?.value || "N/A",
          })),
          controls: device.controls.map(({ controlId }) => ({
            ...(controlsMap[controlId] || {}),
            status: controlsMap[controlId]?.status || false,
          })),
        }));

        setDeviceData(finalDevices);
      } catch (error) {
        console.error("Error fetching user devices:", error);
        setDeviceData(null); // Set error state
      }
    };

    fetchDevices();
  }, []); // Runs only once on mount

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
      <div className="flex flex-wrap justify-between gap-8 px-10 py-8 min-h-screen">
        {deviceData ? (
          <GardenItem
            id={deviceData.id_esp}
            name={deviceData.name || deviceData.id_esp}
            sensors={deviceData.sensors}
            controls={deviceData.controls}
          />
        ) : (
          <p>Loading garden data...</p>
        )}
      </div>
      <FooterComponent />
    </div>
  );
}

export default HomePage;
