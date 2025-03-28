import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ToggleSwitch } from "../ToggleComponent/ToggleSwitch";

function GardenItem({ id, name, temp, moisture, water }) {
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);
  const navigate = useNavigate();
  const handleImageGardenClick = () => {
    navigate(`/garden/${id}`);
  };
  return (
    <div className="w-[30%] h-2/3 rounded-xl border-2 shadow-lg bg-white flex overflow-hidden">
      <div className="p-2 w-2/5 bg-green-200 rounded-xl border-r-2">
       
          <img
            src={require("../../assets/images/ItemImg.png")}
            alt="Garden"
            className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 rounded-xl border-n-2 "
            onClick={handleImageGardenClick}
          />
      </div>
      <div className="w-3/5 p-4 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
          <img
            src={require("../../assets/images/TreePlanting.png")}
            className="w-6 h-6 cursor-pointer hover:opacity-80"
            alt="edit"
          />
        </div>

        {/* Sensor Data */}
        <div className="space-y-2 text-gray-700">
          <div className="px-2 flex justify-between items-center">
            <h2 className="font-medium">Nhiệt độ:</h2>
            <h2 className="text-lg font-semibold">{temp}°C</h2>
          </div>
          <div className="px-2 flex justify-between items-center">
            <h2 className="font-medium">Độ ẩm đất:</h2>
            <h2 className="text-lg font-semibold">{moisture}%</h2>
          </div>
        </div>
        {/* Controls */}
        <div className="space-y-1 text-gray-700">
          <div className=" px-2 flex justify-between items-center">
            <span className="font-medium text-gray-700">Tưới:</span>
            <ToggleSwitch
              isOn={isIrrigationStatus}
              onToggle={() => setIsIrrigationStatus(!isIrrigationStatus)}
            />
          </div>
          <div className="px-2 flex justify-between items-center">
            <span className="font-medium text-gray-700">Đèn:</span>
            <ToggleSwitch
              isOn={isLightStatus}
              onToggle={() => setIsLightStatus(!isLightStatus)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GardenItem;
