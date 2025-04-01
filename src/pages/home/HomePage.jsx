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

function HomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const linkApi = "https://capstone-project-iot-1.onrender.com/api/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${linkApi}device/detailDeviceBy/6CE6C6FC8AD4`
        );
        // Access the nested data property
        const garden = response.data.data;
        console.log("Garden data:", garden);
        // console.log("Sensors:", garden.sensors);
        // console.log("Controls:", garden.controls);

        // Create promises for sensor data fetching
        const sensorPromises = garden.sensors.map(({ sensorId }) =>
          axios
            .get(`${linkApi}sensor/detailSensorBy/${sensorId}`)
            .catch((error) => {
              console.log(`Error fetching sensor ${sensorId}:`, error);
              return null;
            })
        );

        // Create promises for control data fetching
        const controlPromises = garden.controls.map(({ controlId }) =>
          axios
            .get(`${linkApi}control/detailControlBy/${controlId}`)
            .catch((error) => {
              console.log(`Error fetching control ${controlId}:`, error);
              return null;
            })
        );

        // Wait for all promises to resolve
        const [sensorsResponse, controlsResponse] = await Promise.all([
          Promise.all(sensorPromises),
          Promise.all(controlPromises),
        ]);

        // Log responses to debug
        // console.log("Sensor responses:", sensorsResponse);
        // console.log("Control responses:", controlsResponse);

        // Filter out any failed requests
        const validSensors = sensorsResponse.filter(Boolean);
        const validControls = controlsResponse.filter(Boolean);

        // Create maps keyed by sensorId and controlId
        const sensorsMap = {};
        validSensors.forEach((response) => {
          if (response && response.data) {
            // Check if response.data has a data property
            const sensorData = response.data.data || response.data;
            // Use the same ID that's in the garden.sensors array
            garden.sensors.forEach((sensor) => {
              if (sensor.sensorId === sensorData._id) {
                sensorsMap[sensor.sensorId] = sensorData;
              }
            });
          }
        });

        const controlsMap = {};
        validControls.forEach((response) => {
          if (response && response.data) {
            // Check if response.data has a data property
            const controlData = response.data.data || response.data;
            // Use the same ID that's in the garden.controls array
            garden.controls.forEach((control) => {
              if (control.controlId === controlData._id) {
                controlsMap[control.controlId] = controlData;
              }
            });
          }
        });

        console.log("Sensors map:", sensorsMap);
        console.log("Controls map:", controlsMap);

        // Map the sensors and controls using their IDs
        setDeviceData({
          ...garden,
          sensors: garden.sensors.map(({ sensorId }) => ({
            ...(sensorsMap[sensorId] || {}),
            value: sensorsMap[sensorId]?.value || "N/A",
          })),
          controls: garden.controls.map(({ controlId }) => ({
            ...(controlsMap[controlId] || {}),
            status: controlsMap[controlId]?.status || false,
          })),
        });
      } catch (error) {
        console.error("Error fetching garden data:", error);
        setDeviceData(null); // Set to null to show error state
      }
    };

    fetchData();
  }, []);

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
