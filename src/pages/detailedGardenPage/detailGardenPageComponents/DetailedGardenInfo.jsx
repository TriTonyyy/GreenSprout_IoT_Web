import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import { getGardenByDevice, updateControlById } from "../../../api/deviceApi";
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
    <div className="flex items-center space-x-2">
      <span className="text-xl">{icon}</span>
      <p className="font-semibold text-gray-600">{label}:</p>
    </div>
    <p className="text-gray-800">
      {value ?? "---"} {unit}
    </p>
  </div>
);

const MemberList = ({ members, onEdit }) => (
  <div className="flex flex-col px-2">
    {members.map((member) => (
      <div
        key={member._id}
        className="bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2 my-2 flex justify-between items-center hover:shadow-md transition"
      >
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-lg">👤</span>
          <div>
            <span className="text-gray-800 font-medium">{member.userId}</span>{" "}
            <span className="text-sm text-gray-500">({member.role})</span>
          </div>
        </div>
        <button
          onClick={() => onEdit?.(member)}
          className="text-green-600 hover:text-green-800 transition p-1 rounded-md hover:bg-green-100"
        >
          <Pencil size={16} />
        </button>
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
      moisture: { label: "Độ ẩm đất", unit: "%", icon: "💧" },
      temperature: { label: "Nhiệt độ", unit: "°C", icon: "🌡️" },
      humidity: { label: "Độ ẩm không khí", unit: "%", icon: "💦" },
      stream: { label: "Lưu lượng nước", unit: "m³/s", icon: "🚿" },
      luminosity: { label: "Cường độ ánh sáng", unit: "%", icon: "🌞" },
    };
    return (
      translationMap[sensorType] || { label: sensorType, unit: "", icon: "🔍" }
    );
  };

  useEffect(() => {
    const fetchGardenData = async () => {
      try {
        const res = await getGardenByDevice(deviceId);
        const device = res?.data || null;
        if (!device) throw new Error("Device not found or invalid ID");

        setGardenData(device);

        // Map sensors by type for easy access
        const tempSensorsMap = {};
        device.sensors.forEach((sensor) => {
          tempSensorsMap[sensor.type] = sensor;
        });
        setSensorsMap(tempSensorsMap);

        // Map controls by name for easy access and initialize modes and statuses
        const tempControlsMap = {};
        const initialModes = {};
        const initialStatuses = {};
        device.controls.forEach((control) => {
          tempControlsMap[control.name] = control;
          initialModes[control.name] = control.mode || "manual";
          initialStatuses[control.name] = control.status || false;
        });
        setControlsMap(tempControlsMap);
        setControlModes(initialModes);
        setControlStatuses(initialStatuses);

        // Set control statuses based on control data
        const waterControl = device.controls.find(
          (control) => control.name === "water"
        );
        const lightControl = device.controls.find(
          (control) => control.name === "light"
        );
        const windControl = device.controls.find(
          (control) => control.name === "wind"
        );

        setWaterOn(waterControl ? waterControl.status : false);
        setLightOn(lightControl ? lightControl.status : false);
        setWindOn(windControl ? windControl.status : false);
      } catch (error) {
        console.error("Error fetching garden data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGardenData();
  }, [deviceId]);

  // Handler for toggling control status
  const handleStatusToggle = async (controlName, controlId) => {
    const currentStatus = controlStatuses[controlName]; // Get current status
    const newStatus = !currentStatus; // Calculate new status

    // Optimistically update the UI
    setControlStatuses((prev) => ({
      ...prev,
      [controlName]: newStatus,
    }));
    try {
      // Call the API to update the control status with exact body layout
      await updateControlById({
        id_esp: deviceId, // Device ID from props
        controlId: controlId, // Control ID from the function parameter
        data: { status: newStatus }, // Ensure the body is { "status": true/false }
      });
      console.log("updated", controlId, " status to ", newStatus);
    } catch (error) {
      setControlStatuses((prev) => ({
        ...prev,
        [controlName]: currentStatus, // Revert to the previous status
      }));
      alert("Failed to update control status. Please try again.");
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

  if (loading) return <div className="text-center">Loading garden data...</div>;
  if (!gardenData)
    return <div className="text-center">Failed to load garden data.</div>;

  const imageUrl =
    gardenData.img_area || require("../../../assets/images/ItemImg.png");
  const { reports = [], members = [] } = gardenData;

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
    <div className="w-4/5 mx-auto bg-white rounded-xl shadow-md py-2 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-10 items-stretch">
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
                  <span className="font-semibold text-green-700">
                    {name === "water"
                      ? "💧 Nước"
                      : name === "light"
                      ? "💡 Đèn"
                      : "🌬️ Gió"}
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
          <MemberList members={members} />
        </div>
      </div>
    </div>
  );
};
