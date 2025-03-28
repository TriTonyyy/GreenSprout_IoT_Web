import React, { useState } from "react";
import { X } from "lucide-react";

const dayOrder = ["2", "3", "4", "5", "6", "7", "CN"];

export default function IrrigationModeSection() {
  const [activeMode, setActiveMode] = useState("THEO_LICH");
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      time: "09:00",
      duration: 30,
      repeat: ["2", "4", "6"],
      enabled: false,
    },
  ]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const formatTimeDisplay = (time24) => {
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${suffix}`;
  };

  const handleAddSchedule = () => {
    const newId = schedules.length + 1;
    const newSchedule = {
      id: newId,
      time: "13:00",
      duration: 10,
      repeat: [],
      enabled: false,
    };
    setSchedules([...schedules, newSchedule]);
    setSelectedScheduleId(newId);
  };

  const handleScheduleClick = (id) => {
    setSelectedScheduleId((prev) => (prev === id ? null : id));
  };

  const updateSchedule = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
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

  const deleteSchedule = (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (selectedScheduleId === id) {
      setSelectedScheduleId(null);
    }
  };

  return (
    <div className="w-4/5 mx-auto bg-white rounded-xl shadow-md p-4 mt-8">
      <h2 className="text-xl font-semibold mb-4 px-2">Lịch tưới</h2>

      {/* Mode Switch Bar */}
      <div className="flex gap-2 px-2 mb-6">
        {[
          { key: "CAM_BIEN", label: "Cảm biến" },
          { key: "THEO_LICH", label: "Theo lịch" },
        ].map((mode) => (
          <button
            key={mode.key}
            onClick={() => {
              setActiveMode(mode.key);
              setSelectedScheduleId(null);
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

      {/* Mode-Specific Content */}
      {activeMode === "THEO_LICH" && (
        <div className="flex flex-wrap gap-4 px-2 items-start">
          {schedules.map((s) => {
            const isSelected = selectedScheduleId === s.id;

            return (
              <div
                key={s.id}
                onClick={() => handleScheduleClick(s.id)}
                className="w-64 relative cursor-pointer"
              >
                {/* Delete Button */}
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSchedule(s.id);
                  }}
                  title="Xoá lịch tưới"
                >
                  <X size={16} />
                </button>

                <div className="bg-gray-50 rounded-lg shadow-md p-4">
                  {/* Summary */}
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {formatTimeDisplay(s.time)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Thời gian tưới: {s.duration} phút
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Lặp lại: T{s.repeat.join(", T")}
                  </p>

                  {/* Toggle */}
                  <label
                    className="inline-flex items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={s.enabled}
                      onChange={(e) =>
                        updateSchedule(s.id, "enabled", e.target.checked)
                      }
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition duration-300 relative">
                      <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white border border-gray-300 rounded-full peer-checked:translate-x-full transition-transform" />
                    </div>
                    <span className="ml-3 text-sm text-gray-700">
                      Bật / Tắt
                    </span>
                  </label>

                  {/* Panel only for selected */}
                  {isSelected && (
                    <div
                      className="mt-4 bg-white border rounded-md p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Giờ tưới */}
                      <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                          Giờ tưới
                        </label>
                        <input
                          type="time"
                          className="border rounded px-2 py-1 w-full"
                          value={s.time}
                          onChange={(e) =>
                            updateSchedule(s.id, "time", e.target.value)
                          }
                        />
                      </div>

                      {/* Thời gian tưới */}
                      <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                          Thời gian tưới (phút)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          className="border rounded px-2 py-1 w-full"
                          value={s.duration}
                          onChange={(e) =>
                            updateSchedule(
                              s.id,
                              "duration",
                              Math.min(
                                Math.max(1, parseInt(e.target.value)),
                                120
                              )
                            )
                          }
                        />
                      </div>

                      {/* Lặp lại */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Lặp lại
                        </label>
                        <div className="flex gap-1 flex-wrap">
                          {dayOrder.map((day) => (
                            <button
                              key={day}
                              className={`w-8 h-8 rounded-full text-sm font-semibold border ${
                                s.repeat.includes(day)
                                  ? "bg-orange-400 text-white"
                                  : "text-gray-600"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = s.repeat.includes(day)
                                  ? s.repeat.filter((d) => d !== day)
                                  : [...s.repeat, day];
                                updateSchedule(s.id, "repeat", updated);
                              }}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ➕ Add New Clock */}
          <div
            className="w-40 h-[142px] p-4 bg-gray-50 rounded-lg shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={handleAddSchedule}
          >
            <span className="text-4xl font-bold">+</span>
          </div>
        </div>
      )}
    </div>
  );
}
