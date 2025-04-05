import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import { getGardenByDevice } from "../../../api/deviceApi";

const GardenImage = ({ src }) => (
  <img
    src={src}
    alt="Garden"
    className="object-contain rounded-xl  h-fit w-fit border-n-2 items-center mx-auto py-1 px-2"
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
  const [sensorsMap, setSensorsMap] = useState({});
  const [controlsMap, setControlsMap] = useState({});
  const [waterOn, setWaterOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);

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
        const res = await getGardenByDevice(deviceId);
        const device = res?.data || null;
        if (!device) throw new Error("Device not found or invalid ID");

        setGardenData(device);

        // Set the sensors and controls from the device data
        const tempSensorsMap = {};
        device.sensors.forEach((sensor) => {
          tempSensorsMap[sensor._id] = sensor;
        });
        setSensorsMap(tempSensorsMap);

        const tempControlsMap = {};
        device.controls.forEach((control) => {
          tempControlsMap[control.name] = control;
        });
        setControlsMap(tempControlsMap);

        // Set water and light statuses based on control data
        const waterControl = device.controls.find(
          (control) => control.name === "Pump"
        );
        const lightControl = device.controls.find(
          (control) => control.name === "Light"
        );

        setWaterOn(waterControl ? waterControl.status : false);
        setLightOn(lightControl ? lightControl.status : false);
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

  const imageUrl =
    gardenData.img_area || require("../../../assets/images/ItemImg.png");
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
          {gardenData.sensors.map(({ type, value, _id }) => {
            const { label, unit } = translateSensorType(type);
            return (
              <SensorReading
                key={_id}
                label={label || "Unknown Sensor"}
                value={value}
                unit={unit}
              />
            );
          })}
        </div>
      </div>

      {/* Statistics Section */}
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
