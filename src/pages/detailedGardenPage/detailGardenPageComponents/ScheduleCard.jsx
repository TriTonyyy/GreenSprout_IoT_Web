import React from 'react';
import { X } from "lucide-react";
import { ToggleSwitch } from "../../../components/ToggleComponent/ToggleSwitch";
import { dayDisplayMap } from "./IrrigationModeSection";

const ScheduleCard = ({
  schedule,
  isSelected,
  onSelect,
  onDelete,
  onToggleStatus,
  children,
}) => {
  return (
    <div
      onClick={() => onSelect(schedule._id)}
      className="w-80 relative cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
    >
      {/* Delete Button */}
      <button
        className="absolute top-3 right-3 text-red-500 hover:text-red-600 z-10 bg-white rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(schedule._id);
        }}
        title="Xoá lịch tưới"
      >
        <X size={16} />
      </button>

      <div
        className={`bg-gray-50 rounded-xl shadow-md p-5 border-2 ${
          isSelected ? "border-blue-500" : "border-transparent"
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {schedule.startTime}
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Thời gian tưới:</span>{" "}
            {schedule.duration / 60} phút
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Lặp lại:</span>{" "}
            {schedule.repeat && schedule.repeat.length > 0
              ? schedule.repeat
                  .map((day) => dayDisplayMap[day] || day)
                  .join(", ")
              : "Không lặp lại"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <span className="font-medium text-gray-700">Bật/ Tắt:</span>
          <ToggleSwitch
            isOn={schedule.status}
            onToggle={() => onToggleStatus(schedule._id, !schedule.status)}
          />
        </div>
        {isSelected && children}
      </div>
    </div>
  );
};

export default ScheduleCard; 