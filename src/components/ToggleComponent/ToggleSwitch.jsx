import React from "react";
import i18n from "../../i18n";

const ToggleSwitch = ({ isOn, onToggle, disabled, isLoading }) => (
  <div className="flex items-center justify-between py-1">
    <label
      className={`relative inline-flex items-center ${
        isLoading || disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isOn}
        onChange={onToggle}
        disabled={disabled || isLoading}
      />
      <div
        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-700 transition-colors duration-300 relative"
      >
        <div
          className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${
            isOn ? "translate-x-5 border-white" : ""
          }`}
        ></div>
      </div>
    </label>
  </div>
);

const ModeSelector = ({ currentMode, onChange, disabled, isLoading }) => {
  const lang = i18n.language;

  const modes = [i18n.t("manual"), i18n.t("schedule"), i18n.t("threshold")];
  let modeMap = {
    "Thủ công": "manual",
    "Theo lịch": "schedule",
    Ngưỡng: "threshold",
  };
  if (lang === "en") {
    modeMap = {
      Manual: "manual",
      Schedule: "schedule",
      Threshold: "threshold",
    };
  }

  return (
    <div className="flex space-x-2 text-xs">
      <div className="w-full flex justify-center items-center">
        {modes.map((mode) => (
          <button
            key={mode}
            className={`px-3 mx-1 py-1 rounded-md transition-colors duration-200 font-medium ${
              currentMode === modeMap[mode]
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${isLoading || disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => onChange(modeMap[mode])}
            disabled={disabled || isLoading}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export { ToggleSwitch, ModeSelector };
