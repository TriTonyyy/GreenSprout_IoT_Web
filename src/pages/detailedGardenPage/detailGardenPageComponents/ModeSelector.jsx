import React from 'react';
import { apiResponseHandler } from "../../../components/Alert/alertComponent";

const ModeSelector = ({ activeMode, setActiveMode, setSelectedSchedule, isOwner }) => {
  const handleModeChange = (modeKey) => {
    if (!isOwner && (modeKey === "THEO_LICH" || modeKey === "CAM_BIEN")) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể thay đổi chế độ", "error");
      return;
    }
    setActiveMode(modeKey);
    setSelectedSchedule(null);
  };

  return (
    <div className="flex gap-3">
      {[
        { key: "THEO_LICH", label: "Theo lịch" },
        { key: "CAM_BIEN", label: "Cảm biến" },
      ].map((mode) => (
        <button
          key={mode.key}
          onClick={() => handleModeChange(mode.key)}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeMode === mode.key
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector; 