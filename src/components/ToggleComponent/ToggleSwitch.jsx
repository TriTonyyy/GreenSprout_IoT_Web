import React, {useState, useEffect} from 'react'

const ToggleSwitch = ({ control, isOn, onToggle }) => (
  <div className="flex items-center justify-between py-1">
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isOn}
        onChange={onToggle}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-700 transition-colors duration-300">
        <div
          className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${
            isOn ? "translate-x-5 border-white" : ""
          }`}
        ></div>
      </div>
    </label>
  </div>
);

export {ToggleSwitch};
