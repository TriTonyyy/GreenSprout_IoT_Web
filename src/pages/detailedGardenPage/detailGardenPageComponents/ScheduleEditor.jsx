import React from 'react';
import { dayOrder } from './IrrigationModeSection';

const ScheduleEditor = ({ schedule, onChange, onSave, onCancel }) => {
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

  return (
    <div className="mt-4 bg-white border rounded-md p-1" onClick={(e) => e.stopPropagation()}>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Giờ tưới</label>
        <input
          type="time"
          className="border rounded px-2 py-1 w-full"
          value={convertTo24Hour(schedule.startTime)}
          onChange={(e) =>
            onChange(schedule._id, "startTime", convertTo12Hour(e.target.value))
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
          value={schedule.duration / 60}
          onChange={(e) =>
            onChange(
              schedule._id,
              "duration",
              Math.min(Math.max(1, parseInt(e.target.value) * 60), 15 * 60)
            )
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Lặp lại</label>
        <div className="flex gap-1 flex-wrap justify-evenly">
          {dayOrder.map((day) => (
            <button
              key={day}
              className={`w-8 h-8 rounded-full text-sm font-semibold border ${
                schedule.repeat && schedule.repeat.includes(day)
                  ? "bg-orange-400 text-white"
                  : "text-gray-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                const updated =
                  schedule.repeat && schedule.repeat.includes(day)
                    ? schedule.repeat.filter((d) => d !== day)
                    : [...(schedule.repeat || []), day];
                onChange(schedule._id, "repeat", updated);
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-md py-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-evenly gap-2">
          <button
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Huỷ
          </button>
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEditor; 