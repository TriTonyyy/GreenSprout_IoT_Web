import React, { useEffect, useState } from "react";
import {
  createSchedule,
  deleteSchedule,
  getSchedule,
  updateSchedule,
} from "../../../api/scheduleApi";
import {
  apiResponseHandler,
  areUSurePopup,
} from "../../../components/Alert/alertComponent";
import { getGardenByDevice, updateControlById } from "../../../api/deviceApi";
import { getUserInfoAPI } from "../../../api/authApi";
import ModeSelector from "./ModeSelector";
import ControlSelector from "./ControlSelector";
import ScheduleList from "./ScheduleList";
import SensorConfigPanel from "./SensorConfigPanel";

// Day mapping constants
export const dayOrder = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const weekdayMap = {
  Monday: "T2",
  Tuesday: "T3",
  Wednesday: "T4",
  Thursday: "T5",
  Friday: "T6",
  Saturday: "T7",
  Sunday: "CN",
};
const dayCodeToWeekday = {
  T2: "Monday",
  T3: "Tuesday",
  T4: "Wednesday",
  T5: "Thursday",
  T6: "Friday",
  T7: "Saturday",
  CN: "Sunday",
};
// For displaying in the UI
export const dayDisplayMap = {
  2: "T2",
  3: "T3",
  4: "T4",
  5: "T5",
  6: "T6",
  7: "T7",
  CN: "CN",
};

export default function IrrigationModeSection({ deviceId }) {
  const [activeMode, setActiveMode] = useState("THEO_LICH");
  const [schedules, setSchedules] = useState([]);
  const [selectedControl, setSelectedControl] = useState("water");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [originalSchedule, setOriginalSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [gardenData, setGardenData] = useState(null);

  // Local state storing threshold values for each control type (water, light, wind)
  const [sensorThresholds, setSensorThresholds] = useState({
    water: { min: "", max: "" },
    light: { min: "", max: "" },
    wind: { min: "", max: "" },
  });

  const [controlIds, setControlIds] = useState({});

  // Updates the min/max threshold value locally for the selected control type
  const updateSensorThreshold = (type, field, value) => {
    setSensorThresholds((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  // Submits the min/max thresholds for the selected control (water/light/wind)
  const handleSensorConfigSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      apiResponseHandler(
        "Chỉ chủ sở hữu mới có thể thay đổi ngưỡng cảm biến",
        "error"
      );
      return;
    }

    const thresholds = sensorThresholds[selectedControl];
    const controlId = controlIds[selectedControl];

    if (!controlId) {
      console.error(`❌ Control ID not loaded for: ${selectedControl}`);
      apiResponseHandler("Không tìm thấy thiết bị để cập nhật", "error");
      return;
    }

    // Convert the values based on control type
    const payload = {
      threshold_min:
        selectedControl === "wind"
          ? convertToDisplayValue(thresholds.min || 0, "wind")
          : Number(thresholds.min),
      threshold_max:
        selectedControl === "wind"
          ? convertToDisplayValue(thresholds.max || 100, "wind")
          : Number(thresholds.max),
    };

    try {
      await updateControlById({
        id_esp: deviceId,
        controlId,
        data: payload,
      });

      apiResponseHandler(" Ngưỡng cảm biến đã được cập nhật", "success");
    } catch (err) {
      console.error(" Lỗi khi cập nhật ngưỡng:", err);
      apiResponseHandler("Lỗi khi cập nhật ngưỡng cảm biến", "error");
    }
  };

  // Convert day codes to weekday names for API
  const convertToWeekdayNames = (dayCodes) => {
    if (!Array.isArray(dayCodes)) return [];
    return dayCodes.map((code) => dayCodeToWeekday[code] || code);
  };

  const fetchScheduleById = async (deviceId) => {
    setLoading(true);
    try {
      const result = await getSchedule(deviceId, selectedControl);
      let scheduleData = result.data;

      // Process the data to convert weekday names to day codes for UI
      const processedSchedules = scheduleData.map((schedule) => {
        const processedSchedule = { ...schedule };
        if (
          processedSchedule.repeat &&
          Array.isArray(processedSchedule.repeat)
        ) {
          processedSchedule.repeat = processedSchedule.repeat.map(
            (day) => weekdayMap[day] || day
          );
        }
        return processedSchedule;
      });

      setSchedules(processedSchedules);
      return processedSchedules;
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      apiResponseHandler("Lỗi khi tải lịch tưới", "error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleById(deviceId);
  }, [deviceId]);

  useEffect(() => {
    if (selectedControl) {
      fetchScheduleById(deviceId);
    }
  }, [selectedControl, deviceId]);

  // Fetch controlId and threshold data for a specific control type from garden/device data
  const fetchControlThresholdInfo = async (deviceId, controlType) => {
    try {
      const res = await getGardenByDevice(deviceId);
      const device = res.data;

      if (!device || !device.controls || !Array.isArray(device.controls)) {
        throw new Error("Invalid device or controls data");
      }

      const control = device.controls.find((c) => c.name === controlType);

      if (!control) {
        throw new Error(`Control type "${controlType}" not found`);
      }

      const { _id: controlId, threshold_min, threshold_max } = control;

      // For wind control, convert temperature back to percentage for UI
      const convertedMin =
        controlType === "wind"
          ? (threshold_min / MAX_VALUES.wind) * 100
          : threshold_min;
      const convertedMax =
        controlType === "wind"
          ? (threshold_max / MAX_VALUES.wind) * 100
          : threshold_max;

      // Update the local state (for input binding)
      setSensorThresholds((prev) => ({
        ...prev,
        [controlType]: {
          min: convertedMin ?? "",
          max: convertedMax ?? "",
        },
      }));

      return {
        controlId,
        threshold_min: convertedMin,
        threshold_max: convertedMax,
      };
    } catch (error) {
      console.error("❌ Failed to fetch control threshold info:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAndMapControlInfo = async () => {
      if (!selectedControl || !deviceId) return;

      const result = await fetchControlThresholdInfo(deviceId, selectedControl);
      if (!result) return;

      const { controlId, threshold_min, threshold_max } = result;

      // Update threshold state
      setSensorThresholds((prev) => ({
        ...prev,
        [selectedControl]: {
          min: threshold_min ?? "",
          max: threshold_max ?? "",
        },
      }));

      // Update control ID map
      setControlIds((prev) => ({
        ...prev,
        [selectedControl]: controlId,
      }));
    };

    fetchAndMapControlInfo();
  }, [selectedControl, deviceId]);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const user = await getUserInfoAPI();
        const gardenData = await getGardenByDevice(deviceId);
        setGardenData(gardenData.data);
        const isDeviceOwner = gardenData.data.members?.some(
          (member) => member.userId === user.data._id && member.role === "owner"
        );
        setIsOwner(isDeviceOwner);
      } catch (error) {
        console.error("Error checking ownership:", error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [deviceId]);

  const handleAddSchedule = async (deviceType) => {
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể thêm lịch tưới", "error");
      return;
    }

    const newSchedule = {
      startTime: "12:00 AM",
      duration: 60, // Set default duration to 60 minutes
      status: false,
      repeat: [],
    };

    try {
      const response = await createSchedule({
        id_esp: deviceId,
        name: deviceType,
        data: newSchedule,
      });
      
      const createdSchedule = response.data;
      // Ensure duration is set to a number
      createdSchedule.duration = parseInt(createdSchedule.duration) || 60;
      
      // Process the new schedule for UI
      if (createdSchedule.repeat && Array.isArray(createdSchedule.repeat)) {
        createdSchedule.repeat = createdSchedule.repeat.map(
          (day) => weekdayMap[day] || day
        );
      }
      
      // Update local state
      setSchedules(prev => [...prev, createdSchedule]);
      
      // Select the new schedule
      setSelectedSchedule(createdSchedule._id);
      setOriginalSchedule({ ...createdSchedule });
      
      apiResponseHandler("Tạo lịch tưới mới thành công", "success");
    } catch (error) {
      console.error("Failed to create schedule:", error);
      apiResponseHandler("Lỗi khi tạo lịch tưới mới", "error");
    }
  };

  const saveSchedule = async (scheduleId, updatedSchedule) => {
    if (!isOwner) {
      apiResponseHandler(
        "Chỉ chủ sở hữu mới có thể thay đổi lịch tưới",
        "error"
      );
      return;
    }

    try {
      // Format the data according to the required structure
      const formattedData = {
        status:
          updatedSchedule?.status !== undefined
            ? Boolean(updatedSchedule.status)
            : false,
        startTime: updatedSchedule?.startTime || "12:00 AM",
        duration: updatedSchedule?.duration
          ? parseInt(updatedSchedule.duration)
          : 60,
        repeat: Array.isArray(updatedSchedule?.repeat)
          ? convertToWeekdayNames(updatedSchedule.repeat)
          : [],
      };

      const response = await updateSchedule({
        id_esp: deviceId,
        scheduleId,
        data: formattedData,
      });

      // Check if the response exists and has data
      if (response && response.data) {
        // Update local state with the new schedule data
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule._id === scheduleId
              ? { ...updatedSchedule, _id: scheduleId }
              : schedule
          )
        );

        // Close the selected schedule
        setSelectedSchedule(null);
        setOriginalSchedule(null);

        apiResponseHandler("Cập nhật lịch tưới thành công", "success");
      } else {
        apiResponseHandler("Cập nhật lịch tưới thất bại", "error");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      if (error.response?.status === 500) {
        apiResponseHandler("Lỗi máy chủ khi cập nhật lịch tưới", "error");
      } else {
        apiResponseHandler("Có lỗi xảy ra khi cập nhật lịch tưới", "error");
      }
    }
  };

  const changeSchedule = (id, field, value) => {
    // console.log("Changing schedule:", { id, field, value });
    setSchedules((prev) =>
      prev.map((schedule) => {
        if (schedule._id === id) {
          const updated = { ...schedule };
          if (field === "repeat") {
            // Ensure value is an array and sort it
            updated[field] = Array.isArray(value) ? [...value].sort() : [];
          } else if (field === "duration") {
            // Ensure duration is a number
            updated[field] = parseInt(value) || 60;
          } else if (field === "startTime") {
            // Ensure startTime is a valid string
            updated[field] = value || "12:00 AM";
          } else if (field === "status") {
            // Ensure status is a boolean
            updated[field] = Boolean(value);
          } else {
            updated[field] = value;
          }
          return updated;
        }
        return schedule;
      })
    );
  };

  const handleScheduleClick = async (id) => {
    // If clicking the same one, just close
    if (selectedSchedule === id) {
      setSelectedSchedule(null);
      setOriginalSchedule(null);
      return;
    }

    const current = schedules.find((s) => s._id === selectedSchedule);

    // Check for unsaved changes
    if (hasUnsavedChanges(current, originalSchedule)) {
      try {
        const confirmed = await areUSurePopup(
          "Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy thay đổi?"
        );
        if (!confirmed) {
          // ❗ Restore the old values before leaving
          setSchedules((prev) =>
            prev.map((s) =>
              s._id === current._id ? { ...originalSchedule } : s
            )
          );
          setSelectedSchedule(null);
          setOriginalSchedule(null);
          return;
        }
      } catch (error) {
        if (error === "cancelled") {
          // ❗ Restore the old values if user cancels
          setSchedules((prev) =>
            prev.map((s) =>
              s._id === current._id ? { ...originalSchedule } : s
            )
          );
        }
        return;
      }
    }
    // Set new selection
    setSelectedSchedule(id);
    const newSelected = schedules.find((s) => s._id === id);
    setOriginalSchedule({ ...newSelected }); // store original state
  };

  const hasUnsavedChanges = (current, original) => {
    if (!current || !original) return false;
    return (
      current.startTime !== original.startTime ||
      current.duration !== original.duration ||
      JSON.stringify(current.repeat) !== JSON.stringify(original.repeat)
    );
  };

  const removeSchedule = async (id) => {
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể xóa lịch tưới", "error");
      return;
    }

    try {
      await areUSurePopup("Bạn có chắc chắn muốn xóa lịch tưới này?");
      
      // If we get here, user confirmed
      const response = await deleteSchedule(deviceId, id);
      
      if (response) {
        // Update local state
        setSchedules(prev => prev.filter(s => s._id !== id));
        
        // Reset selection if the deleted one was selected
        if (selectedSchedule === id) {
          setSelectedSchedule(null);
          setOriginalSchedule(null);
        }
        
        apiResponseHandler("Xóa lịch tưới thành công", "success");
      }
    } catch (error) {
      if (error === "cancelled") {
        return; // User cancelled, do nothing
      }
      console.error("Error deleting schedule:", error);
      if (error.response?.status === 500) {
        apiResponseHandler("Lỗi máy chủ khi xóa lịch tưới", "error");
      } else {
        apiResponseHandler("Có lỗi xảy ra khi xóa lịch tưới", "error");
      }
    }
  };

  const MAX_VALUES = {
    water: 100, // %
    light: 100, // %
    wind: 50, // °C - typical max temperature for garden monitoring
  };

  const convertToDisplayValue = (value, controlType) => {
    if (controlType === "wind") {
      return Math.round((value / 100) * MAX_VALUES.wind);
    }
    return value;
  };

  const handleScheduleToggleStatus = async (id, status) => {
    try {
      // Update the schedule status in the database
      await updateSchedule({
        id_esp: deviceId,
        scheduleId: id,
        data: { status },
      });

      // Update local state
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule._id === id ? { ...schedule, status } : schedule
        )
      );
    } catch (error) {
      console.error("Failed to toggle schedule status:", error);
      apiResponseHandler("Lỗi khi cập nhật trạng thái lịch tưới", "error");
    }
  };

  return (
    <div className="mx-5 bg-white rounded-xl shadow-lg p-6 my-4 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 px-2 text-gray-800">Lịch tưới</h2>
      {/* Mode and Control Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 mb-8 gap-4">
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          setSelectedSchedule={setSelectedSchedule}
          isOwner={isOwner}
        />
        <ControlSelector
          selectedControl={selectedControl}
          setSelectedControl={setSelectedControl}
        />
      </div>

      {activeMode === "THEO_LICH" && (
        <ScheduleList
          schedules={schedules}
          loading={loading}
          selectedSchedule={selectedSchedule}
          onScheduleSelect={handleScheduleClick}
          onScheduleDelete={removeSchedule}
          onScheduleChange={changeSchedule}
          onScheduleSave={saveSchedule}
          onScheduleCancel={() => {
            setSelectedSchedule(null);
            setOriginalSchedule(null);
          }}
          onScheduleToggleStatus={handleScheduleToggleStatus}
          selectedControl={selectedControl}
          onAddSchedule={handleAddSchedule}
          isOwner={isOwner}
        />
      )}

      {activeMode === "CAM_BIEN" && (
        <SensorConfigPanel
          selectedControl={selectedControl}
          sensorThresholds={sensorThresholds}
          onThresholdChange={updateSensorThreshold}
          onSubmit={handleSensorConfigSubmit}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
