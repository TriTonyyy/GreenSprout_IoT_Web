import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ToggleSwitch } from "../ToggleComponent/ToggleSwitch";
import axios from "axios";

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

const weekdayOrder = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

export default function IrrigationModeSection() {
  const [activeMode, setActiveMode] = useState("THEO_LICH");
  const [isIrrigationOn, setIsIrrigationOn] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const maxDuration = 15 * 60; // 15 minutes in seconds

  const formatTimeDisplay = (time24) => {
    if (!time24 || typeof time24 !== "string" || !time24.includes(":"))
      return "00:00";
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${suffix}`;
  };

  const fetchScheduleById = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project-iot-1.onrender.com/api/schedule/detailScheduleBy/67e2449cbf718b7f105543dc"
      );

      const schedule = response.data;

      // Transform to array if needed
      const scheduleArray = Array.isArray(schedule) ? schedule : [schedule];

      setSchedules(scheduleArray);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  };

  useEffect(() => {
    fetchScheduleById();
  }, []);

  const handleAddSchedule = () => {
    const newId = Math.random().toString(36).substring(2, 9); // unique string id
    const newSchedule = {
      id: newId,
      time: "13:00",
      duration: 10,
      repeat: [],
      enabled: false,
    };
    setSchedules((prev) => [...prev, newSchedule]);
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
          { key: "THEO_LICH", label: "Theo lịch" },
          { key: "CAM_BIEN", label: "Cảm biến" },
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
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSchedule(s.id);
                  }}
                  title="Xoá lịch tưới"
                >
                  <X size={16} />
                </button>

                <div className="bg-gray-50 rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {formatTimeDisplay(s.time)}
                  </h2>
                  <div className="text-lg font-semibold">
                    <p className="text-sm text-gray-600 py-2">
                      Thời gian tưới: {s.duration / 60} phút
                    </p>
                    <p className="text-sm text-gray-600 py-2">
                      Lặp lại:{" "}
                      {s.repeat
                        ?.sort((a, b) => weekdayOrder[a] - weekdayOrder[b])
                        .map((day) => `T${weekdayMap[day] || day}`)
                        .join(", ")}
                    </p>
                  </div>

                  <div className="flex w-4/5 py-2">
                    <span className="font-medium text-gray-700 pr-2">
                      Bật/ Tắt:
                    </span>
                    <ToggleSwitch
                      isOn={isIrrigationOn}
                      onToggle={() => setIsIrrigationOn(!isIrrigationOn)}
                    />
                  </div>

                  {isSelected && (
                    <div
                      className="mt-4 bg-white border rounded-md p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                            updateSchedule(
                              s.id,
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
                        <label className="block text-sm font-medium mb-1">
                          Lặp lại
                        </label>
                        <div className="flex gap-1 flex-wrap">
                          {dayOrder.map((day) => (
                            <button
                              key={day}
                              className={`w-8 h-8 rounded-full text-sm font-semibold border ${
                                s.repeat?.includes(day)
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
            className="w-40 h-[175px] p-4 bg-gray-50 rounded-lg shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={handleAddSchedule}
          >
            <span className="text-4xl font-bold">+</span>
          </div>
        </div>
      )}
    </div>
  );
}
