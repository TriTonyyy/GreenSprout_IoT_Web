import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import {
  createSchedule,
  deleteSchedule,
  getScheduleAPI,
} from "../../../api/scheduleApi";

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

export default function IrrigationModeSection({ deviceId }) {
  const [activeMode, setActiveMode] = useState("THEO_LICH");
  const [isIrrigationOn, setIsIrrigationOn] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const maxDuration = 15 * 60; // 15 minutes in seconds

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

  const fetchScheduleById = async (deviceId) => {
    try {
      const result = await getScheduleAPI(deviceId);
      const schedule = result.data;
      setSchedules(schedule); // ✅ updates the UI
      return schedule; // ✅ returns it to use immediately after
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      return []; // fallback to avoid breaking .length or map()
    }
  };

  useEffect(() => {
    fetchScheduleById(deviceId);
    // console.log(schedules);
  }, []);
  //OLD VERSION
  // const handleAddSchedule = () => {
  //   const newId = Math.random().toString(36).substring(2, 9); // unique string id
  //   const newSchedule = {
  //     id: newId,
  //     time: "13:00",
  //     duration: 60,
  //     repeat: [],
  //     enabled: false,
  //   };
  //   setSchedules((prev) => [...prev, newSchedule]);
  //   setSelectedScheduleId(newId);
  // };

  const handleAddSchedule = async (deviceType) => {
    const newSchedule = {
      startTime: "10:30 AM",
      duration: 60,
      status: false,
      repeat: ["Monday"],
    };
    try {
      await createSchedule({
        id_esp: deviceId,
        name: deviceType,
        data: newSchedule,
      });
      const updatedSchedules = await fetchScheduleById(deviceId);

      // Optionally select the newest one
      const latestSchedule = updatedSchedules?.[updatedSchedules.length - 1];
      if (latestSchedule?._id) {
        setSelectedSchedule(latestSchedule._id);
      }
      // console.log("Latest schedule created:", latestSchedule);
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  const handleScheduleClick = (id) => {
    setSelectedSchedule((prev) => (prev === id ? null : id));
    console.log(selectedSchedule);
  };

  const saveSchedule = async (schedule) => {
    try {
      await createSchedule({
        id_esp: deviceId,
        name: "water",
        data: schedule,
      });
      console.log("Schedule saved:", schedule);
    } catch (error) {
      console.error("Failed to save schedule:", error);
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

  const removeSchedule = async (id) => {
    try {
      await deleteSchedule(deviceId, id);
      await fetchScheduleById(deviceId);
      // Reset selection if the deleted one was selected
      if (selectedSchedule === id) {
        setSelectedSchedule(null);
      }
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  return (
    <div className="mx-5 bg-white rounded-xl shadow-md p-4 my-2">
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
      {activeMode === "THEO_LICH" && (
        <div className="flex flex-wrap gap-4 px-2 items-start">
          {schedules.map((s) => {
            const isSelected = selectedSchedule === s._id;
            return (
              <div
                key={s.id}
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
                      isOn={s.enabled}
                      onToggle={() =>
                        changeSchedule(s.id, "enabled", !s.enabled)
                      }
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
                                changeSchedule(s._id, "repeat", updated);
                              }}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isSelected && (
                    <div
                      className=" bg-white  rounded-md py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Save & Cancel Buttons */}
                      <div className=" flex justify-end gap-2">
                        <button
                          className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSchedule(null); // Cancel edits
                          }}
                        >
                          Huỷ
                        </button>
                        <button
                          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={(e) => {
                            const updatedSchedule = schedules.find(
                              (s) => s._id === selectedSchedule
                            );
                            saveSchedule(updatedSchedule);
                            e.stopPropagation();
                            setSelectedSchedule(null); // exit edit mode
                          }}
                        >
                          Lưu
                        </button>
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
            onClick={() => handleAddSchedule("water")}
          >
            <span className="text-4xl font-bold">+</span>
          </div>
        </div>
      )}
    </div>
  );
}
