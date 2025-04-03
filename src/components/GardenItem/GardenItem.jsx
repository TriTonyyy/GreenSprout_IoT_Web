import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ToggleSwitch } from "../ToggleComponent/ToggleSwitch";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { updateControlById } from "../../api/deviceApi";

function GardenItem({ id, name, sensors = [], controls = [] }) {
  const navigate = useNavigate();
  console.log("Sensors Data:", sensors);
  // console.log("Controls Data:", controls);
  // Default sensor types
  const sensorTypes = ["temperature", "moisture"];

  // Default control names
  const controlNames = ["water", "light"];

  // Map over sensor types to ensure all required sensors are displayed
  const displayedSensors = sensorTypes.map((type) => {
    return sensors.find((s) => s.type === type) || { type, value: "---" };
  });

  // Map over control names to ensure all required controls are displayed
  const displayedControls = controlNames.map((name) => {
    return controls.find((c) => c.name === name) || { name, status: false };
  });

  // State for toggles
  const [controlStatuses, setControlStatuses] = useState({});

  // Sync toggle states when control data updates
  useEffect(() => {
    const updatedStatuses = {};
    displayedControls.forEach((control) => {
      updatedStatuses[control.name] = control.status ?? false;
    });
    setControlStatuses(updatedStatuses);
  }, [controls]);

  const handleToggle = async (controlName, controlId) => {
    try {
      const newStatus = !controlStatuses[controlName]; // Toggle status
      setControlStatuses((prev) => ({
        ...prev,
        [controlName]: newStatus,
      }));
      // Log for debugging to ensure correct values are sent to backend
      console.log(
        `Updating control ${controlName} with ID: ${controlId}, newStatus: ${newStatus}`
      );
      await updateControlById(controlId, { status: newStatus }); // Send status in object form
    } catch (error) {
      console.error("Error updating control status:", error);
      setControlStatuses((prev) => ({
        ...prev,
        [controlName]: !controlStatuses[controlName],
      }));
    }
  };

  const handleImageGardenClick = () => {
    navigate(`/garden/${id}`);
  };

  return (
    <div className="w-[30%] h-2/3 rounded-xl border-2 shadow-lg bg-white flex overflow-hidden">
      <div className="p-2 w-2/5 bg-green-200 rounded-xl border-r-2">
        <img
          src={require("../../assets/images/ItemImg.png")}
          alt="Garden"
          className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 rounded-xl"
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

        {/* Sensor Data (Temperature & Moisture) */}
        <div className="space-y-2 text-gray-700">
          {displayedSensors.map((sensor, index) => (
            <div key={index} className="px-2 flex justify-between items-center">
              <h2 className="font-medium">
                {sensor.type === "temperature" ? "Nhiệt độ" : "Độ ẩm đất"}:
              </h2>
              <h2 className="text-lg font-semibold">
                {sensor?.value} {sensor.type === "temperature" ? "°C" : "%"}
              </h2>
            </div>
          ))}
        </div>

        {/* Controls (Water & Light) */}
        <div className="space-y-1 text-gray-700">
          {displayedControls.map((control, index) => (
            <div key={index} className="px-2 flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {control.name === "water" ? "Tưới" : "Đèn"}:
              </span>
              <ToggleSwitch
                isOn={controlStatuses[control.name]}
                onToggle={() => handleToggle(control.name, control._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GardenItemSkeleton() {
  return (
    <div className="w-[30%] h-2/3 rounded-xl border-2 shadow-lg bg-white flex overflow-hidden">
      {/* Left Side Image Skeleton */}
      <div className="p-2 w-2/5 bg-gray-200 rounded-xl border-r-2">
        <Skeleton height="100%" width="100%" />
      </div>
      {/* Right Side Content Skeleton */}
      <div className="w-3/5 p-4 flex flex-col justify-between">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton width="60%" height={20} />
          <Skeleton circle width={30} height={30} />
        </div>

        {/* Sensor Data Skeleton */}
        <div className="space-y-2 text-gray-700">
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton width="20%" height={20} />
          </div>
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton width="20%" height={20} />
          </div>
        </div>

        {/* Controls Skeleton */}
        <div className="space-y-1 text-gray-700">
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton circle width={30} height={30} />
          </div>
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton circle width={30} height={30} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { GardenItem, GardenItemSkeleton };
