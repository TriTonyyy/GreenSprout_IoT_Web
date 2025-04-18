import React from "react";
import { format } from "date-fns";
import { timeRanges, sensorTypes } from "./constants";

const StatisticsControls = ({
  selectedGarden,
  setSelectedGarden,
  selectedSensor,
  setSelectedSensor,
  timeRange,
  handleTimeRangeChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  gardens,
  loading,
  loadingGardens,
  setUseMockData,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Garden Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Chọn vườn
          </label>
          <div className="relative">
            {loadingGardens ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg w-full"></div>
            ) : (
              <>
                <select
                  value={selectedGarden || ""}
                  onChange={(e) => {
                    setSelectedGarden(e.target.value);
                    setUseMockData(false);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg"
                >
                  <option value="">Chọn vườn</option>
                  {gardens.map((garden) => {
                    const gardenId = garden.id_esp;
                    const gardenName =
                      garden.name_area || `Vườn ${gardenId?.slice(0, 5)}`;
                    return (
                      <option
                        key={gardenId || `garden-${Math.random()}`}
                        value={gardenId}
                      >
                        {gardenName}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Sensor Type Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Loại cảm biến
          </label>
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg"
            disabled={loading}
          >
            {Object.entries(sensorTypes).map(([key, { label, unit }]) => (
              <option key={key} value={key}>
                {`${label} (${unit})`}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range Selector */}
        <div className="space-y-2 col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Khoảng thời gian
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(timeRanges).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleTimeRangeChange(key)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  timeRange === key
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={loading}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {timeRange === timeRanges.CUSTOM && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsControls;
