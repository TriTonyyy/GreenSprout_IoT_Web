import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";

const GardenImage = ({ src }) => (
  <img
    src={src}
    alt="Garden"
    className="object-contain rounded-xl h-fit w-fit border-n-2 items-center mx-auto py-2"
  />
);

const SensorReading = ({ label, value, unit }) => (
  <div className="mx-2 my-3 flex justify-between items-center">
    <p className="font-semibold text-gray-600">{label}:</p>
    <p className="text-gray-800">
      {value} {unit}
    </p>
  </div>
);

export const DetailedGardenInfo = ({ deviceId }) => {
  const [loading, setLoading] = useState(true);
  const [gardenData, setGardenData] = useState(null);

  // Sensor and control ID -> object maps
  const [sensorsMap, setSensorsMap] = useState({});
  const [controlsMap, setControlsMap] = useState({});

  // Toggles for water & light
  const [waterOn, setWaterOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  const linkApi = "https://capstone-project-iot-1.onrender.com/api/";

  // const translateSensorType = (sensorType) => {
  //   const translationMap = {
  //     moisture: "Độ ẩm đất",
  //     temperature: "Nhiệt độ",
  //     humidity: "Độ ẩm không khí",
  //     stream: "Lưu lượng nước",
  //     luminosity: "Cường độ ánh sáng",
  //   };

  //   return translationMap[sensorType] || sensorType; // Default to the input type if not found
  // };

  const translateSensorType = (sensorType) => {
    const translationMap = {
      moisture: { label: "Độ ẩm đất", unit: "%" },
      temperature: { label: "Nhiệt độ", unit: "°C" },
      humidity: { label: "Độ ẩm không khí", unit: "%" },
      stream: { label: "Lưu lượng nước", unit: "m³/s" },
      luminosity: { label: "Cường độ ánh sáng", unit: "%" },
    };

    return translationMap[sensorType] || { label: sensorType, unit: "" };
  };

  useEffect(() => {
    const fetchGardenData = async () => {
      try {
        // 1) Fetch device details
        const response = await axios.get(
          `${linkApi}device/detailDeviceBy/6CE6C6FC8AD4`
          // "https://capstone-project-iot-1.onrender.com/api/device/detailDeviceBy/6CE6C6FC8AD4"
        );
        const device = response.data.data;
        if (!device) throw new Error("Device not found or invalid ID");

        // 2) Fetch sensors & controls
        const sensorPromises = device.sensors.map(({ sensorId }) =>
          axios.get(`${linkApi}sensor/detailSensorBy/${sensorId}`)
        );
        const controlPromises = device.controls.map(({ controlId }) =>
          axios.get(`${linkApi}control/detailControlBy/${controlId}`)
        );

        const [sensorResponses, controlResponses] = await Promise.all([
          Promise.all(sensorPromises),
          Promise.all(controlPromises),
        ]);

        // 3) Build maps so we can easily reference sensor/control by ID
        const tempSensorsMap = {};
        sensorResponses.forEach((res) => {
          const sensorData = res.data.data || res.data;
          tempSensorsMap[sensorData._id] = sensorData;
        });

        const tempControlsMap = {};
        controlResponses.forEach((res) => {
          const controlData = res.data.data || res.data;
          tempControlsMap[controlData._id] = controlData;
        });

        setSensorsMap(tempSensorsMap);
        setControlsMap(tempControlsMap);

        // 4) Determine status for water & light toggles
        const waterControl = device.controls.find(
          (c) => tempControlsMap[c.controlId]?.name === "water"
        );
        const lightControl = device.controls.find(
          (c) => tempControlsMap[c.controlId]?.name === "light"
        );

        setWaterOn(
          waterControl ? tempControlsMap[waterControl.controlId].status : false
        );
        setLightOn(
          lightControl ? tempControlsMap[lightControl.controlId].status : false
        );

        // 5) Store entire device in state for UI usage
        setGardenData(device);
      } catch (error) {
        console.error("Error fetching garden data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGardenData();
  }, [deviceId]);

  if (loading) return <div className="text-center">Loading garden data...</div>;
  if (!gardenData)
    return <div className="text-center">Failed to load garden data.</div>;

  // Fallback image if the device has no imageUrl
  const imageUrl =
    gardenData.imageUrl || require("../../../assets/images/ItemImg.png");

  // If you store "reports" in gardenData, you can map them out below if you want
  const { reports = [] } = gardenData;

  return (
    <div className="w-4/5 mx-auto bg-white rounded-xl shadow-md py-2 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-10 items-stretch">
      {/* Image Section */}
      <div className="col-span-1 flex flex-col md:border-r">
        <h2 className="text-lg font-semibold text-center py-2 px-2 border-b mx-4 border-gray-300">
          Thông tin khu vườn
        </h2>
        <GardenImage src={imageUrl} />
      </div>

      {/* Sensor Section */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-center py-2 px-2 border-b mx-4 border-gray-300">
          Cảm biến
        </h2>
        <div className="flex flex-col">
          {/* MAPPING each sensor for label & value */}
          {gardenData.sensors.map(({ sensorId }) => {
            const sensorObj = sensorsMap[sensorId];
            if (!sensorObj) return null;

            // e.g., sensorObj.name = "Moisture", sensorObj.value = 100, sensorObj.unit = "%"
            // return (
            //   <SensorReading
            //     key={sensorObj._id}
            //     label={translateSensorType(sensorObj.type) || "Unknown Sensor"}
            //     value={`${sensorObj.value}${
            //       sensorObj.unit ? ` ${sensorObj.unit}` : ""
            //     }`}
            //   />
            // );
            const { label, unit } = translateSensorType(sensorObj.type);
            return (
              <SensorReading
                key={sensorObj._id}
                label={label || "Unknown Sensor"}
                value={sensorObj.value}
                unit={unit}
              />
            );
          })}
        </div>
      </div>

      {/* Statistics Section (example usage of 'reports') */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-center py-2 px-2 border-b mx-4 border-gray-300">
          Thống kê
        </h2>
        <div className="flex flex-col item-center">
          {reports.map((report) => (
            <SensorReading
              key={report._id}
              label={`Water usage at ${report.time_created}`}
              value={`${report.water_usage} L`}
            />
          ))}
        </div>
      </div>

      {/* Control Section */}
      <div className="col-span-1 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-center py-2 px-2 border-b mx-4 border-gray-300">
          Điều khiển
        </h2>
        <div className="flex flex-col items-center mt-2 w-full">
          <div className="flex justify-between items-center w-4/5 py-2">
            <span className="font-medium text-gray-700">Nước:</span>
            <ToggleSwitch
              isOn={waterOn}
              onToggle={() => setWaterOn((prev) => !prev)}
            />
          </div>
          <div className="flex justify-between items-center w-4/5 py-2">
            <span className="font-medium text-gray-700">Đèn:</span>
            <ToggleSwitch
              isOn={lightOn}
              onToggle={() => setLightOn((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
