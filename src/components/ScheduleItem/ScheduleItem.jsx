import React, { useState } from "react";
import { useNavigate } from "react-router";
import {Ellipsis}   from "lucide-react"

function ScheduleItem({ id, name, temp, moisture, water }) {
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="w-[30%] h-2/3 rounded-xl border-2 shadow-lg bg-white flex justify-between">
      <div className="w-full rounded-xl w-full h-full">
          <img
            src={require("../../assets/images/ItemImg.png")}
            alt="Schedule"
            className="w-full h-full rounded-xl object-cover"
          />
      </div>
      <div className="w-[85%] p-4 flex flex-col">
        <div className="flex w-full justify-between items-center">
            <h1 className="text-lg"><strong>Khu 1</strong></h1>
            <div className="bg-gray-200 rounded-xl w-8 h-7 flex justify-center items-center ml-2">
                <Ellipsis />
            </div>
        </div>
        <div className="bg-gray-200 rounded-xl text-center mt-5">6:00/30 phút</div>
        <div className="bg-gray-200 rounded-xl text-center mt-5">13:00/20 phút</div>
        <h1 className="mt-auto">Trạng thái tưới: ON</h1>
      </div>
    </div>
  );
}

export default ScheduleItem;
