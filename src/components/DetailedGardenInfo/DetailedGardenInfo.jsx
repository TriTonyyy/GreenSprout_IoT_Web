import React, { useEffect, useState } from "react";
import { ToggleSwitch } from "../ToggleComponent/ToggleSwitch";
import axios from "axios";

const GardenImage = ({ src }) => (
  <img
    src={src}
    alt="Garden"
    className="object-contain rounded-xl h-fit w-fit border-n-2 items-center mx-auto py-2"
  />
);

const SensorReading = ({ label, value }) => (
  <div className="mx-2 my-3 flex justify-between items-center ">
    <p className="font-semibold text-gray-600">{label}:</p>
    <p className="text-gray-800">{value}</p>
  </div>
);

export const DetailedGardenInfo = ({ gardenId }) => {
  const [gardenData, setGardenData] = useState(null);
  const [lightOn, setLightOn] = useState(false);
  const [waterOn, setWaterOn] = useState(false);

  const fetchGardenData = async () => {
    try {
      const response = await axios.get(
        `https://capstone-project-iot-1.onrender.com/api/device/detailDeviceBy/${gardenId}`
      );
      const data = response.data;

      setGardenData(data);
      setLightOn(data.controls.lightStatus);
      setWaterOn(data.controls.waterStatus);
    } catch (error) {
      console.error("Error fetching garden data:", error);
      setGardenData(null);
    }
  };

  useEffect(() => {
    fetchGardenData();
  }, [gardenId]);

  if (!gardenData) {
    return <div className="text-center">Loading garden data...</div>;
  }

  return (
    <div className="w-4/5 mx-auto bg-white rounded-xl shadow-md py-2 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-10 items-stretch">
      {/* Image Section */}
      <div className="col-span-1 flex flex-col md:border-r">
        <h2 className="text-lg font-semibold text-center py-2 px-2 border-b mx-4 border-gray-300">
          Thông tin khu vườn
        </h2>
        <GardenImage
          src={
            gardenData.imageUrl || require("../../assets/images/ItemImg.png")
          }
        />
      </div>

      {/* Sensor Section */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-center py-2 px-2 border-b mx-4 border-gray-300">
          Cảm biến
        </h2>
        <SensorReading
          label="Nhiệt độ"
          value={`${gardenData.sensors.temperature}°C`}
        />
        <SensorReading
          label="Độ ẩm đất"
          value={`${gardenData.sensors.soilMoisture}%`}
        />
        <SensorReading
          label="Lưu lượng nước"
          value={`${gardenData.sensors.waterFlow}L/phút`}
        />
        <SensorReading
          label="Cường độ ánh sáng"
          value={`${gardenData.sensors.lightIntensity}%`}
        />
      </div>

      {/* Statistics Section */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-center py-2 px-2 border-b mx-4 border-gray-300">
          Thống kê
        </h2>
        <SensorReading
          label="Tổng lượng nước đã dùng"
          value={`${gardenData.statistics.totalWaterUsed}L`}
        />
        <SensorReading
          label="Độ che mưa"
          value={`${gardenData.statistics.rainCover}%`}
        />
        <SensorReading
          label="Độ ẩm đất"
          value={`${gardenData.statistics.soilMoisture}%`}
        />
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
              onToggle={() => setWaterOn(!waterOn)}
            />
          </div>
          <div className="flex justify-between items-center w-4/5 py-2">
            <span className="font-medium text-gray-700">Đèn:</span>
            <ToggleSwitch
              isOn={lightOn}
              onToggle={() => setLightOn(!lightOn)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
