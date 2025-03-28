import React from "react";
import { useNavigate } from "react-router";
import {ToggleSwitch} from "../ToggleComponent/ToggleSwitch";

const GardenImage = ({ src }) => (
  <img src={src} alt="Garden" className="mx-auto" />
);

const SensorReading = ({ label, value }) => (
  <div className="py-1 mt-4">
    <span className="font-semibold text-gray-600">{label}: </span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export const DetailedGardenInfo = ({ gardenId }) => {
  const [lightOn, setLightOn] = React.useState(false);
  const [waterOn, setWaterOn] = React.useState(false);

  return (
    <div className="w-4/5 mx-auto bg-white rounded-xl shadow-md p-4 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-4 items-start">
      <div className="col-span-1 ">
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
