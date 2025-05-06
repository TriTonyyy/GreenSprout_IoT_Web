import { React, useEffect, useState } from "react";
import { dayOrder } from "./IrrigationModeSection";
import i18n from "../../../i18n";

const ScheduleEditor = ({ schedule, onChange, onSave, onCancel, isOwner }) => {
  const [localDuration, setLocalDuration] = useState(
    Math.floor((schedule?.duration || 60) / 60)
  );

  const convertTo24Hour = (time12) => {
    if (!time12) return "00:00";
    try {
      const [time, modifier] = time12.split(" ");
      let [hours, minutes] = time.split(":");
      if (modifier === "PM" && hours !== "12") {
        hours = String(parseInt(hours, 10) + 12);
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }
      return `${hours.padStart(2, "0")}:${minutes}`;
    } catch (error) {
      console.error("Error converting time:", error);
      return "00:00";
    }
  };

  const convertTo12Hour = (time24) => {
    if (!time24) return "12:00 AM";
    try {
      const [hourStr, minute] = time24.split(":");
      let hour = parseInt(hourStr, 10);
      const suffix = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${suffix}`;
    } catch (error) {
      console.error("Error converting time:", error);
      return "12:00 AM";
    }
  };

  const handleTimeChange = (e) => {
    const time24 = e.target.value;
    if (!time24) return;
    const time12 = convertTo12Hour(time24);
    onChange(schedule._id, "startTime", time12);
  };

  useEffect(() => {
    // Keep local state in sync when schedule prop changes
    setLocalDuration(Math.floor((schedule?.duration || 60) / 60));
  }, [schedule?.duration]);

  const handleDurationChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 1;

    // Clamp value to [1, 30]
    if (value < 1) value = 1;
    if (value > 30) value = 30;

    setLocalDuration(value);
    onChange(schedule._id, "duration", value * 60);
  };

  const handleRepeatChange = (day) => {
    const currentRepeat = schedule.repeat || [];
    const updatedRepeat = currentRepeat.includes(day)
      ? currentRepeat.filter((d) => d !== day)
      : [...currentRepeat, day];
    onChange(schedule._id, "repeat", updatedRepeat);
  };

  return (
    <div
      className="mt-4 bg-white border rounded-md p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Giờ tưới</label>
        <input
          type="time"
          className={`border rounded px-2 py-1 w-full ${
            !isOwner ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          value={convertTo24Hour(schedule?.startTime || "12:00 AM")}
          onChange={handleTimeChange}
          disabled={!isOwner}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {i18n.t("irrigationTime")} ({i18n.t("minute")})
        </label>
        <input
          type="number"
          min="1"
          max="30"
          step="1"
          className={`border rounded px-2 py-1 w-full ${
            !isOwner ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          value={localDuration}
          onChange={handleDurationChange}
          disabled={!isOwner}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Lặp lại</label>
        <div className="flex flex-wrap gap-2">
          {dayOrder.map((day) => (
            <button
              key={day}
              className={`w-10 h-10 rounded-full text-sm font-semibold border flex items-center justify-center ${
                schedule.repeat && schedule.repeat.includes(day)
                  ? "bg-orange-400 text-white border-orange-400"
                  : "text-gray-600 border-gray-300 hover:border-orange-300"
              } ${!isOwner ? "cursor-not-allowed opacity-75" : ""}`}
              onClick={(e) => {
                if (!isOwner) return;
                e.stopPropagation();
                handleRepeatChange(day);
              }}
              disabled={!isOwner}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={onCancel}
        >
          Huỷ
        </button>
        {isOwner && (
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onSave(schedule._id, schedule)}
          >
            Lưu
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleEditor;
