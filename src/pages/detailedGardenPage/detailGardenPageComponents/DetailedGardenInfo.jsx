import React, { useState, useEffect } from "react";
import {
  Droplets,
  Thermometer,
  CloudRain,
  ShowerHead,
  Sun,
  Fan,
  Lightbulb,
  Droplet,
} from "lucide-react";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import {
  getGardenByDevice,
  getMemberByIdDevice,
  updateControlById,
  removeMemberByIdDevice,
  uploadImage,
  updateMemberRole,
  addBlockMember,
} from "../../../api/deviceApi";
import {
  apiResponseHandler,
  areUSurePopup,
  selectNewOwnerPopup,
} from "../../../components/Alert/alertComponent";
import i18n from "../../../i18n";
import { getLang } from "../../../redux/selectors/langSelectors";
import { useSelector } from "react-redux";
import MemberSection, { MemberList } from "./MemberGarden";

const GardenImage = ({ src, onImageClick }) => (
  <div className="flex justify-center items-center p-4 w-full">
    {src ? (
      <img
        src={src}
        alt="Garden"
        className="w-full h-64 rounded-xl shadow-md object-cover border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onImageClick}
      />
    ) : (
      <div
        className="w-full h-64 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 hover:border-green-400 transition-all duration-200"
        onClick={onImageClick}
      >
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-600">Thêm hình ảnh</p>
        <p className="text-sm text-gray-500">Nhấn để tải lên</p>
      </div>
    )}
  </div>
);

const SensorReading = ({ label, value, unit, icon }) => {
  const formattedValue =
    typeof value === "number" ? value.toFixed(2) : value ?? "---";

  return (
    <div className="mx-2 my-3 flex justify-between items-center">
      <div className="flex items-center space-x-2 min-w-[140px]">
        <span className="text-xl">{icon}</span>
        <p className="font-semibold text-gray-600 truncate">{label}:</p>
      </div>
      <div className="flex items-center space-x-1">
        <p className="text-gray-800 font-medium min-w-[50px] text-right">
          {formattedValue}
        </p>
        <p className="text-gray-500 text-sm">{unit}</p>
      </div>
    </div>
  );
};

const ModeSelector = ({ currentMode, onChange }) => {
  const lang = i18n.language;
  
  const modes = [i18n.t("manual"), i18n.t("schedule"), i18n.t("threshold")];
  let modeMap = {
    "Thủ công": "manual",
    "Theo lịch": "schedule",
    Ngưỡng: "threshold",
  };
  if (lang === "en") {
    modeMap = {
      Manual: "manual",
      Schedule: "schedule",
      Threshold: "threshold",
    };
  }
  // console.log(currentMode, "---", modeMap);

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

export const DetailedGardenInfo = ({ deviceId, isOwner }) => {
  const [loading, setLoading] = useState(true);
  const [gardenData, setGardenData] = useState(null);
  const [sensorsMap, setSensorsMap] = useState({});
  const [controlsMap, setControlsMap] = useState({});
  // const [waterOn, setWaterOn] = useState(false);
  // const [lightOn, setLightOn] = useState(false);
  // const [windOn, setWindOn] = useState(false);
  const allControlNames = ["water", "light", "wind"];
  const [controlModes, setControlModes] = useState({});
  const [controlStatuses, setControlStatuses] = useState({});
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

  const translateSensorType = (sensorType) => {
    const translationMap = {
      moisture: {
        label:i18n.t("soil_moisture"),
        unit: "%",
        icon: <Droplets size={18} color="#38bdf8" />, // sky-400
      },
      temperature: {
        label: i18n.t("temperature"),
        unit: "°C",
        icon: <Thermometer size={18} color="#f87171" />, // red-400
      },
      humidity: {
        label: i18n.t("airHumidity"),
        unit: "%",
        icon: <CloudRain size={18} color="#60a5fa" />, // blue-400
      },
      stream: {
        label: i18n.t("waterFlow"),
        unit: "m³/s",
        icon: <ShowerHead size={18} color="#34d399" />, // green-400
      },
      luminosity: {
        label: i18n.t("light_intensity"),
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
      device.members = result.members || [];
      setGardenData(device);
      // console.log(device);

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

      const updatedStatuses = {};
      allControlNames.forEach((name) => {
        const control = device.controls.find((c) => c.name === name);
        updatedStatuses[name] = control?.status ?? false;
      });

      setControlStatuses(updatedStatuses);

      // Update states with new data
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

      // Update control statuses with actual values from API
      if (waterControl) {
        // setWaterOn(waterControl.status);
        setControlStatuses((prev) => ({ ...prev, water: waterControl.status }));
      }
      if (lightControl) {
        // setLightOn(lightControl.status);
        setControlStatuses((prev) => ({ ...prev, light: lightControl.status }));
      }
      if (windControl) {
        // setWindOn(windControl.status);
        setControlStatuses((prev) => ({ ...prev, wind: windControl.status }));
      }
    } catch (error) {
      console.error("Error fetching garden data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchGardenData();
    // Set up polling
    const intervalId = setInterval(fetchGardenData, 2000); // Fetch every 1 second
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

    // Optimistically update the status in the UI
    setControlStatuses((prev) => ({
      ...prev,
      [controlName]: newStatus,
    }));
    setControlModes((prev) => ({
      ...prev,
      [controlName]: "manual",
    }));

    // console.log(currentStatus, newStatus);

    try {
      // Send the request to the backend to update control status
      await updateControlById({
        id_esp: deviceId,
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

    // Turn off the control when changing modes
    setControlStatuses((prev) => ({
      ...prev,
      [controlName]: false,
    }));

    // Update specific control state
    // if (controlName === "water") setWaterOn(false);
    // if (controlName === "light") setLightOn(false);
    // if (controlName === "wind") setWindOn(false);

    try {
      await updateControlById({
        id_esp: deviceId,
        controlId: controlId,
        data: {
          mode: newMode,
          status: false, // Turn off the control
        },
      });
    } catch (error) {
      // Revert on error
      setControlModes((prev) => ({
        ...prev,
        [controlName]: currentMode,
      }));
      setControlStatuses((prev) => ({
        ...prev,
        [controlName]: controlStatuses[controlName],
      }));
      // Revert specific control state
      // if (controlName === "water") setWaterOn(controlStatuses.water);
      // if (controlName === "light") setLightOn(controlStatuses.light);
      // if (controlName === "wind") setWindOn(controlStatuses.wind);

      apiResponseHandler(
        `Failed to update mode for ${controlName}. Please try again.`
      );
    }
  };

  const handleImageClick = async (isOwner) => {
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể thay đổi ảnh", "error");
      return;
    }
    try {
      // Create a file input element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          // Check file size (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            apiResponseHandler("Ảnh vượt quá dung lượng tối đa 2MB", "error");
            return;
          }
          try {
            const formData = new FormData();
            formData.append("img_area", file); // Changed from 'image' to 'img_area' to match backend

            const response = await uploadImage(deviceId, formData);
            if (response.message === "Device image updated") {
              apiResponseHandler("Đã cập nhật ảnh thiết bị", "success");
              // Update the image URL in the state
              setGardenData((prev) => ({
                ...prev,
                img_area: response.img_area,
              }));
            } else {
              apiResponseHandler(
                response.message || "Không thể cập nhật ảnh",
                "error"
              );
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            apiResponseHandler(
              error.response?.data?.message || "Không thể cập nhật ảnh",
              "error"
            );
          }
        }
      };

      // Trigger file selection
      input.click();
    } catch (error) {
      console.error("Error handling image click:", error);
      apiResponseHandler("Không thể cập nhật ảnh", "error");
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

  const onRemoveMember = async (member) => {
    try {
      // First confirmation: Remove member
      const confirmRemove = await areUSurePopup(
        `Bạn có chắc chắn muốn xóa <strong style="color: #dc2626;">${member.name}</strong> khỏi thiết bị?`,
        "warning" // Showing a warning message
      );
      if (confirmRemove) {
        // Second confirmation: Block member
        const confirmBlock = await areUSurePopup(
          `Bạn có muốn thêm <strong style="color: #dc2626;">${member.name}</strong> vào danh sách chặn?`,
          "question" // Showing a question message
        );
        // console.log(confirmBlock);
        if (confirmBlock) {
          // Block member if confirmed
          await removeMemberByIdDevice(deviceId, member.userId);
          await addBlockMember(deviceId, member.userId);
          apiResponseHandler(
            `Đã xóa "${member.name}" khỏi thiết bị`,
            "success"
          );
        }
      } else if (!confirmRemove) {
        // User cancelled the first confirmation
        return;
      } else {
        const response = await removeMemberByIdDevice(deviceId, member.userId);
        if (response.success) {
          apiResponseHandler(
            `Đã xóa "${member.name}" khỏi thiết bị`,
            "success"
          );
        } else {
          apiResponseHandler(
            response.message || "Không thể xóa thành viên",
            "error"
          );
        }
      }
    } catch (error) {
      if (error === "cancelled") return; // User cancelled the confirmation
      apiResponseHandler("Không thể xóa thành viên", "error");
    }
  };

  return (
    <div className="mx-5 bg-white rounded-xl shadow-md py-2 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-10 items-stretch">
      {/* Image Section */}
      <div className="col-span-1 flex flex-col md:border-r">
        <h2 className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          {i18n.t("image")}
        </h2>
        <GardenImage
          src={imageUrl}
          onImageClick={() => handleImageClick(isOwner)}
        />
      </div>

      {/* Sensor Section */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col justify-center space-y-2">
        <h2 className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          {i18n.t("sensor")}
        </h2>
        <div className="flex flex-col flex-grow justify-center">
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
          {i18n.t("control")}
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
                      ? i18n.t("water")
                      : name === "light"
                      ? i18n.t("light")
                      : i18n.t("wind")}
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
                    {i18n.t("mode")}
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
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <MemberList
            members={gardenData.members}
            onEdit={onRemoveMember}
            isOwner={isOwner}
          />
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
          {i18n.t("image")}
        </div>
        <div className="h-48 bg-gray-200 rounded-lg m-4"></div>
      </div>

      {/* Sensor Section Skeleton */}
      <div className="col-span-1 md:border-r border-gray-200 h-full min-h-[200px] flex flex-col space-y-4">
        <div className="text-lg font-bold text-center py-2 px-2 border-b mx-4 border-green-400 text-green-800 uppercase tracking-wide">
          {i18n.t("sensor")}
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
          {i18n.t("control")}
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
          {i18n.t("member")}
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
