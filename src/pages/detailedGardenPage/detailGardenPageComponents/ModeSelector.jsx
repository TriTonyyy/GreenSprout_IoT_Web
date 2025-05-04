import React from 'react';
import i18n from '../../../i18n';

const ModeSelector = ({ activeMode, setActiveMode, setSelectedSchedule, isOwner }) => {
  const handleModeChange = (modeKey) => {
    setActiveMode(modeKey);
    setSelectedSchedule(null);
  };

  return (
    <div className="flex gap-3">
      {[
        { key: "THEO_LICH", label: i18n.t("schedule") },
        { key: "CAM_BIEN", label: i18n.t("sensor") },
      ].map((mode) => (
        <button
          key={mode.key}
          onClick={() => handleModeChange(mode.key)}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeMode === mode.key
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title={!isOwner ? "Bạn có thể xem nhưng không thể thay đổi cài đặt" : ""}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector; 