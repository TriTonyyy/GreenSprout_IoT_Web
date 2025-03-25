import React from "react";
import { GardenTitle } from "./GardenTitle";
import { useNavigate } from "react-router";

<div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex flex-col gap-6">
  <GardenTitle gardenName="Vườn tiêu" areaGardenName="Khu vực 1" />
</div>;

const GardenImage = ({ src }) => (
  <img src={src} alt="Garden" className="rounded-xl shadow-md" />
);

const SensorReading = ({ label, value }) => (
  <div className="py-1 mt-4">
    <span className="font-semibold text-gray-600">{label}: </span>
    <span className="text-gray-800">{value}</span>
  </div>
);

const ToggleSwitch = ({ label, isOn, onToggle }) => (
  <div className="flex items-center justify-between py-1 mt-4">
    <span className="font-semibold text-gray-600">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isOn}
        onChange={onToggle}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-700 transition-colors duration-300">
        <div
          className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${
            isOn ? "translate-x-5 border-white" : ""
          }`}
        ></div>
      </div>
    </label>
  </div>
);

export const DetailedGardenInfo = () => {
  const [fanOn, setFanOn] = React.useState(false);
  const [lightOn, setLightOn] = React.useState(false);
  const [waterOn, setWaterOn] = React.useState(false);

  return (
    <div className="max-w-6xl bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1">
        <GardenImage src={require("../../assets/images/ItemImg.png")} />
      </div>
      <div className="col-span-1 md:border-r border-gray-200">
        <SensorReading label="Nhiệt độ" value="19°C" />
        <SensorReading label="Độ ẩm đất" value="25%" isHighlighted />
        <SensorReading
          label="Lưu lượng nước"
          value="0.00L/phút"
          isHighlighted
        />
        <SensorReading label="Cường độ ánh sáng" value="66.00%" isHighlighted />
      </div>
      <div className="col-span-1 md:border-r border-gray-200">
        <SensorReading
          label="Tổng lượng nước đã dùng"
          value="0.12L"
          isHighlighted
        />
        <SensorReading label="Độ che mưa" value="0.00%" isHighlighted />
        <SensorReading label="Độ ẩm đất" value="25%" isHighlighted />
      </div>
      <div className="col-span-1">
        <ToggleSwitch
          label="Trạng thái tưới"
          isOn={waterOn}
          onToggle={() => setWaterOn(!waterOn)}
        />
        <ToggleSwitch
          label="Đèn"
          isOn={lightOn}
          onToggle={() => setLightOn(!lightOn)}
        />
      </div>
    </div>
  );
};
