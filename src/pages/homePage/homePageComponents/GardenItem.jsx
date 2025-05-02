import React, { useState, useEffect , me, memo} from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import { updateControlById } from "../../../api/deviceApi";
import { apiResponseHandler } from "../../../components/Alert/alertComponent";
import "react-loading-skeleton/dist/skeleton.css";

const GardenItem = memo(function GardenItem({ id, name, sensors = [], controls = [], img_area }) {
  const navigate = useNavigate();
  const sensorTypes = ["temperature", "moisture"];
  const controlNames = ["water", "light", "wind"]; // Added "fan" control

  const displayedSensors = sensorTypes.map((type) => {
    return sensors.find((s) => s.type === type) || { type, value: "---" };
  });

  const [controlStatuses, setControlStatuses] = useState({});

  useEffect(() => {
    const updatedStatuses = {};

    controlNames.forEach((name) => {
      const control = controls.find((c) => c.name === name);
      updatedStatuses[name] = control?.status ?? false;
    });

    setControlStatuses(updatedStatuses);
  }, [controls]);

  const handleToggle = async (controlName, controlId) => {
    const currentStatus = controlStatuses[controlName];
    const newStatus = !currentStatus;

    // Optimistically update the status in the UI
    setControlStatuses((prev) => ({
      ...prev,
      [controlName]: newStatus,
    }));

    try {
      // Send the request to the backend to update control status
      await updateControlById({
        id_esp: id,
        controlId: controlId,
        data: {
          status: newStatus,
          mode: "manual",
        },
      });
    } catch (error) {
      // If an error occurs, revert the control status to its previous state
      setControlStatuses((prev) => ({
        ...prev,
        [controlName]: currentStatus,
      }));

      apiResponseHandler(
        "Failed to update control status. Please try again.",
        "error"
      );
    }
  };

  const handleImageGardenClick = (deviceId) => {
    navigate(`/garden/${deviceId}`);
  };
  
  return (
    <div className="w-[32%] h-1/4 rounded-2xl border-2 shadow-xl bg-white flex">
      <div className="w-1/2 rounded-xl border-r-2 transition-transform hover:scale-105">
        <img
          src={img_area !== "" ? img_area : require("../../../assets/images/ItemImg.png")}
          alt="Garden"
          className="w-full h-full object-cover cursor-pointer rounded-xl "
          onClick={() => handleImageGardenClick(id)}
        />
      </div>
      <div className="w-3/5 p-2 flex flex-col justify-between">
        <div className="m-1 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-green-800 truncate">
            {name}
          </h1>
          <img
            src={require("../../../assets/images/TreePlanting.png")}
            className="w-6 h-6 cursor-pointer hover:opacity-80"
            alt="edit"
          />
        </div>
        <hr className="my-1 border-t-1 border-gray-300" />
        <div className="m-1 text-gray-700">
          {displayedSensors.map((sensor, index) => {
            const sensorIcons = {
              moisture: "💧", // Water
              temperature: "🌡️", // Temperature
              humidity: "💦", // Humidity
            };
            return (
              <div key={index} className="flex justify-between">
                <h2 className="w-4/5 font-medium text-gray-600 flex items-center">
                  <span className="mr-2">{sensorIcons[sensor.type]}</span>
                  {sensor.type === "temperature" ? "Nhiệt độ" : "Độ ẩm đất"}:
                </h2>
                <div className="w-1/5 flex justify-end items-center">
                  <h2 className="text-xl font-semibold text-green-600">
                    {sensor?.value}
                  </h2>
                  <h2 className="text-xl font-semibold text-green-600 ml-2">
                    {sensor.type === "temperature" ? "°C" : "%"}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
        <hr className="my-1 border-t-1 border-gray-300" />
        <div className="text-gray-700">
          {controlNames.map((controlName, index) => {
            const control = controls.find((c) => c.name === controlName);
            const isControlAvailable = control?.status !== undefined;
            const status = controlStatuses[controlName];
            return (
              <div
                key={index}
                className={`px-1 flex justify-between items-center`}
              >
                <span
                  className={`font-medium text-green-600 flex items-center ${
                    !isControlAvailable ? "opacity-40" : ""
                  }`}
                >
                  {/* Control icon based on control type */}
                  <span className="mr-2">
                    {controlName === "water"
                      ? "🚿"
                      : controlName === "light"
                      ? "🔆"
                      : "🌬️"}
                  </span>
                  {controlName === "water"
                    ? "Tưới"
                    : controlName === "light"
                    ? "Ánh sáng"
                    : "Quạt"}
                  :
                </span>
                {/* Updated control label color */}
                <div className="flex justify-between items-center">
                  {isControlAvailable ? (
                    <ToggleSwitch
                      isOn={status}
                      onToggle={() => handleToggle(controlName, control?._id)}
                      style={{
                        cursor: "pointer", // Interactivity when available
                      }}
                    />
                  ) : (
                    <div className="opacity-40 pointer-events-none">
                      <ToggleSwitch />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

const GardenItemSkeleton =memo(function GardenItemSkeleton() {
  return (
    <div className="w-[32%] h-1/2 rounded-xl border-2 shadow-lg bg-white flex overflow-hidden">
      <div className="p-2 w-2/5 bg-gray-200 rounded-xl border-r-2">
        <Skeleton height="100%" width="100%" />
      </div>
      <div className="w-3/5 p-2 flex flex-col justify-between">
        <div className="m-1 flex justify-between items-center">
          <Skeleton width="60%" height={20} />
          <Skeleton circle width={30} height={30} />
        </div>

        <div className="m-1 p-2 space-y-2 text-gray-700">
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton width="30%" height={20} />
          </div>
          <div className="px-2 flex justify-between items-center">
            <Skeleton width="40%" height={20} />
            <Skeleton width="30%" height={20} />
          </div>
        </div>

        <div className=" m-1 p-2 space-y-1 text-gray-700">
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
})

export { GardenItem, GardenItemSkeleton };
