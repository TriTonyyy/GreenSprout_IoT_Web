import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
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
import { updateThreshold } from "../../../api/thresholdApi";
import { getGardenByDevice } from "../../../api/deviceApi";

// Day mapping constants
const dayOrder = ["2", "3", "4", "5", "6", "7", "CN"];
const weekdayMap = {
  Monday: "2",
  Tuesday: "3",
  Wednesday: "4",
  Thursday: "5",
  Friday: "6",
  Saturday: "7",
  Sunday: "CN",
};
const dayCodeToWeekday = {
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
  CN: "Sunday",
};
// For displaying in the UI
const dayDisplayMap = {
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
  const maxDuration = 15 * 60; // 15 minutes in seconds

  // Local state storing threshold values for each control type (water, light, wind)
  const [sensorThresholds, setSensorThresholds] = useState({
    water: { min: "", max: "" },
    light: { min: "", max: "" },
    wind: { min: "", max: "" },
  });

  const [controlIds, setControlIds] = useState({}); // New: { water: 'id123', ... }

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

    const thresholds = sensorThresholds[selectedControl];
    const controlId = controlIds[selectedControl];

    if (!controlId) {
      console.error(`❌ Control ID not loaded for: ${selectedControl}`);
      apiResponseHandler("Không tìm thấy thiết bị để cập nhật", "error");
      return;
    }

    const payload = {
      threshold_min: Number(thresholds.min),
      threshold_max: Number(thresholds.max),
    };

    try {
      await updateThreshold({
        id_esp: deviceId,
        controlId,
        data: payload,
      });

      apiResponseHandler("✅ Ngưỡng cảm biến đã được cập nhật", "success");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật ngưỡng:", err);
      apiResponseHandler("Lỗi khi cập nhật ngưỡng cảm biến", "error");
    }
  };

  // Utility functions for conversion
  const convertTo24Hour = (time12) => {
    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const convertTo12Hour = (time24) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${suffix}`;
  };

  // Convert weekday names to day codes for UI
  const convertToDayCodes = (weekdayNames) => {
    if (!Array.isArray(weekdayNames)) return [];
    return weekdayNames.map((day) => weekdayMap[day] || day);
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
        // Make a copy of the schedule object
        const processedSchedule = { ...schedule };

        // Convert weekday names to day codes for UI
        if (
          processedSchedule.repeat &&
          Array.isArray(processedSchedule.repeat)
        ) {
          processedSchedule.repeat = convertToDayCodes(
            processedSchedule.repeat
          );
        }

        return processedSchedule;
      });

      console.log("Processed schedules for UI:", processedSchedules);
      setSchedules(processedSchedules);
      return processedSchedules;
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleById(deviceId);
  }, []);

  useEffect(() => {
    if (selectedControl) {
      fetchScheduleById(deviceId);
    }
  }, [selectedControl]);

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

      // Update the local state (for input binding)
      setSensorThresholds((prev) => ({
        ...prev,
        [controlType]: {
          min: threshold_min ?? "",
          max: threshold_max ?? "",
        },
      }));

      return {
        controlId,
        threshold_min,
        threshold_max,
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

  const handleAddSchedule = async (deviceType) => {
    const newSchedule = {
      startTime: "10:30 AM",
      duration: 60,
      status: false,
      repeat: [],
    };
    try {
      await createSchedule({
        id_esp: deviceId,
        name: deviceType,
        data: newSchedule,
      });
      const updatedSchedules = await fetchScheduleById(deviceId);

      // Select the newest schedule
      const latestSchedule = updatedSchedules?.[updatedSchedules.length - 1];
      if (latestSchedule?._id) {
        setSelectedSchedule(latestSchedule._id);
      }
    } catch (error) {
      console.error("Failed to create schedule:", error);
      apiResponseHandler("Lỗi khi tạo lịch tưới mới", "error");
    }
  };

  const saveSchedule = async (id, schedule) => {
    // Create a copy of the schedule to modify
    const scheduleToSend = { ...schedule };
    // Convert day codes to weekday names for the API
    if (scheduleToSend.repeat && Array.isArray(scheduleToSend.repeat)) {
      scheduleToSend.repeat = convertToWeekdayNames(scheduleToSend.repeat);
    }
    console.log("Sending schedule to API:", scheduleToSend);
    try {
      await updateSchedule({
        id_esp: deviceId,
        scheduleId: id,
        data: scheduleToSend,
      });
      // console.log("Schedule saved successfully");
      apiResponseHandler("Cập nhật lịch tưới thành công", "success");
      await fetchScheduleById(deviceId); // Refresh data after update
    } catch (error) {
      console.error("Failed to save schedule:", error);
      apiResponseHandler("Lỗi khi cập nhật lịch tưới", "error");
    }
  };

  const changeSchedule = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s._id === id
          ? {
              ...s,
              [field]:
                field === "repeat"
                  ? [...value].sort(
                      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
                    )
                  : value,
            }
          : s
      )
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
    try {
      await areUSurePopup("Bạn có chắc chắn muốn xóa lịch tưới này?");
      await deleteSchedule(deviceId, id);
      await fetchScheduleById(deviceId);
      apiResponseHandler("Xóa lịch tưới thành công", "success");

      // Reset selection if the deleted one was selected
      if (selectedSchedule === id) {
        setSelectedSchedule(null);
      }
    } catch (error) {
      if (error === "cancelled") {
        // User canceled deletion, no need to do anything
        return;
      }
      apiResponseHandler("Có lỗi xảy ra trong quá trình!", "error");
    }
  };

  const SelectedSchedule = (s) => {
    return (
      <div
        className="mt-4 bg-white border rounded-md p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Giờ tưới</label>
          <input
            type="time"
            className="border rounded px-2 py-1 w-full"
            value={convertTo24Hour(s.startTime)}
            onChange={(e) =>
              changeSchedule(
                s._id,
                "startTime",
                convertTo12Hour(e.target.value)
              )
            }
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">
            Thời gian tưới (phút)
          </label>
          <input
            type="number"
            max="120"
            className="border rounded px-2 py-1 w-full"
            value={s.duration / 60}
            onChange={(e) =>
              changeSchedule(
                s._id,
                "duration",
                Math.min(
                  Math.max(1, parseInt(e.target.value) * 60),
                  maxDuration
                )
              )
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lặp lại</label>
          <div className="flex gap-1 flex-wrap">
            {dayOrder.map((day) => (
              <button
                key={day}
                className={`w-8 h-8 rounded-full text-sm font-semibold border ${
                  s.repeat && s.repeat.includes(day)
                    ? "bg-orange-400 text-white"
                    : "text-gray-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  const updated =
                    s.repeat && s.repeat.includes(day)
                      ? s.repeat.filter((d) => d !== day)
                      : [...(s.repeat || []), day];
                  changeSchedule(s._id, "repeat", updated);
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        <div
          className="bg-white rounded-md py-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Save & Cancel Buttons */}
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={async (e) => {
                e.stopPropagation();
                const current = schedules.find(
                  (s) => s._id === selectedSchedule
                );
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
                } // Refresh to discard changes
              }}
            >
              Huỷ
            </button>
            <button
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                const updatedSchedule = schedules.find(
                  (s) => s._id === selectedSchedule
                );
                saveSchedule(updatedSchedule._id, {
                  duration: updatedSchedule.duration,
                  repeat: updatedSchedule.repeat,
                  startTime: updatedSchedule.startTime,
                  status: updatedSchedule.status,
                });
                setSelectedSchedule(null); // exit edit mode
              }}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-5 bg-white rounded-xl shadow-md p-4 my-2">
      <h2 className="text-xl font-semibold mb-4 px-2">Lịch tưới</h2>
      {/* Mode and Control Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 mb-6 gap-4">
        {/* Mode Buttons */}
        <div className="flex gap-2">
          {[
            { key: "THEO_LICH", label: "Theo lịch" },
            { key: "CAM_BIEN", label: "Cảm biến" },
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => {
                setActiveMode(mode.key);
                setSelectedSchedule(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeMode === mode.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        {/* Control Buttons */}
        <div className="flex gap-2">
          {[
            { key: "water", label: "Nước" },
            { key: "light", label: "Đèn" },
            { key: "wind", label: "Quạt" },
          ].map((control) => (
            <button
              key={control.key}
              onClick={() => setSelectedControl(control.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedControl === control.key
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {control.label}
            </button>
          ))}
        </div>
      </div>
      {activeMode === "THEO_LICH" && (
        <div className="flex flex-wrap gap-4 px-2 items-start">
          {loading ? (
            <ScheduleSkeleton />
          ) : (
            schedules.map((s) => {
              const isSelected = selectedSchedule === s._id;
              return (
                <div
                  key={s._id}
                  onClick={() => handleScheduleClick(s._id)}
                  className="w-64 relative cursor-pointer"
                >
                  {/* Delete Button */}
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSchedule(s._id);
                    }}
                    title="Xoá lịch tưới"
                  >
                    <X size={16} />
                  </button>

                  <div className="bg-gray-50 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      {s.startTime}
                    </h2>
                    <div className="text-lg font-semibold">
                      <p className="text-sm text-gray-600 py-2">
                        Thời gian tưới: {s.duration / 60} phút
                      </p>
                      <p className="text-sm text-gray-600 py-2">
                        Lặp lại:{" "}
                        {s.repeat && s.repeat.length > 0
                          ? s.repeat
                              .map((day) => dayDisplayMap[day] || day)
                              .join(", ")
                          : "Không lặp lại"}
                      </p>
                    </div>

                    <div className="flex w-4/5 py-2">
                      <span className="font-medium text-gray-700 pr-2">
                        Bật/ Tắt:
                      </span>
                      <ToggleSwitch
                        isOn={s.status}
                        onToggle={() =>
                          changeSchedule(s._id, "status", !s.status)
                        }
                      />
                    </div>
                    {isSelected && SelectedSchedule(s)}
                  </div>
                </div>
              );
            })
          )}
          {/* Add New Clock */}
          {schedules.length < 5 && (
            <div
              className="w-40 p-4 bg-gray-50 rounded-lg shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer min-h-[185px]"
              onClick={() => handleAddSchedule(selectedControl)}
            >
              <span className="text-4xl font-bold">+</span>
            </div>
          )}
        </div>
      )}
      {/* Sensor mode UI panel for editing min/max thresholds per control type (single unified view) */}
      {activeMode === "CAM_BIEN" && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h2 className="font-bold text-lg mb-4">Thiết lập ngưỡng cảm biến</h2>

          {/* Shared threshold form */}
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={handleSensorConfigSubmit}
          >
            <label className="flex flex-col">
              Ngưỡng tối thiểu:
              <input
                type="number"
                value={sensorThresholds[selectedControl]?.min ?? ""}
                onChange={(e) =>
                  updateSensorThreshold(selectedControl, "min", e.target.value)
                }
                className="p-2 border rounded"
              />
            </label>

            <label className="flex flex-col">
              Ngưỡng tối đa:
              <input
                type="number"
                value={sensorThresholds[selectedControl]?.max ?? ""}
                onChange={(e) =>
                  updateSensorThreshold(selectedControl, "max", e.target.value)
                }
                className="p-2 border rounded"
              />
            </label>

            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600"
              >
                Lưu ngưỡng
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="w-64 h-[185px] bg-gray-50 rounded-lg shadow-md p-4 animate-pulse flex flex-col justify-between">
      {/* Time */}
      <div className="h-6 w-24 bg-gray-200 rounded mb-2" />

      {/* Duration & Repeat */}
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded my-2" /> {/* Duration */}
        <div className="h-4 w-40 bg-gray-200 rounded my-2" /> {/* Repeat */}
      </div>

      {/* Toggle row */}
      <div className="flex items-center w-full mt-auto">
        <div className="h-4 w-16 bg-gray-200 rounded mr-4" /> {/* Label */}
        <div className="h-6 w-12 bg-gray-200 rounded-full" /> {/* Toggle */}
      </div>
    </div>
  );
}
