import React, { useState, useEffect } from "react";
import {
  Pencil,
  Droplets,
  Thermometer,
  CloudRain,
  ShowerHead,
  Sun,
  User,
  Fan,
  Lightbulb,
  Droplet,
} from "lucide-react";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import {
  getGardenByDevice,
  getMemberByIdDevice,
  updateControlById,
} from "../../../api/deviceApi";
import { apiResponseHandler } from "../../../components/Alert/alertComponent";

const GardenImage = ({ src }) => (
  <div className="flex justify-center items-center p-4">
    <img
      src={src}
      alt="Garden"
      className="rounded-xl shadow-md max-h-64 object-cover border border-gray-300"
    />
  </div>
);

const SensorReading = ({ label, value, unit, icon }) => (
  <div className="mx-2 my-3 flex justify-between items-center">
    <div className="flex items-center space-x-2 min-w-[140px]">
      <span className="text-xl">{icon}</span>
      <p className="font-semibold text-gray-600 truncate">{label}:</p>
    </div>
    <div className="flex items-center space-x-1">
      <p className="text-gray-800 font-medium min-w-[50px] text-right">
        {value ?? "---"}
      </p>
      <p className="text-gray-500 text-sm">
        {unit}
      </p>
    </div>
  </div>
);

const MemberList = ({ members, onEdit }) => (
  <div className="flex flex-col px-2">
    {members.map((member, index) => (
      <div
        key={member.email || member.name || index}
        className="border rounded-md px-3 py-2 my-2 flex justify-between items-center transition-all duration-200 bg-white border-gray-200 hover:shadow-md"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg text-sky-500">
            <User size={20} />
          </span>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center">
              <span className="font-medium text-gray-800">
                {member.name ?? "Unknown"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {member.role ?? "no-role"}
            </span>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(member)}
            className="text-green-600 hover:text-green-800 transition p-1 rounded-md hover:bg-green-100"
          >
            <Pencil size={16} className="text-green-600" />
          </button>
        )}
      </div>
    ))}
  </div>
);

const ModeSelector = ({ currentMode, onChange }) => {
  const modes = ["Thủ công", "Theo lịch", "Ngưỡng"];
  const modeMap = {
    "Thủ công": "manual",
    "Theo lịch": "schedule",
    Ngưỡng: "threshold",
  };

  return (
    <div className="flex space-x-1 text-xs">
      {modes.map((mode) => (
        <button
          key={mode}
          className={`px-3 py-1 rounded-md transition-colors duration-200 font-medium
            ${
              currentMode === modeMap[mode] // Check against the API value
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={() => onChange(modeMap[mode])} // Send API value on click
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}{" "}
          {/* Capitalize first letter */}
        </button>
      ))}
    </div>
  );
};

export const DetailedGardenInfo = ({ deviceId }) => {
  const [loading, setLoading] = useState(true);
  const [gardenData, setGardenData] = useState(null);
  const [sensorsMap, setSensorsMap] = useState({});
  const [controlsMap, setControlsMap] = useState({});
  const [waterOn, setWaterOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [windOn, setWindOn] = useState(false);
  const [controlModes, setControlModes] = useState({});
  const [controlStatuses, setControlStatuses] = useState({});
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  // Define all possible sensor types
  const allSensorTypes = [
    "moisture",
    "temperature",
    "humidity",
    "stream",
    "luminosity",
  ];

  // Define all possible control names
  const allControlNames = ["water", "light", "wind"];

  const translateSensorType = (sensorType) => {
    const translationMap = {
      moisture: {
        label: "Độ ẩm đất",
        unit: "%",
        icon: <Droplets size={18} color="#38bdf8" />, // sky-400
      },
      temperature: {
        label: "Nhiệt độ",
        unit: "°C",
        icon: <Thermometer size={18} color="#f87171" />, // red-400
      },
      humidity: {
        label: "Độ ẩm không khí",
        unit: "%",
        icon: <CloudRain size={18} color="#60a5fa" />, // blue-400
      },
      stream: {
        label: "Lưu lượng nước",
        unit: "m³/s",
        icon: <ShowerHead size={18} color="#34d399" />, // green-400
      },
      luminosity: {
        label: "Cường độ ánh sáng",
        unit: "%",
        icon: <Sun size={18} color="#facc15" />, // yellow-400
      },
    };
    return (
      translationMap[sensorType] || { label: sensorType, unit: "", icon: "🔍" }
    );
  };
  const fetchGardenData = async () => {
    if (!isPolling) return;
    
    try {
      const res = await getGardenByDevice(deviceId);
      const device = res.data || {};
      // Get members and attach to device
      const result = await getMemberByIdDevice(deviceId);
      device.members = result.data || [];
  
      setGardenData(device);
      // Map sensors by type for easy access
      const tempSensorsMap = {};
      device.sensors?.forEach((sensor) => {
        tempSensorsMap[sensor.type] = sensor;
      });
      setSensorsMap(tempSensorsMap);

      // Map controls by name for easy access and initialize modes and statuses
      const tempControlsMap = {};
      const initialModes = {};
      const initialStatuses = {};
      device.controls?.forEach((control) => {
        tempControlsMap[control.name] = control;
        initialModes[control.name] = control.mode || "manual";
        initialStatuses[control.name] = control.status || false;
      });
      setControlsMap(tempControlsMap);
      setControlModes(initialModes);
      setControlStatuses(initialStatuses);
      
      // Set control statuses based on control data
      const waterControl = device.controls?.find(
        (control) => control.name === "water"
      );
      const lightControl = device.controls?.find(
        (control) => control.name === "light"
      );
      const windControl = device.controls?.find(
        (control) => control.name === "wind"
      );

      setWaterOn(waterControl ? waterControl.status : false);
      setLightOn(lightControl ? lightControl.status : false);
      setWindOn(windControl ? windControl.status : false);
      
      setError(null);
    } catch (error) {
      console.error("Error fetching garden data:", error);
      setError("Failed to load device data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchGardenData();
    
    // Set up polling
    const intervalId = setInterval(fetchGardenData, 1000); // Fetch every 1 second
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [deviceId]);
  
  // Handler for toggling control status
  const handleStatusToggle = async (controlName, controlId) => {
    const currentStatus = controlStatuses[controlName];
    const newStatus = !currentStatus;

    // Optimistically update the UI
    setControlStatuses((prev) => ({
      ...prev,
      [controlName]: newStatus,
    }));

    try {
      await updateControlById({
        id_esp: deviceId,
        controlId: controlId,
        data: { status: newStatus },
      });
    } catch (error) {
      // Revert on error
      setControlStatuses((prev) => ({
        ...prev,
        [controlName]: currentStatus,
      }));
      apiResponseHandler("Failed to update control status. Please try again.", "error");
    }
  };

  // Handler for changing control mode
  const handleModeChange = async (controlName, controlId, newMode) => {
    const currentMode = controlModes[controlName];
    // Only proceed if the mode is actually changing
    if (currentMode === newMode) return;

    // Optimistically update the local state
    setControlModes((prev) => ({
      ...prev,
      [controlName]: newMode,
    }));

    try {
      await updateControlById({
        id_esp: deviceId,
        controlId: controlId,
        data: { mode: newMode },
      });
      console.log("updated", controlId, " mode to ", newMode);
    } catch (error) {
      // Revert on error
      setControlModes((prev) => ({
        ...prev,
        [controlName]: currentMode,
      }));
      apiResponseHandler(
        `Failed to update mode for ${controlName}. Please try again.`
      );
    }
  };

  if (loading || !gardenData) {
    return DetailedGardenInfoSkeleton();
  }

  const imageUrl =
    gardenData.img_area || require("../../../assets/images/ItemImg.png");

  // Display all sensors, even if missing
  const displayedSensors = allSensorTypes.map((type) => {
    const sensor = sensorsMap[type] || { type, value: null };
    const { label, unit, icon } = translateSensorType(type);
    return { label, value: sensor.value, unit, icon }; // passing the icon here
  });

  // Display all controls, even if missing
  const displayedControls = allControlNames.map((name) => {
    const control = controlsMap[name];
    const exists = Boolean(control?._id);

    return {
      name,
      status: controlStatuses[name] ?? false,
      mode: controlModes[name] ?? "manual",
      _id: control?._id,
      exists,
    };
  });

  return (
    <div className="mx-5 bg-white rounded-xl shadow-md py-2 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-10 items-stretch">
      {/* Image Section */}
      <div className="col-span-1 flex flex-col md:border-r">
        <h2 className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Hình ảnh
        </h2>
        <GardenImage src={imageUrl} />
      </div>

      {/* Sensor Section */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Cảm biến
        </h2>
        <div className="flex flex-col">
          {displayedSensors.map(({ label, value, unit, icon }, index) => (
            <SensorReading
              key={index}
              label={label}
              value={value}
              unit={unit}
              icon={icon}
            />
          ))}
        </div>
      </div>

      {/* Control Section */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Điều khiển
        </h2>
        <div className="flex flex-col items-center mt-2 w-full">
          {displayedControls.map(
            ({ name, status, mode, _id, exists }, index) => (
              <div key={index} className="flex flex-col w-full py-2 px-4">
                {/* Label stays clear and vibrant */}
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="font-semibold text-green-700 flex items-center gap-1">
                    {name === "water" ? (
                      <Droplet size={18} className="text-sky-400" />
                    ) : name === "light" ? (
                      <Lightbulb size={18} className="text-yellow-400" />
                    ) : (
                      <Fan size={18} className="text-green-400" />
                    )}
                    {name === "water"
                      ? "Nước"
                      : name === "light"
                      ? "Đèn"
                      : "Gió"}
                    :
                  </span>

                  {/* Toggle with conditional blur + tooltip */}
                  <div
                    className={`transition-all duration-200 ${
                      exists ? "" : "opacity-40 pointer-events-none"
                    }`}
                    title={exists ? "" : "Unavailable for this garden"}
                  >
                    <ToggleSwitch
                      isOn={status}
                      onToggle={() => exists && handleStatusToggle(name, _id)}
                      disabled={!exists}
                    />
                  </div>
                </div>

                {/* ModeSelector with conditional blur + tooltip */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-green-600 font-medium">
                    Chế độ:
                  </span>
                  <div
                    className={`transition-all duration-200 ${
                      exists ? "" : "opacity-40 pointer-events-none"
                    }`}
                    title={exists ? "" : "Unavailable for this garden"}
                  >
                    <ModeSelector
                      currentMode={mode}
                      onChange={(newMode) =>
                        exists && handleModeChange(name, _id, newMode)
                      }
                      disabled={!exists}
                    />
                  </div>
                </div>

                {index < displayedControls.length - 1 && (
                  <div className="w-full border-b border-gray-300 my-2"></div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Member Section */}
      <div className="col-span-1 h-full min-h-[200px] flex flex-col space-y-2">
        <h2 className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Thành viên
        </h2>
        <div className="flex flex-col">
          <MemberList members={gardenData.members} />
        </div>
      </div>
    </div>
  );
};

export const DetailedGardenInfoSkeleton = () => {
  return (
    <div className="mx-5 bg-white rounded-xl shadow-md py-2 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-10 items-stretch animate-pulse">
      {/* Image Section Skeleton */}
      <div className="col-span-1 flex flex-col md:border-r">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Hình ảnh
        </div>
        <div className="h-48 bg-gray-200 rounded-lg m-4"></div>
      </div>

      {/* Sensor Section Skeleton */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-4">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Cảm biến
        </div>
        <div className="flex flex-col px-4 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>

      {/* Control Section Skeleton */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-4">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Điều khiển
        </div>
        <div className="flex flex-col items-center mt-2 w-full px-4 space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-full">
              <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              {i < 1 && (
                <div className="w-full border-b border-gray-300 my-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Member Section Skeleton */}
      <div className="col-span-1 h-full min-h-[200px] flex flex-col space-y-4">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          Thành viên
        </div>
        <div className="flex flex-col px-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
