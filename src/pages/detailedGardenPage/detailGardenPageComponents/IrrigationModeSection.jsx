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
import i18n from "../../../i18n";

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
  2: i18n.t("days.T2"), // Translation for "T2"
  3: i18n.t("days.T3"), // Translation for "T3"
  4: i18n.t("days.T4"), // Translation for "T4"
  5: i18n.t("days.T5"), // Translation for "T5"
  6: i18n.t("days.T6"), // Translation for "T6"
  7: i18n.t("days.T7"), // Translation for "T7"
  CN: i18n.t("days.CN"), // Translation for "CN"
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
        i18n.t("ownerOnlySensorThreshold"),
        "error"
      );
      return;
    }

    const thresholds = sensorThresholds[selectedControl];
    const controlId = controlIds[selectedControl];

    if (!controlId) {
      console.error(`❌ Control ID not loaded for: ${selectedControl}`);
      apiResponseHandler(i18n.t("noDeviceFoundForUpdate"), "error");
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

      apiResponseHandler(i18n.t("sensorThresholdUpdated"), "success");
    } catch (err) {
      console.error(" Lỗi khi cập nhật ngưỡng:", err);
      apiResponseHandler(i18n.t("sensorThresholdUpdateError"), "error");
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
      apiResponseHandler(i18n.t("loadIrrigationScheduleError"), "error");
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
    const newSchedule = {
      startTime: "12:00 AM",
      duration: 60, // Set default duration to 60 minutes
      status: false,
      repeat: [],
    };

    try {
      // Step 1: Create schedule in the database
      const response = await createSchedule({
        id_esp: deviceId,
        name: deviceType,
        data: newSchedule,
      });

      const createdSchedule = response.data;
      console.log(createdSchedule);

      // Step 2: Ensure the duration is set to a number
      createdSchedule.duration = parseInt(createdSchedule.duration) || 60;

      // Step 3: Process the new schedule for UI (map repeat days)
      if (createdSchedule.repeat && Array.isArray(createdSchedule.repeat)) {
        createdSchedule.repeat = createdSchedule.repeat.map(
          (day) => weekdayMap[day] || day
        );
      }

      // Step 4: Fetch the updated schedule list from the backend
      const refreshedSchedules = await fetchScheduleById(deviceId); // Re-fetch schedules to ensure UI consistency

      // Step 5: Select the last schedule (the newly added one) from the list
      const lastSchedule = refreshedSchedules[refreshedSchedules.length - 1]; // Get the last schedule in the updated list
      setSelectedSchedule(lastSchedule._id); // Automatically select the last schedule
      setOriginalSchedule({ ...lastSchedule });

      // Step 6: Optionally, update the schedule list state
      setSchedules(refreshedSchedules);
      apiResponseHandler(i18n.t("createIrrigationScheduleSuccess"), "success");
    } catch (error) {
      console.error("Failed to create schedule:", error);
      apiResponseHandler(i18n.t("createIrrigationScheduleError"), "error");
    }
  };

  const saveSchedule = async (scheduleId, updatedSchedule) => {
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

        apiResponseHandler(i18n.t("updateIrrigationScheduleSuccess"), "success");
      } else {
        apiResponseHandler(i18n.t("updateIrrigationScheduleFailed"), "error");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      if (error.response?.status === 500) {
        apiResponseHandler(i18n.t("serverErrorUpdateIrrigationSchedule"), "error");
      } else {
        apiResponseHandler(i18n.t("errorUpdatingIrrigationSchedule"), "error");
      }
    }
  };

  const changeSchedule = (id, field, value) => {
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

  const handleCancelEdit = async () => {
    await fetchScheduleById(deviceId); // re-fetch original list
    setSelectedSchedule(null);
    setOriginalSchedule(null);
  };

  const handleScheduleClick = async (id) => {
    if (selectedSchedule === id) {
      setSelectedSchedule(null);
      setOriginalSchedule(null);
      return;
    }
    const current = schedules.find((s) => s._id === selectedSchedule);

    if (hasUnsavedChanges(current, originalSchedule)) {
      try {
        const confirmed = await areUSurePopup(
          i18n.t("unsavedChangesPrompt")
        );
        if (!confirmed) {
          // Restore old values
          handleCancelEdit();
          return;
        }
      } catch (error) {
        if (error === "cancelled") {
          setSchedules((prev) =>
            prev.map((s) =>
              s._id === current._id ? { ...originalSchedule } : s
            )
          );
          setSelectedSchedule(null);
          setTimeout(() => {
            setSelectedSchedule(current._id);
          }, 0);
        }
        return;
      }
    }

    // Normal selection
    setSelectedSchedule(id);
    const newSelected = schedules.find((s) => s._id === id);
    setOriginalSchedule({ ...newSelected });
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
    try {
      await areUSurePopup(i18n.t("confirmDeleteIrrigationSchedule"));

      // If we get here, user confirmed
      const response = await deleteSchedule(deviceId, id);

      if (response) {
        // Update local state
        setSchedules((prev) => prev.filter((s) => s._id !== id));

        // Reset selection if the deleted one was selected
        if (selectedSchedule === id) {
          setSelectedSchedule(null);
          setOriginalSchedule(null);
        }

        apiResponseHandler(i18n.t("deleteIrrigationScheduleSuccess"), "success");
      }
    } catch (error) {
      if (error === "cancelled") {
        return; // User cancelled, do nothing
      }
      console.error("Error deleting schedule:", error);
      if (error.response?.status === 500) {
        apiResponseHandler(i18n.t("serverErrorDeleteIrrigationSchedule"), "error");
      } else {
        apiResponseHandler(i18n.t("errorDeletingIrrigationSchedule"), "error");
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
      apiResponseHandler(i18n.t("updateIrrigationStatusError"), "error");
    }
  };

  return (
    <div className="mx-5 bg-white rounded-xl shadow-lg p-6 my-4 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 px-2 text-gray-800">
        {i18n.t("irrigationSchedule")}
      </h2>
      {/* Mode and Control Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 mb-8 gap-4">
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          setSelectedSchedule={setSelectedSchedule}
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
          onScheduleCancel={handleCancelEdit}
          onScheduleToggleStatus={handleScheduleToggleStatus}
          selectedControl={selectedControl}
          onAddSchedule={handleAddSchedule}
        />
      )}

      {activeMode === "CAM_BIEN" && (
        <SensorConfigPanel
          selectedControl={selectedControl}
          sensorThresholds={sensorThresholds}
          onThresholdChange={updateSensorThreshold}
          onSubmit={handleSensorConfigSubmit}
        />
      )}
    </div>
  );
}
